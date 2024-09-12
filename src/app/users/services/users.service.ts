/** Angular Imports */
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

/** rxjs Imports */
import { catchError, forkJoin, map, Observable, of, switchMap, throwError } from 'rxjs';

/**Custom Services */
import { JbpmService } from './users-jbpm.service';
import { KeycloakAdminService } from './users-keycloak.service';

/**Custom Models */
import { User } from '../models/user.model';
import { ProcessInstance } from '../models/jbpm.model';

/**
 * Users service.
 */
@Injectable({
  providedIn: 'root',
})
export class UsersService {
  private processId = 'PaymentHubEE.UserManagementProcess';

  /**
   * @param {HttpClient} http Http Client to send requests.
   * @param {JbpmService} jbpmService Jbpm Service.
   */
  constructor(private http: HttpClient, 
              private keycloakAdminService: KeycloakAdminService,
              private jbpmService: JbpmService) { }
  /**
   * @returns {Observable<any>} User types
   */
  getUserTypes(): Observable<any> {
    const userTypes = [
      { id: 1, name: 'PayEE User', PayEEId: [''] },
      { id: 2, name: 'Govt. Entity User', GovtId: ['GOVT1', 'GOVT2', 'GOVT3'] },
      { id: 3, name: 'FSP User', FSPId: ['FSP1', 'FSP2', 'FSP3'] },
    ];

    return new Observable((observer) => {
      observer.next(userTypes);
      observer.complete();
    });
  }

  /**
   * @returns {Observable<any>} User status
   */
  userStatus(): Observable<any> {
    // Assuming user status are fetched from an API or defined
    const userStatus = [
      { id: 1, name: 'Active' },
      { id: 2, name: 'Inactive' },
      { id: 3, name: 'Blocked' },
      { id: 4, name: 'Temporary Disabled' },
    ];
    return new Observable((observer) => {
      observer.next(userStatus);
      observer.complete();
    });
  }

  /**
   * @returns {Observable<any>} Users template data
   */
  getUsersTemplate(): Observable<any> {
    return forkJoin({
      roles: this.keycloakAdminService.getAllRoles(),
      userTypes: this.getUserTypes(),
      userStatus: this.userStatus(),
    }).pipe(
      map((data) => {
        return {
          availableRoles: data.roles,
          userTypes: data.userTypes,
          userStatus: data.userStatus,
        };
      })
    );
  }

  /**
   * Creates a new user using the JBPM process
   * @param {User} user User to be created.
   * @returns {Observable<any>}
   */
  startJBPMProcess(user: User): Observable<any> {

    return this.jbpmService.startProcess(this.processId, user).pipe(
      switchMap((processInstance: number) => {
        return this.jbpmService.getTasksByProcessInstanceId(processInstance);
      }),
      switchMap((processData: ProcessInstance) => {
        if (processData['active-user-tasks'] && processData['active-user-tasks']['task-summary']) {
          const tasks = processData['active-user-tasks']['task-summary'];
          const adminMakerTask = Array.isArray(tasks) ? tasks.find((task) => task['task-name'] === 'Admin Maker Task') : tasks['task-name'] === 'Admin Maker Task' ? tasks : null;

          if (!adminMakerTask) {
            return throwError(() => new Error('Admin Maker Task not found'));
          }
          return this.completeAdminMakerTask(adminMakerTask['task-id'], user);
        } else {
          return throwError(() => new Error('No active user tasks found'));
        }
      }),
      catchError((error) => {
        console.error('Error in JBPM process:', error);
        return throwError(() => new Error(`Failed to create user: ${error.message}`));
      })
    );
  }

  /**
   * Completes the Admin Maker Task in the JBPM process
   * @param {number} taskId ID of the Admin Maker Task
   * @param {User} userData User data to complete the task
   * @returns {Observable<any>}
   */
  public completeAdminMakerTask(taskId: number, userData: User): Observable<any> {
    return this.jbpmService.startTask(taskId.toString()).pipe(
      switchMap(() => {
        return this.jbpmService.completeTask(taskId.toString(), userData);
      })
    );
  }

  /**
   * @description Get all tasks for a user from JBPM. 
   * @returns {Observable<any>} Processed tasks.
   */
  getProcessedTasks() {
    return this.jbpmService.getAllTasks().pipe(
      switchMap((response: any) => {
        if (Array.isArray(response['task-summary']) && response['task-summary'].length > 0) {
          const taskObservables = response['task-summary'].map((task: any) =>
            this.jbpmService.getTaskContent(task['task-id'])
          );
          return forkJoin(taskObservables).pipe(
            map((taskContents: any[]) => {
              return response['task-summary']
                .map((task: any, index: number) => {
                  const taskContent = taskContents[index];
                  const userData = taskContent.userData['com.myspace.paymenthubee.UserData'];
                  if (!userData) {
                    console.error('UserData not found for task:', task['task-id']);
                    return null;
                  }
                    return {
                    taskId: task['task-id'],
                    taskName: taskContent.TaskName || task['task-name'],
                    taskStatus: task['task-status'],
                    nodeName: taskContent.NodeName,
                    actorId: taskContent.ActorId,
                    username: userData.username || 'N/A',
                    email: userData.email || 'N/A',
                    firstName: userData.firstName || 'N/A',
                    lastName: userData.lastName || 'N/A',
                    mobileNo: userData.mobileNo || 'N/A',
                    userType: userData.userType || 'N/A',
                    fspId: userData.fspId || null,
                    govtId: userData.govtId || null,
                    status: userData.status || 'N/A',
                    actionType: userData.actionType || 'N/A',
                    roles: Array.isArray(userData.roles) ? userData.roles.join(', ') : 'N/A',
                    createdAt: userData.createdAt
                      ? new Date(userData.createdAt['java.util.Date']).toLocaleString()
                      : 'N/A',
                    updatedAt: userData.updatedAt
                      ? new Date(userData.updatedAt['java.util.Date']).toLocaleString()
                      : 'N/A',
                    };
                })
                .filter(Boolean);
            })
          );
        } else {
          return of([]);
        }
      })
    );
  }


  /**
   * @description Process user request
   * @param user User data
   * @param approved Approval status
   * @returns {Observable<any>} Processed user request.
   */
  processUserRequest(user: any, approved: boolean): Observable<any> {
    return this.jbpmService.startTask(user.taskId).pipe(
      switchMap(() => this.jbpmService.completeAdminTask(user.taskId, { approved })),
      switchMap(() => {
        if (!approved) {
          return of('Request not approved');
        }
        const keycloakUser = this.mapFormDataToUser(user);
        switch (user.actionType) {
          case 'CREATE':
            return this.createUser(keycloakUser);
          case 'UPDATE':
            return this.updateUser(keycloakUser);
          case 'DELETE':
            return this.deleteUser(keycloakUser);
          default:
            return throwError('Unknown action type: ' + user.actionType);
        }
      })
    );
  }

  /**
   * @description Map form data to Keycloak user data
   * @param user User data from JBPM form
   */
  private mapFormDataToUser(user: any): any {
    const roles = Array.isArray(user.roles) ? user.roles : user.roles.split(',').map((role: string) => role.trim());
    return {
      username: user.username,
      enabled: true,
      emailVerified: true,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      attributes: {
        fspId: [user.fspId],
        govtId: [user.govtId],
        mobileNo: [user.mobileNo],
        userType: [user.userType],
        roles: roles,
        status: [user.status],
      },
      credentials: [
        {
          type: 'password',
          value: user.firstName + '123', //temporary password
          temporary: false,
        },
      ],
    };
  }

  /**
   * @description Create user in Keycloak
   * @param keycloakUser Keycloak user data
   * @returns {Observable<any>} Created user.
   */
  private createUser(keycloakUser: any): Observable<any> {
    return this.keycloakAdminService.createUser(keycloakUser).pipe(
      switchMap(response => this.keycloakAdminService.getUserByUsername(keycloakUser.username)),
      switchMap(createdUser => {
        if (!createdUser || !createdUser[0]?.id) {
          return throwError('Failed to retrieve created user details');
        }
        const userId = createdUser[0].id;
        return this.assignRolesToUser(userId, keycloakUser.attributes.roles).pipe(
          switchMap(() => this.keycloakAdminService.updateUserStatus(userId, ['Active']))
        );
      })
    );
  }

  /**
   * @description Update user in Keycloak
   * @param keycloakUser Keycloak user data
   * @returns {Observable<any>} Updated user.
   */
  private updateUser(keycloakUser: any): Observable<any> {
    return this.keycloakAdminService.getUserByUsername(keycloakUser.username).pipe(
      switchMap(user => {
        const userId = user[0].id;
        return this.keycloakAdminService.updateUser(userId, keycloakUser).pipe(
          switchMap(() => this.keycloakAdminService.getRolesByUserId(userId)),
          switchMap(roles => this.keycloakAdminService.unassignRoleFromUser(userId, roles)),
          switchMap(() => this.assignRolesToUser(userId, keycloakUser.attributes.roles)),
          switchMap(() => this.keycloakAdminService.getUserByUsername(keycloakUser.username))
        );
      })
    );
  }

  /**
   * @description Delete user in Keycloak
   * @param keycloakUser Keycloak user data
   * @returns {Observable<any>} Deleted user.
   */
  private deleteUser(keycloakUser: any): Observable<any> {
    return this.keycloakAdminService.getUserByUsername(keycloakUser.username).pipe(
      switchMap(user => {
        const userId = user[0].id;
        return this.keycloakAdminService.deleteUser(userId);
      })
    );
  }

  /**
   * @description Assign roles to user
   * @param userId User ID
   * @param roles Roles to assign
   * @returns {Observable<any>} Assigned roles.
   */
  private assignRolesToUser(userId: string, roles: string[]): Observable<any> {
    return forkJoin(
      roles.map(roleName =>
        this.keycloakAdminService.getRoleByName(roleName).pipe(
          switchMap(role => this.keycloakAdminService.assignRoleToUser(userId, role))
        )
      )
    );
  }

  /**
   * @param {string} userId user ID of user.
   * @returns {Observable<any>} User.
   */
  getUser(userId: string): Observable<any> {
    return this.http.get(`/users/${userId}`);
  }
}