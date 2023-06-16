import {Component, OnInit, ViewChild} from '@angular/core';
import {FieldConfig} from '../../task-view/field.interface';
import {DynamicFormComponent} from '../../task-view/components/dynamic-form/dynamic-form.component';
import {ActivatedRoute, Router} from '@angular/router';
import {ZeebeTask} from '../../zeebe-tasks.model';
import {ZeebeTaskService} from '../../zeebe-task.service';
import {ZeebeTaskFormData} from '../../zeebe-task-form-data.model';

@Component({
  selector: 'mifosx-list-task-view',
  templateUrl: './list-task-view.component.html',
  styleUrls: ['./list-task-view.component.css']
})
export class ListTaskViewComponent implements OnInit {
  @ViewChild(DynamicFormComponent) form: DynamicFormComponent;
  datasource: ZeebeTask;
  taskFormData: ZeebeTaskFormData[];
  fieldConfigs: FieldConfig[];

  constructor(private route: ActivatedRoute,
              private router: Router,
              private taskService: ZeebeTaskService) {
  }

  ngOnInit() {
    this.route.data.subscribe((data: { taskData: ZeebeTask }) => {
      this.datasource = data.taskData;
      this.fieldConfigs = <FieldConfig[]>JSON.parse(this.datasource.taskForm);
      this.taskFormData = <ZeebeTaskFormData[]>JSON.parse(this.datasource.formData);
      this.taskFormData.sort(this.compare);
    });
  }

  submit(value: any) {
    this.taskService.submitTaskData(this.datasource.id, value).subscribe();
    this.router.navigate(['../../'], { relativeTo: this.route });
  }

  compare( a: ZeebeTaskFormData, b: ZeebeTaskFormData ) {
    if ( a.index < b.index ) {
      return -1;
    }
    if ( a.index > b.index ) {
      return 1;
    }
    return 0;
  }

  claim() {
    const keys: number[] = [this.datasource.id];
    this.taskService.claim(keys).subscribe();
    this.router.navigate(['/paymenthubee/mytasks/view/' + this.datasource.id]);
  }
}
