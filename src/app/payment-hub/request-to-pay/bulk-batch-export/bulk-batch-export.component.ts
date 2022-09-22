import { Component, ViewChild } from "@angular/core";
import {
  HttpClient,
  HttpParams,
  HttpHeaders,
  JsonpClientBackend,
} from "@angular/common/http";
import { FormControl } from "@angular/forms";
import { FormsModule } from "@angular/forms";
import { MatTableModule } from "@angular/material/table";

import { MatPaginator } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
@Component({
  selector: "mifosx-bulk-batch-export",
  templateUrl: "./bulk-batch-export.component.html",
  styleUrls: ["./bulk-batch-export.component.scss"],
})
export class BulkBatchExportComponent {
  template = new FormControl("");
  templates: string[] = ["Mojaloo", "Program"];
  fileToUpload: File | null = null;
  batchid: any;
  displayedColumns: string[] = [
    "Batch Id",
    "Transaction Id",
    "Completion Time",
    "Start Time",
  ];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  getDetailsData: any;
  dataSourceGetDetails: any;
  BatchSummaryData: any[] = [];
  batchId: string;
  handleFileInput(files: FileList) {
    this.fileToUpload = files.item(0);
  }
  fileName = "";

  constructor(private http: HttpClient) {}

  onFileSelected(event: any) {
    const file: File = event.target.files[0];

    if (file) {
      this.fileName = file.name;

      const formData = new FormData();

      formData.append("thumbnail", file);

      const upload$ = this.http.post(
        "https://bulk-connector.sandbox.fynarfin.io/batchtransactions?type=raw",
        formData
      );

      upload$.subscribe();
    }
  }

  getBatchSummary(batchIdName: any) {
    const url = `/api/v1/batch?batchId=${batchIdName.batchid}`;
    console.log(url);
    console.log(batchIdName.batchid);
    this.http.get(url).subscribe((data) => {
      this.BatchSummaryData.push(data);
    });
  }
  getBatchDetails(batchdetailsId: any) {
    console.log(batchdetailsId);
    const getBatchurl = `/api/v1/batch/detail?batchId=${batchdetailsId}`;
    this.http.get(getBatchurl).subscribe((data) => {
      console.log(data);
      this.getDetailsData = data;
      this.dataSourceGetDetails = this.getDetailsData.content;
      console.log(this.dataSourceGetDetails);
      this.dataSourceGetDetails = new MatTableDataSource<any>(
        this.getDetailsData.content
      );
      this.dataSourceGetDetails.paginator = this.paginator;
    });
  }
}
