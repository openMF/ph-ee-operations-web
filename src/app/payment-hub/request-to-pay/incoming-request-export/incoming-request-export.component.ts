import { Component, OnInit } from '@angular/core';

import { HttpClient, HttpParams , HttpHeaders, JsonpClientBackend} from '@angular/common/http';
@Component({
  selector: 'mifosx-incoming-request-export',
  templateUrl: './incoming-request-export.component.html',
  styleUrls: ['./incoming-request-export.component.scss']
})
export class IncomingRequestExportComponent implements OnInit {
  csvExport : [];
  csvName: string;
  constructor(private http: HttpClient) { }

  ngOnInit(): void {
  }
  onSubmit(){
    this.exportCSV(this.csvExport,this.csvName);
  }
  exportCSV(filterBy:any,filterName:string) {
    console.log(filterBy);
    var postData = filterBy.transactionid.split(',');
    console.log(postData)
    
    this.http.post("/api/v1/transactionRequests/export?filterBy="+filterBy.cars,
    
    postData,{responseType: 'blob'as 'json',headers: new HttpHeaders().append("Content-Type", "application/json")}
    )
    .subscribe(
        (val) => {
            console.log("POST call successful value returned in body", 
                        val);
                        this.downLoadFile(val,"application/csv")
        })
}
downLoadFile(data: any, type: string) {
  let blob = new Blob([data], { type: type});
  let url = window.URL.createObjectURL(blob);
  let pwa = window.open(url);
  if (!pwa || pwa.closed || typeof pwa.closed == 'undefined') {
      alert( 'Please disable your Pop-up blocker and try again.');
  }
}
}
