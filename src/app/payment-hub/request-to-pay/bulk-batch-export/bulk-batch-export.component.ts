import { Component } from "@angular/core";
import {
  HttpClient,
  HttpParams,
  HttpHeaders,
  JsonpClientBackend,
} from "@angular/common/http";
import { FormControl } from "@angular/forms";
export interface PeriodicElement {
  position: number;
  transactionId: string;
  status: string;
  completedAt: number;
  startedAt: number;
}
const ELEMENT_DATA: PeriodicElement[] = [
  {
    position: 1,
    transactionId: "e5eea064-1445-4d32-bc55-bd9826c779a0",
    startedAt: 1629130966000,
    completedAt: 1629130967000,
    status: "IN_PROGRESS",
  },
  {
    position: 2,
    transactionId: "3cc88b24-1df6-48e2-8b1f-5dbd02ba96b7",
    startedAt: 1629130966000,
    completedAt: 1629150766000,
    status: "IN_PROGRESS",
  },
];

@Component({
  selector: "mifosx-bulk-batch-export",
  templateUrl: "./bulk-batch-export.component.html",
  styleUrls: ["./bulk-batch-export.component.scss"],
})
export class BulkBatchExportComponent {
  template = new FormControl("");
  templates: string[] = ["Mojaloo", "Program"];
  fileToUpload: File | null = null;
  displayedColumns: string[] = [
    "position",
    "transactionId",
    "completedAt",
    "startedAt",
    "status",
  ];
  BatchSummaryData: any[] = [];
  batchId: string;
  dataSource = ELEMENT_DATA;
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

      const upload$ = this.http.post("/api/thumbnail-upload", formData);

      upload$.subscribe();
    }
  }

  getBatchSummary(batchIdName: any) {
    const url = `/api/v1/batch?batchId=${batchIdName.batchid}`;
    console.log(url);
    this.http.get(url).subscribe((data) => {
      this.BatchSummaryData.push(data);
    });
  }
}
