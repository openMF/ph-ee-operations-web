import { Component, ViewChild, OnInit } from "@angular/core";
import {
  HttpClient,
  HttpParams,
  HttpHeaders,
  JsonpClientBackend,
} from "@angular/common/http";
import { UntypedFormControl } from "@angular/forms";
import { FormsModule } from "@angular/forms";
import { MatLegacyTableModule as MatTableModule } from "@angular/material/legacy-table";

import { MatLegacyPaginator as MatPaginator } from "@angular/material/legacy-paginator";
import { MatLegacyTableDataSource as MatTableDataSource } from "@angular/material/legacy-table";
@Component({
  selector: "mifosx-bulk-batch-export",
  templateUrl: "./bulk-batch-export.component.html",
  styleUrls: ["./bulk-batch-export.component.scss"],
})
export class BulkBatchExportComponent implements OnInit {
  template = new UntypedFormControl("");
  templates: string[] = ["Mojaloop", "Program"];
  fileToUpload: File | null = null;
  batchid: any;
  displayedColumns: string[] = [
    "Transaction Id",
    "Completion Time",
    "Start Time",
    "Amount",
    "Currency",
    "Status",
    "Payer DFSP",
    "Payee DFSP",
    "Payer Party ID",
    "Payee Party ID",
    "Payee Party ID Type",
    "WorkFlow Instance Key",
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
    const url = `/api/v1/batch?batchId=${batchIdName}`;
    console.log(url);
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
  formatDateSummary(date: string) {
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
  shortenValueDetails(value: any) {
    return value && value.length > 15 ? value.slice(0, 13) + "..." : value;
  }
  ngOnInit() {
    this.getBatchSummary(history.state.data);
  }
}
