/** Angular Imports */
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders} from '@angular/common/http';

/** Rxjs Imports */
import { Observable } from 'rxjs';

/** Environment Configuration */
import { environment } from 'environments/environment';


/**
 * Jbpm Service
 */
@Injectable({
  providedIn: 'root',
})
export class JbpmService {

  /** Jbpm API URL */
  private jbpmApiUrl = environment.jbpm.jbpmApiUrl;
  private containerId = environment.jbpm.containerId;
  private credentials = environment.jbpm.credentials;

  /**
   * Constructor
   * @param {HttpClient} http Http Client.
   */
  constructor(private http: HttpClient) {}

  /**
   * Get Credentials
   * @returns {Object} Credentials
   */
  private getCredentials(): { username: string; password: string } {
    const userDetails = JSON.parse(
      sessionStorage.getItem('pheeOAuthUserDetails') || '{}'
    );
    const roles = userDetails?.resource_access?.opsapp?.roles || [];
    let encodedCredentials;
    if (roles.includes('Admin Maker') && roles.includes('Admin Checker')) {
      encodedCredentials = this.credentials.both;
    } else if (roles.includes('Admin Maker')) {
      encodedCredentials = this.credentials.adminMaker;
    } else if (roles.includes('Admin Checker')) {
      encodedCredentials = this.credentials.adminChecker;
    } else {
      throw new Error('Unauthorized');
    }

    const [username, password] = encodedCredentials.split(':');
    return { username, password };
  }

  /**
   * Get Headers
   * @returns {HttpHeaders} Headers
   */
  private getHeaders(): HttpHeaders {
    const credentials = this.getCredentials();
    const token = btoa(`${credentials.username}:${credentials.password}`);
    return new HttpHeaders({
      Authorization: `Basic ${token}`,
      'Content-Type': 'application/json',
    });
  }

  /**
   * Get Processes
   * @returns {Observable<any>} Processes
   */
  startProcess(processId: string, variables: any): Observable<any> {
    const url = `${this.jbpmApiUrl}/containers/${this.containerId}/processes/${processId}/instances`;
    return this.http.post(url, { variables }, { headers: this.getHeaders() });
  }

  /**
   * Get Tasks by Potential Owner
   * @returns {Observable<any>} Tasks
   */
  getTasks(potentialOwner: string, status: string[]): Observable<any> {
    const url = `${this.jbpmApiUrl}/queries/tasks/instances/pot-owners`;
    const body = {
      'potential-owner': potentialOwner,
      status: status,
    };
    return this.http.post(url, body, { headers: this.getHeaders() });
  }

  /**
   * Get All Tasks
   * @returns {Observable<any>} Tasks
   * @description Get all tasks
   */
  getAllTasks(): Observable<any> {
    const url = `${this.jbpmApiUrl}/queries/tasks/instances/pot-owners`;
    return this.http.get(url, { headers: this.getHeaders() });
  }
  
  /**
   * Get Task Content
   * @param taskId Task Id
   * @returns {Observable<any>} Task Content
   */
  getTaskContent(taskId: number): Observable<any> {
    const url = `${this.jbpmApiUrl}/containers/${this.containerId}/tasks/${taskId}/contents/input`;
    return this.http.get(url, { headers: this.getHeaders() });
  }

  /**
   * Complete Task
   * @param taskId 
   * @param variables 
   * @returns {Observable<any>}
   */
  completeAdminTask(taskId: string, variables: any): Observable<any> {
    const url = `${this.jbpmApiUrl}/containers/${this.containerId}/tasks/${taskId}/states/completed`;
    const body = { approve: variables.approved.toString() };
    return this.http.put(url, body, { headers: this.getHeaders() });
  }

  /**
   * Start Task
   * @param taskId 
   * @returns {Observable<any>}
   */
  startTask(taskId: string): Observable<any> {
    const url = `${this.jbpmApiUrl}/containers/${this.containerId}/tasks/${taskId}/states/started`;
    return this.http.put(url, {}, { headers: this.getHeaders() });
  }

  /**
   * Complete Task
   * @param taskId 
   * @param variables 
   * @returns {Observable<any>}
   * @description Complete Task
   */
  completeTask(taskId: string, variables: any): Observable<any> {
    const url = `${this.jbpmApiUrl}/containers/${this.containerId}/tasks/${taskId}/states/completed`;
    const body = {
      userData: {
        'com.myspace.paymenthubee.UserData': variables,
      },
    };
    console.log('Complete Task:', body);
    return this.http.put(url, body, { headers: this.getHeaders() });
  }


  /**
   * Get Task by Process Instance Id
   * @param ProcessInstanceId 
   * @returns {Observable<any>}
   */
  getTasksByProcessInstanceId(processInstanceId: number): Observable<any> {
    const url = `${this.jbpmApiUrl}/containers/${this.containerId}/processes/instances/${processInstanceId}`;
    // return this.http.get(`${this.jbpmApiUrl}/queries/tasks/instances/process/${processInstanceId}`);
    return this.http.get(url, { headers: this.getHeaders() });
  }

}