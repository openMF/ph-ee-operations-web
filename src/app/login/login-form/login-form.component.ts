/** Angular Imports */
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

/** rxjs Imports */
import { finalize } from 'rxjs/operators';

/** Custom Services */
import { AuthenticationService } from '../../core/authentication/authentication.service';
import { MatomoService } from '../../core/analytics/matomo.service';

/**
 * Login form component.
 */
@Component({
  selector: 'mifosx-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss'],
})
export class LoginFormComponent implements OnInit {
  /** Login form group. */
  loginForm: FormGroup;
  /** Password input field type. */
  passwordInputType: string;
  /** True if loading. */
  loading = false;

  /**
   * @param {FormBuilder} formBuilder Form Builder.
   * @param {AuthenticationService} authenticationService Authentication Service.
   * @param {MatomoService} matomoService Matomo Analytics Service.
   */
  constructor(
    private formBuilder: FormBuilder,
    private authenticationService: AuthenticationService,
    private matomoService: MatomoService
  ) {}

  /**
   * Creates login form.
   *
   * Initializes password input field type.
   */
  ngOnInit() {
    this.createLoginForm();
    this.passwordInputType = 'password';
  }

  /**
   * Authenticates the user if the credentials are valid.
   */
  login() {
    this.loading = true;
    this.loginForm.disable();

    // Track login attempt
    this.matomoService.trackEvent(
      'Authentication',
      'Login Attempt',
      'User Login Form'
    );

    this.authenticationService
      .login(this.loginForm.value)
      .pipe(
        finalize(() => {
          this.loginForm.reset();
          this.loginForm.markAsPristine();
          // Angular Material Bug: Validation errors won't get removed on reset.
          this.loginForm.enable();
          this.loading = false;
        })
      )
      .subscribe({
        next: (success) => {
          if (success) {
            // Track successful login
            const credentials = this.authenticationService.getCredentials();
            if (credentials) {
              this.matomoService.trackLogin(credentials.username);
              this.matomoService.setUserContext(
                credentials.username,
                undefined,
                credentials.tenantId
              );
            }
          }
        },
        error: (error) => {
          // Track login failure
          this.matomoService.trackEvent(
            'Authentication',
            'Login Failed',
            'Login Error'
          );
        },
      });
  }

  /**
   * TODO: Decision to be taken on providing this feature.
   */
  forgotPassword() {
    console.log('Forgot Password feature currently unavailable.');
  }

  /**
   * Creates login form.
   */
  private createLoginForm() {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      tenant: ['', Validators.required],
      remember: false,
    });
  }
}
