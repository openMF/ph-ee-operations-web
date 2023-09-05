import {
  Component,
  OnInit,
  EventEmitter,
  Output,
  ViewChild,
  AfterViewInit,
} from "@angular/core";
import { Observable, Subscription } from "rxjs";
import { Router } from "@angular/router";
import { HttpClient, HttpParams, HttpHeaders } from "@angular/common/http";
import { MatLegacyPaginator as MatPaginator } from "@angular/material/legacy-paginator";
import { MatLegacyTableDataSource as MatTableDataSource } from "@angular/material/legacy-table";

import { UntypedFormControl, NgForm } from "@angular/forms";
@Component({
  selector: "mifosx-get-batches-export",
  templateUrl: "./get-batches-export.component.html",
  styleUrls: ["./get-batches-export.component.scss"],
})
export class GetBatchesExportComponent implements AfterViewInit {
  @Output() redirect: EventEmitter<any> = new EventEmitter();
  template = new UntypedFormControl("");
  templates: string[] = ["Mojaloo", "Program"];
  fileToUpload: File | null = null;
  posts: Observable<any>;
  getBatchesContent: any;
  lengthGetBatches: any;
  pageSize: any;
  currentPageIndex: any = 0;
  getBatchesData: any;
  pageNumber: any;
  dataSource: any;
  BatchSummaryData: any[] = [];
  batchIdSummary: string;
  batchId: string;
  firstPage: any;
  pageIndex: number = 0;
  resbatch: any;
  displayedColumns: string[] = [
    "Batch Id",
    "Request Id",
    "Completed",
    "Completion Time",
    "Failed",
    "Total",
  ];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  constructor(private http: HttpClient, private router: Router) {}
  changeComponent(url: string) {
    this.redirect.emit(this.getBatchesContent.batch_id); //emits the data to the parent
    this.router.navigate([]); //redirects url to new component
  }
  public getPosts() {
    this.posts = this.http.get<any[]>(
      `/api/v1/batches?page=0&size=200&sortedBy=requestFile&sortedOrder=asc`
    );

    this.posts.subscribe((data) => {
      this.getBatchesData = data;
      this.lengthGetBatches = this.getBatchesData.totalElements;
      this.firstPage = this.getBatchesData.first;
      this.getBatchesContent = data.content.map((i: any) => i);
      console.log(this.getBatchesData.totalElements);
      this.dataSource = new MatTableDataSource<any>(this.getBatchesContent);
      this.dataSource.paginator = this.paginator;
      this.currentPageIndex = this.currentPageIndex + 1;
      console.log(this.currentPageIndex);
    });
  }
  handleFileInput(files: FileList) {
    this.fileToUpload = files.item(0);
  }
  generateUUID() { 
    var d = new Date().getTime();
    var d2 = ((typeof performance !== 'undefined') && performance.now && (performance.now()*1000)) || 0;
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16;
        if(d > 0){
            r = (d + r)%16 | 0;
            d = Math.floor(d/16);
        } else {
            r = (d2 + r)%16 | 0;
            d2 = Math.floor(d2/16);
        }
        return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
}
  fileName = "";
  reqId = ""
  onFileSelected(event: any) {
    const file: File = event.target.files[0];

    if (file) {
      this.fileName = file.name;
      this.reqId = this.generateUUID();
      const formdata = new FormData();
      
      formdata.append("data", event.target.files[0], this.fileName);
      formdata.append("requestId",  this.reqId);
      formdata.append("purpose", "iliydufkgiku");

      const upload$ = this.http
        .disableApiPrefix()
        .post(
          `https://bulk-connector.sandbox.fynarfin.io/bulk/transfer/${this.reqId}/${this.fileName}`,
          formdata
        );

      upload$.subscribe((res) => {
        if (res) {
          this.resbatch = res;
          console.log(this.resbatch.batch_id);
          if (res) {
            this.router.navigate(
              ["/paymenthubee/getbatchexport/bulkbatchesexport"],
              {
                state: { data: this.resbatch.batch_id },
              }
            );
          }
        }
      });
    }
  }


  getBatchID(batchIdValue: any) {
    this.batchIdSummary = batchIdValue;
    console.log(this.batchIdSummary);
  }

  getBatchSummaryinfo(batchidsummarydata: any) {
    console.log(batchidsummarydata);

    this.router.navigate(["/paymenthubee/getbatchexport/bulkbatchesexport"], {
      state: { data: batchidsummarydata },
    });
  }
  formatDate(date: string) {
    if (!date) {
      return undefined;
    }
    var date2 = new Date(date);
    const year = date2.getFullYear();
    const month = "0" + (date2.getMonth() + 1);
    const day = "0" + date2.getDate();
    // Hours part from the timestamp
    const hours = "0" + date2.getHours();
    // Minutes part from the timestamp
    const minutes = "0" + date2.getMinutes();
    // Seconds part from the timestamp
    const seconds = "0" + date2.getSeconds();

    // Will display time in 2020-04-10 18:04:36 format
    return (
      year +
      "-" +
      month.substr(-2) +
      "-" +
      day.substr(-2) +
      "  " +
      hours.substr(-2) +
      ":" +
      minutes.substr(-2) +
      ":" +
      seconds.substr(-2)
    );
  }
  ngAfterViewInit() {
    this.currentPageIndex = 0;
    this.getPosts();
  }
}
