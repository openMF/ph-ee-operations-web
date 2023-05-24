import {Pipe, PipeTransform} from '@angular/core';
import * as vkbeautify from 'vkbeautify';

@Pipe({
    name: 'prettyPrint'
})
export class PrettyPrintPipe implements PipeTransform {

    transform(value: any) {
        if (value.charAt(0) === '{' && value.charAt(value.length - 1) === '}') {
            return JSON.stringify(value, null, 2)
                .replace(' ', '&nbsp;')
                .replace('\n', '<br/>');
        }

        if (value.charAt(0) === '<' && value.charAt(value.length - 1) === '>') {
            return vkbeautify.xml(value);
        }

        return value;
    }
}
