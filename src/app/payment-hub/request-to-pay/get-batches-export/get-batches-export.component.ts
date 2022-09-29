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
import { MatPaginator } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";

import { FormControl, NgForm } from "@angular/forms";
@Component({
  selector: "mifosx-get-batches-export",
  templateUrl: "./get-batches-export.component.html",
  styleUrls: ["./get-batches-export.component.scss"],
})
export class GetBatchesExportComponent implements AfterViewInit {
  @Output() redirect: EventEmitter<any> = new EventEmitter();
  template = new FormControl("");
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
      `/api/v1/batches?page=3&size=20&sortedBy=requestFile&sortedOrder=asc`
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
  fileName = "";
  onFileSelected(event: any) {
    const file: File = event.target.files[0];

    if (file) {
      this.fileName = file.name;

      const formdata = new FormData();

      formdata.append("data", "download.csv");
      formdata.append("requestId", "3a4dfab5-0f4f-4e78-b6b5-1aff3859d4e8");
      formdata.append("purpose", "iliydufkgiku");

      const upload$ = this.http
        .disableApiPrefix()
        .post(
          "https://bulk-connector.sandbox.fynarfin.io/bulk/transfer/3a4dfab5-0f4f-4e78-b6b5-1aff3859d4e8/download.csv",
          formdata
        );

      upload$.subscribe();
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
