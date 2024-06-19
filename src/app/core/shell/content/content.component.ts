/** Angular Imports */
import { Component, OnInit } from '@angular/core';
import { ExternalIdentifierPipe } from 'app/pipes/external-identifier.pipe';

/**
 * Content component.
 */
@Component({
  selector: 'mifosx-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.scss']
})
export class ContentComponent implements OnInit {

  constructor(private externalIdentifierPipe: ExternalIdentifierPipe) { }

  ngOnInit() {
  }

  validateLabel(breadcrumb: string): string {
    if (this.isUUID(breadcrumb)) {
      return this.externalIdentifierPipe.transform(breadcrumb);
    }
    return 'labels.breadcrumbs.' + breadcrumb;
  }

  private isUUID(uuid: string): boolean {
    const s: string = '' + uuid;
    const valid = s.match('^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$');
    return (valid === null) ? false : true;
  }
}
