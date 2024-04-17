import {
    Component,
    OnInit,
    Input,
    Output,
    EventEmitter,
    ViewChild
  } from "@angular/core";
  import { MatPaginator, PageEvent } from "@angular/material/paginator";
  import { Subject } from 'rxjs';
  import { debounceTime } from 'rxjs/operators';
  
  @Component({
    selector: "mat-paginator-goto",
    templateUrl: "./mat-paginator-goto.component.html",
    styleUrls: ["./mat-paginator-goto.component.scss"]
  })
  export class MatPaginatorGotoComponent implements OnInit {
    pageSize: number;
    pageIndex: number;
    length: number;
    goTo: number;
    maxPageNumber: number;
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @Input() disabled = false;
    @Input() hidePageSize = false;
    @Input() pageSizeOptions: number[];
    @Input() showFirstLastButtons = false;
    @Output() page = new EventEmitter<PageEvent>();
    @Input("pageIndex") set pageIndexChanged(pageIndex: number) {
      this.pageIndex = pageIndex;
      this.updateGoto();
    }
    @Input("length") set lengthChanged(length: number) {
      this.length = length;
      this.updateGoto();
    }
    @Input("pageSize") set pageSizeChanged(pageSize: number) {
      this.pageSize = pageSize;
      this.updateGoto();
    }

    private debouncer: Subject<number> = new Subject<number>();
  
    constructor() {}
  
    ngOnInit() {
      this.updateGoto();
      this.debouncer.pipe(debounceTime(500)).subscribe(() => {
        this.goToChange();
      });
    }

    goToChangeWithDebounce() {
      this.debouncer.next();
    }
  
    updateGoto() {
      this.maxPageNumber = Math.ceil(this.length / this.pageSize);
      if (this.goTo > this.maxPageNumber) {
        this.goTo = this.maxPageNumber;
      } else {
        this.goTo = (this.pageIndex || 0) + 1;
      }
    }
  
    paginationChange(pageEvt: PageEvent) {
      this.length = pageEvt.length;
      this.pageIndex = pageEvt.pageIndex;
      this.pageSize = pageEvt.pageSize;
      this.updateGoto();
      this.emitPageEvent(pageEvt);
    }
  
    goToChange() {
      this.maxPageNumber = Math.ceil(this.length / this.pageSize);
      if (this.goTo > this.maxPageNumber) {
        this.goTo = this.maxPageNumber;
      }
      this.paginator.pageIndex = this.goTo - 1;
      const event: PageEvent = {
        length: this.paginator.length,
        pageIndex: this.paginator.pageIndex,
        pageSize: this.paginator.pageSize
      };
      this.paginator.page.next(event);
      this.emitPageEvent(event);
    }
  
    emitPageEvent(pageEvent: PageEvent) {
      this.page.next(pageEvent);
    }
  }
  