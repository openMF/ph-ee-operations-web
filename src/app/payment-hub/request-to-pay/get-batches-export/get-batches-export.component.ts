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

  dataSource: any;
  BatchSummaryData: any[] = [];
  batchIdSummary: string;
  batchId: string;
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
      "/api/v1/batches?page=2&size=10&sortedBy=requestFile&sortedOrder=asc"
    );

    this.posts.subscribe((data) => {
      this.getBatchesContent = data.content.map((i: any) => i);
      console.log(this.getBatchesContent);
      this.dataSource = new MatTableDataSource<any>(this.getBatchesContent);
      this.dataSource.paginator = this.paginator;
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

      const upload$ = this.http.post(
        "/bulk/transfer/3a4dfab5-0f4f-4e78-b6b5-1aff3859d4e8/download.csv",
        formdata
      );

      upload$.subscribe();
    }
  }
  getBatchID(batchIdValue: any) {
    this.batchIdSummary = batchIdValue;
    console.log(this.batchIdSummary);
  }
  getBatchDetails(batch_id: any) {
    const batchDetails = `/api/v1/batch/detail?batchId=${batch_id}`;
    this.http.get(batchDetails).subscribe((data) => {
      console.log(data);
    });
  }
  // ngOnInit() {
  //   this.getPosts();
  //   this.dataSource = new MatTableDataSource<any>(this.getBatchesContent);
  //   console.log(this.dataSource);
  //   this.dataSource.paginator = this.paginator;
  // }

  ngAfterViewInit() {
    this.getPosts();
  }
}
