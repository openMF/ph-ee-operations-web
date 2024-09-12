/** Angular Imports */
import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';



/**
 * Users component.
 */
@Component({
  selector: 'mifosx-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
})
export class UsersComponent implements OnInit {
  /** Users data. */
  usersData: any;
  /** Columns to be displayed in users table. */
  displayedColumns: string[] = ['userType', 'name', 'email', 'id'];
  /** Data source for users table. */
  dataSource: MatTableDataSource<any>;

  /** Paginator for users table. */
  @ViewChild(MatPaginator) paginator: MatPaginator;
  /** Sorter for users table. */
  @ViewChild(MatSort) sort: MatSort;

  /**
   * Retrieves the users data from `resolve`.
   * @param {ActivatedRoute} route Activated Route.
   */

  constructor(private route: ActivatedRoute, private cdr: ChangeDetectorRef) {
    this.route.data.subscribe((data: { users: any }) => {
      this.usersData = data.users;
      console.log(this.usersData);
    });
  }

  /**
   * Filters data in users table based on passed value.
   * @param {string} filterValue Value to filter data.
   */

  showFilter: { [key: string]: boolean } = {
    userType: false,
    name: false,
    email: false,
    id: false,
  };

  toggleFilter(columnName: string) {
    // Turn off all filters
    for (let key in this.showFilter) {
      if (key !== columnName) {
        this.showFilter[key] = false;
      }
    }
    this.showFilter[columnName] = !this.showFilter[columnName];
    if (!this.showFilter[columnName]) {
      this.applyFilter('', columnName); // Clear the filter
    }
  }

  applyFilter(filterValue: string, columnName: string) {
    filterValue = filterValue.trim().toLowerCase();
    this.dataSource.filterPredicate = (data, filter) => {
      let valueToCheck = '';
      switch (columnName) {
        case 'userType':
          valueToCheck = String(data.attributes.userType).toLowerCase();
          break;
        case 'name':
          valueToCheck = (data.firstName + ' ' + data.lastName).toLowerCase();
          break;
        case 'email':
          valueToCheck = String(data.email).toLowerCase();
          break;
        case 'id':
          valueToCheck = String(data.attributes.govtId || data.attributes.fspId || 'N/A').toLowerCase();
          break;
      }
      return valueToCheck.startsWith(filter);
    };
    this.dataSource.filter = filterValue;
  }

  /**
   * Sets the users table.
   */
  ngOnInit() {
    this.setUsers();
  }

  /**
   * Initializes the data source, paginator and sorter for users table.
   */
  setUsers() {
    this.dataSource = new MatTableDataSource(this.usersData);
    this.cdr.detectChanges();
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    console.log(this.dataSource);
    console.log(this.dataSource.sort);

    this.dataSource.sortingDataAccessor = (item, property) => {
      console.log(item, property);
      switch (property) {
        case 'name':
          return item.firstName + ' ' + item.lastName;
        case 'id':
          return item.attributes.govtId || item.attributes.fspId || 'N/A';
        case 'userType':
          return item.attributes.userType;
        default:
          return item[property];
      }
    };
  }
}
