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
    let body = new HttpParams();
    body = body.set("command", "export");
    let startFrom = filterBy.startdate;
    let startTo = filterBy.enddate;
    let state = filterBy.cars;
    if (startFrom != "") {
      body = body.set("startFrom", filterBy.startdate);
    }
    if (state != "") {
      body = body.set("state", filterBy.cars);
    }
    if (startTo != "") {
      body = body.set("startTo", filterBy.enddate);
    }
    console.log(body);
    const exportURl = "/api/v1/transactionRequests?" + body;

    var postData = {
      transactionId: filterBy.transactionid.split(","),
      externalid: filterBy.externalid.split(","),
      workflowinstancekey: filterBy.workflowinstancekey.split(","),
      errorDescription: filterBy.errordescription.split(","),
      payeeId: filterBy.payeeid.split(","),
      payerId: filterBy.payerid.split(","),
    };

    console.log(Object.values(postData).toString().split(","));
    this.http
      .post(
        exportURl,

        JSON.stringify(postData),

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
