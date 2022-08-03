import { Component, OnInit } from "@angular/core";
import {
  HttpClient,
  HttpParams,
  HttpHeaders,
  JsonpClientBackend,
} from "@angular/common/http";
@Component({
  selector: "mifosx-incoming-request-export",
  templateUrl: "./incoming-request-export.component.html",
  styleUrls: ["./incoming-request-export.component.scss"],
})
export class IncomingRequestExportComponent implements OnInit {
  csvExport: [];
  csvName: string;
  constructor(private http: HttpClient) {}

  ngOnInit(): void {}
  onSubmit() {
    this.exportCSV(this.csvExport, this.csvName);
  }
  arrayConvert(event: any) {
    event.target.value.split(",");
  }
  exportCSV(filterBy: any, filterName: string) {
    const exportURl =
      "/api/v1/transactionRequests?command=export&state=" +
      filterBy.cars +
      "&startTo=" +
      filterBy.startdate;
    var postData = {
      transactionId: filterBy.transactionid.split(","),
      externalid: filterBy.externalid.split(","),
      workflowinstancekey: filterBy.workflowinstancekey.split(","),
    };

    console.log(Object.values(postData).toString().split(","));
    this.http
      .post(
        exportURl,

        postData,
        {
          responseType: "blob" as "json",
          headers: new HttpHeaders().append("Content-Type", "application/json"),
        }
      )
      .subscribe((val) => {
        console.log("POST call successful value returned in body", val);
        this.downLoadFile(val, "application/csv");
      });
  }
  downLoadFile(data: any, type: string) {
    let blob = new Blob([data], { type: type });
    let url = window.URL.createObjectURL(blob);
    let pwa = window.open(url);
    if (!pwa || pwa.closed || typeof pwa.closed == "undefined") {
      alert("Please disable your Pop-up blocker and try again.");
    }
  }
}
