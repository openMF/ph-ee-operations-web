import {Pipe, PipeTransform} from '@angular/core';
import * as vkbeautify from 'vkbeautify';

@Pipe({
    name: 'prettyPrint'
})
export class PrettyPrintPipe implements PipeTransform {

    transform(value: any) {
        if (value.charAt(0) === '{' && value.charAt(value.length - 1) === '}') {
            return vkbeautify.json(value);
        }

        if (value.charAt(0) === '<' && value.charAt(value.length - 1) === '>') {
            return '<textarea>'
                + vkbeautify.xml(unescape(value), 40)
                + '</textarea>';
        }

        return value;
    }
}
