import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { FormControl } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { ReplaySubject, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { OptionData } from '../models/general.models';

@Component({
  selector: 'mifosx-option-data-selector',
  templateUrl: './option-data-selector.component.html',
  styleUrls: ['./option-data-selector.component.scss']
})
export class OptionDataSelectorComponent implements OnInit, OnChanges, OnDestroy {

  @Input() inputFormControl: FormControl;
  @Input() inputList: OptionData[] = [];
  @Input() inputLabel = '';

  public filteredOptions: ReplaySubject<OptionData[]> = new ReplaySubject<OptionData[]>(1);
  public filterFormCtrl: FormControl = new FormControl('');
  protected _onDestroy = new Subject<void>();
  placeHolderLabel = '';
  noEntriesFoundLabel = '';

  constructor(private translateService: TranslateService) { }

  ngOnInit() {
    this.filterFormCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.searchOptionData();
      });
    this.placeHolderLabel = this.translateService.instant('labels.inputs.Filter');
    this.noEntriesFoundLabel = this.translateService.instant('labels.text.No data found');
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.inputList) {
      this.filteredOptions.next(this.inputList.slice());
    }
  }

  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
  }

  searchOptionData(): void {
    if (this.inputList) {
      const search: string = this.filterFormCtrl.value.toLowerCase();

      if (!search) {
          this.filteredOptions.next(this.inputList.slice());
      } else {
        this.filteredOptions.next(this.inputList.filter((od: OptionData) => {
          return od.option.toLowerCase().indexOf(search) >= 0;
        }));
      }
    }
  }

}
