/** Angular Imports */
import { Component } from '@angular/core';

/** Custom Services */
import { AuthenticationService } from 'app/core/authentication/authentication.service';

/** Custom Models */
import { Section } from 'app/payment-hub/filter-selector/section-model';


/**
 * Filter selector component.
 */
@Component({
  selector: 'mifosx-filter-selector',
  templateUrl: './filter-selector.component.html',
  styleUrls: ['./filter-selector.component.scss']
})
export class FilterSelectorComponent {
  sections: Section[];
  credentials: any;

  /**
   * @param {AuthenticationService} authenticationService Authentication service.
   */
  constructor(private authenticationService: AuthenticationService) {
    this.credentials = this.authenticationService.userDetails;
   }

  ngOnInit(): void {
    this.sections = [
      { label: 'Beneficiaries', routeTo: ['dashboard','account-mapper', 'beneficiaries'], active: true, disabled: false },
      { label: 'Create Beneficiaries', routeTo: ['dashboard','account-mapper', 'create-beneficiaries'], active: false, disabled: this.isDisabled() },
    ];
  }

  /**
   * Get the user type.
   */
  getUserType(): string {
    if (this.authenticationService.isOauthKeyCloak()) {
      return this.credentials ? this.credentials.userType : '';
    } else {
      return this.credentials ? this.credentials.userType : '';
    }
  }

  /**
   * Check if the user is a government entity user.
   */
  isDisabled(): boolean {
    return this.getUserType() !== 'Govt. Entity User';
  }

  /**
   * Set the active section.
   * 
   * @param {Section} s Section to set active.
   */
  setActive(s: Section): void {
    this.sections.forEach((section: Section) => {
      section.active = false;
      if (section.label === s.label) {
        section.active = true;
      }
    });
  }
}
