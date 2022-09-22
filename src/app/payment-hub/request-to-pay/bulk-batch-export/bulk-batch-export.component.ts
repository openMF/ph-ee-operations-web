import { Component } from "@angular/core";
import {
  HttpClient,
  HttpParams,
  HttpHeaders,
  JsonpClientBackend,
} from "@angular/common/http";
import { FormControl } from "@angular/forms";

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
