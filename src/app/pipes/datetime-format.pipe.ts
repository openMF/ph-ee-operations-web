import { Pipe, PipeTransform } from '@angular/core';
import { SettingsService } from 'app/settings/settings.service';
import moment from 'moment';

@Pipe({
  name: 'datetimeFormat'
})
export class DatetimeFormatPipe implements PipeTransform {

  constructor(private settingsService: SettingsService) {
  }

  transform(value: any, datetimeFormat?: string): any {
    if (typeof value === 'undefined') {
      return '';
    }
    let dateVal;
    if (value instanceof Array) {
      dateVal = moment(value.join('-'), 'YYYY-MM-DD HH:mm:ss');
    } else {
      dateVal = moment(value);
    }
    if (datetimeFormat == null) {
      return dateVal.format('YY-MM-DD' +"/" +' HH:mm:ss');
    }
    return dateVal.format(datetimeFormat);
  }
}
