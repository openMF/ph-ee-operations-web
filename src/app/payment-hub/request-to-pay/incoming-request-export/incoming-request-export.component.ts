import { Component, OnInit } from "@angular/core";
import { RequestToPayService } from "../service/request-to-pay.service";
@Component({
  selector: "mifosx-incoming-request-export",
  templateUrl: "./incoming-request-export.component.html",
  styleUrls: ["./incoming-request-export.component.scss"],
})
export class IncomingRequestExportComponent implements OnInit {
  csvExport: [];
  csvName: string;
  constructor(private requestToPayService: RequestToPayService) {}

  ngOnInit(): void {}
  onSubmit() {
    this.exportCSV(this.csvExport, this.csvName);
  }
  arrayConvert(event: any) {
    event.target.value.split(",");
  }
  exportCSV(filterBy: any, filterName: string) {
    this.requestToPayService.exportCSV(filterBy, filterName);
  }
}
