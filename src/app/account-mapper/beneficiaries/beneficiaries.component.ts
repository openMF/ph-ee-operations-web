/** Angular Imports */
import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatExpansionPanel } from '@angular/material/expansion';

/** Custom Services */
import { AccountMapperService } from '../services/account-mapper.service';
import { AuthenticationService } from 'app/core/authentication/authentication.service';

/** Custom Models */
import { Account, AccountData } from '../models/account-mapper.model';
import { Dates } from 'app/core/utils/dates';

/**
 * Beneficiaries Component
 */
@Component({
  selector: 'mifosx-beneficiaries',
  templateUrl: './beneficiaries.component.html',
  styleUrls: ['./beneficiaries.component.scss'],
})
export class BeneficiariesComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) set matSort(sort: MatSort) {
    this.dataSource.sort = sort;
    this.setSortingAccessor();
  }
  @ViewChild('panel') panel: MatExpansionPanel;

  /** government Entity form control. */
  governmentEntity = new UntypedFormControl();
  /** financial Institution form control. */
  financialInstitution = new UntypedFormControl();
  /** functional Id form control. */
  functionalId = new UntypedFormControl();
  /** financial Address form control. */
  financialAddress = new UntypedFormControl();

  /** Toggle buttons */
  showGovernmentEntityButton = true;
  showFinancialInstitutionButton = true;

  /** Columns to be displayed in transactions table. */
  displayedColumns: string[] = ['governmentEntity', 'financialInstitution', 'functionalId', 'financialAddress', 'paymentModality'];
  /** Data source for transactions table. */
  dataSource = new MatTableDataSource();

  totalRows = 0;
  currentPage = 0;
  pageSize = 10;
  isLoading = false;
  credentials: any;

  accountsData: AccountData;

  /** Track selected filters */
  selectedFilters = {
    governmentEntity: false,
    financialInstitution: false,
    functionalId: false,
    financialAddress: false,
  };

  constructor(private dates: Dates,
    private accountMapperService: AccountMapperService,
    private cdr: ChangeDetectorRef,
    private authenticationService: AuthenticationService) {
    this.credentials = this.authenticationService.userDetails;
  }

  ngOnInit(): void {
    const userType = this.displayUserType();
    if (userType === 'Govt. Entity User') {
      this.displayedColumns = this.displayedColumns.filter((column) => column !== 'governmentEntity');
      this.showGovernmentEntityButton = false;
    }

    if (userType === 'FSP User') {
      this.displayedColumns = this.displayedColumns.filter((column) => column !== 'financialInstitution');
      this.showFinancialInstitutionButton = false;
    }
    this.getAccounts();
  }

  /** Set sorting accessor for table columns */
  private setSortingAccessor(): void {
    this.dataSource.sortingDataAccessor = (item: Account, property) => {
      switch (property) {
        case 'governmentEntity':
          return item.registeringInstitutionId;
        case 'financialInstitution':
          return item.bankingInstitutionCode;
        case 'functionalId':
          return item.payeeIdentity;
        default:
          return item.paymentModality;
      }
    };
  }

  /**
   * Get All accounts.
   * */
  getAccounts(): void {
    this.isLoading = true;
    this.accountMapperService.getAccounts(this.currentPage, this.pageSize, 'requestFile', 'asc').subscribe(
      (accounts: AccountData) => {
        this.dataSource = new MatTableDataSource(accounts.content);
        this.cdr.detectChanges();
        this.dataSource.paginator = this.paginator;
        this.totalRows = accounts.totalElements;
        this.isLoading = false;
      },
      (error: any) => {
        this.isLoading = false;
      }
    );
  }

  /**
   * Display user type.
   * */
  displayUserType(): string {
    if (this.authenticationService.isOauthKeyCloak()) {
      return this.credentials ? this.credentials.userType : '';
    } else {
      return this.credentials ? this.credentials.userType : '';
    }
  }

  /**
   * Convert timestamp to UTC date.
   * 
   * @param {any} timestamp Timestamp
   * @returns {string} UTC date
   */
  convertTimestampToUTCDate(timestamp: any): string {
    if (!timestamp) {
      return undefined;
    }
    return this.dates.formatUTCDate(new Date(timestamp));
  }

  /**
   * Page changed.
   * 
   * @param {PageEvent} event Page event
   */
  pageChanged(event: PageEvent) {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.getAccounts();
  }

  /**
   * Get payment modality description.
   * 
   * @param {string} value Value
   * @returns {string} Payment modality description
   */
  paymentModalityDescription(value: string): string {
    if (value === '0' || value === '00') {
      return '(00) Bank Account';
    } else if (value === '1' || value === '01') {
      return '(01) Mobile Money';
    } else if (value === '2' || value === '02') {
      return '(02) Voucher';
    } else if (value === '3' || value === '03') {
      return '(03) Digital Wallet';
    } else if (value === '4' || value === '04') {
      return '(04) Proxy';
    }
    return value;
  }

  /**
   * Search accounts by filtering with form control values.
   */
  searchAccounts(): void {
    const filterValues = this.extractFilterValues();
    this.setFilterPredicate();
    this.applyFilters(filterValues);
    this.updateSelectedFilters();
    this.panel.close();
  }

  /**
   * Extract filter values from form controls.
   * @returns {any} Filter values
   */
  private extractFilterValues(): any {
    return {
      governmentEntity: this.governmentEntity.value ? this.governmentEntity.value.trim().toLowerCase() : '',
      financialInstitution: this.financialInstitution.value ? this.financialInstitution.value.trim().toLowerCase() : '',
      functionalId: this.functionalId.value ? this.functionalId.value.trim().toLowerCase() : '',
      financialAddress: this.financialAddress.value ? this.financialAddress.value.trim().toLowerCase() : ''
    };
  }

  /**
   * Set the filter predicate for the MatTableDataSource.
   */
  private setFilterPredicate(): void {
    this.dataSource.filterPredicate = (data: Account, filter: string) => {
      const searchTerms = JSON.parse(filter);
      return (
        data.registeringInstitutionId.toLowerCase().includes(searchTerms.governmentEntity) &&
        data.bankingInstitutionCode.toLowerCase().includes(searchTerms.financialInstitution) &&
        data.payeeIdentity.toLowerCase().includes(searchTerms.functionalId) &&
        data.financialAddress.toLowerCase().includes(searchTerms.financialAddress)
      );
    };
  }

  /**
   * Apply the filters to the dataSource.
   * @param {any} filterValues The values to filter the dataSource with
   */
  private applyFilters(filterValues: any): void {
    this.dataSource.filter = JSON.stringify(filterValues);

    // Reset paginator to the first page after applying filters
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  /**
   * Update the selected filters based on the current form control values.
   */
  private updateSelectedFilters(): void {
    this.selectedFilters.governmentEntity = !!this.governmentEntity.value;
    this.selectedFilters.financialInstitution = !!this.financialInstitution.value;
    this.selectedFilters.functionalId = !!this.functionalId.value;
    this.selectedFilters.financialAddress = !!this.financialAddress.value;
  }

  /**
   * Toggle the filter panel.
   * 
   * @param {MouseEvent} event Mouse event
   */
  togglePanel(event?: MouseEvent) {
    if (event) {
      event.stopPropagation();
    }
    this.panel.toggle();
  }

  /**
   * Remove a filter.
   * 
   * @param {string} filterType Filter type
   * @param {MouseEvent} event Mouse event
   */
  removeFilter(filterType: string, event?: MouseEvent): void {
    event?.stopPropagation();
    (this as any)[filterType].reset();
    this.searchAccounts();
  }
}
