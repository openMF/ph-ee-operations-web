import { Component } from '@angular/core';
import { AccountMapperService } from '../services/account-mapper.service';
import { UntypedFormControl } from '@angular/forms';
import { TransactionsDataSource } from 'app/payment-hub/transactions/dataSource/transactions.datasource';

@Component({
  selector: 'mifosx-account-mapper',
  templateUrl: './account-mapper.component.html',
  styleUrls: ['./account-mapper.component.scss']
})
export class AccountMapperComponent {
  /** government Entity form control. */
  governmentEntity = new UntypedFormControl();
  /** financial Institution form control. */
  financialInstitution = new UntypedFormControl();
  /** functional Id form control. */
  functionalId = new UntypedFormControl();
  /** financial Address form control. */
  financialAddress = new UntypedFormControl();

  /** Columns to be displayed in transactions table. */
  displayedColumns: string[] = ['governmentEntity', 'financialInstitution', 'functionalId', 'financialAddress'];
  /** Data source for transactions table. */
  dataSource: TransactionsDataSource;

  batchesData: any;

  page: number = 0;
  size: number = 100;

  constructor(private accountMapperService: AccountMapperService) { }

  ngOnInit(): void {
    this.getAccounts();
  }

  getAccounts(): void {
    this.accountMapperService.getAccounts(this.page, this.size, 'requestFile', 'asc')
    .subscribe((batches: any) => {
      this.batchesData = batches;
    });
  }


  searchAccounts(): void {

  }
}
