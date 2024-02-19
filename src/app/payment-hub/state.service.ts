import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

@Injectable({
  providedIn: 'root',
})
export class StateService {
  private states: { [key: string]: any } = {};

  getState(componentName: string) {
    return this.states[componentName] || undefined;
  }

  setState(componentName: string, filterForm: FormGroup, filterBy: any, sort: MatSort, paginator: MatPaginator) {
    const stateToStore = {
      filterForm: filterForm.value,
      filterBy: filterBy,
      sort: sort,
      paginator: paginator
    };
    this.states[componentName] = { ...this.states[componentName], ...stateToStore };
  }

  clearState(componentName: string) {
    delete this.states[componentName];
  }
}