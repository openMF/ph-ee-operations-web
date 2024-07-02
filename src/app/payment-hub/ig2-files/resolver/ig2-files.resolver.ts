/** Angular Imports */
import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';

/** rxjs Imports */
import { Observable } from 'rxjs';

/** Custom Services */
import { Ig2FilesService } from '../service/ig2-files.service';

/**
 * Ig2 File data resolver.
 */
@Injectable()
export class Ig2FilesResolver implements Resolve<Object> {

  /**
   * @param {Ig2FilesService} ig2FilesService Ig2 Files service.
   */
  constructor(private ig2FilesService: Ig2FilesService) { }

  /**
   * Returns the ig2 file data.
   * @returns {Observable<any>}
   */
  resolve(route: ActivatedRouteSnapshot): Observable<any> {
    const fileId = route.paramMap.get('id');
    return this.ig2FilesService.getIg2FileDetail(fileId);
  }

}
