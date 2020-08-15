import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'prettyPrint'
})
export class PrettyPrintPipe implements PipeTransform {

  transform(val: any) {
    var s="";
    var tb=0;
    val=String(val);
    //console.log(val.length);
    var i=0;
    for(i=0;i<val.length;i++) {
      //console.log(i);
      if(val[i] ==='}') {
        tb=tb-1;
        for(var j=0;j<tb;j++) {
          s+="&nbsp;&nbsp;&nbsp;&nbsp;";
        }
        s+=val[i];
        if(i<val.length && val[i+1]===',') {
          s+=val[i+1];
          i++;
        }
        s+='<br/>';
        continue;
      }
      for(var j=0;j<tb;j++) {
        s+="&nbsp;&nbsp;&nbsp;&nbsp;";
      }
      
        var j=i;
        while(j<val.length) {
          if(val[j]!='\\' && val[j]!='"') {
            if(val[j]===',') {
              s+=val[j];
              s+='<br/>';
              j++;
              break;
            }
            else if(val[j]==='{') {
              s+=val[j];
              s+='<br/>';
              tb++;
              j++;
              break;
            }
            else if(val[j]==='}') {
              s+='<br/>';
              break;
            }
            else
              s+=val[j];
          }
          j++;
        } 
        i=j-1;
      
    } 
    var preS=s.substring(0,3);
    if(preS==="Mon" || preS==="Tue" || preS==="Wed" || preS==="Thu" || preS==="Fri" || preS==="Sat" || preS==="Sun") {
      s=s.replace("<br/>","");
    }
    return s;   
  }

}
