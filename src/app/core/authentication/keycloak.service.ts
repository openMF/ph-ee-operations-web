import { Injectable } from '@angular/core';
import { KeycloakService as KeycloakAngularService } from 'keycloak-angular';
import { KeycloakProfile } from 'keycloak-js';
import { environment } from '../../../environments/environment';
import { Observable, from } from 'rxjs';
import { map } from 'rxjs/operators';
import jwt_decode from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class KeycloakAuthService {

  constructor(private keycloakService: KeycloakAngularService) {}

  /**
   * Initialize Keycloak
   */
  async initKeycloak(): Promise<boolean> {
    try {
      const authenticated = await this.keycloakService.init({
        config: {
          url: environment.oauth.serverUrl,
          realm: environment.oauth.realm,
          clientId: environment.oauth.client_id
        },
        initOptions: {
          onLoad: 'check-sso',
          silentCheckSsoRedirectUri: window.location.origin + '/assets/silent-check-sso.html',
          checkLoginIframe: false,
          pkceMethod: 'S256'
        },
        loadUserProfileAtStartUp: false
      });

      if (authenticated) {
        console.log('User is authenticated');
        return true;
      } else {
        console.log('User is not authenticated');
        return false;
      }
    } catch (error) {
      console.error('Keycloak initialization failed:', error);
      // Don't fail the app initialization, just return false
      return false;
    }
  }

  /**
   * Login user
   */
  login(): void {
    this.keycloakService.login({
      redirectUri: environment.oauth.redirectUri,
      prompt: 'login'
    });
  }

  /**
   * Logout user
   */
  logout(): void {
    this.keycloakService.logout(environment.oauth.redirectUri);
  }

  /**
   * Check if user is authenticated
   */
  async isAuthenticated(): Promise<boolean> {
    try {
      return await this.keycloakService.isLoggedIn();
    } catch (error) {
      console.warn('Keycloak not initialized yet:', error);
      return false;
    }
  }

  /**
   * Get user profile
   */
  getUserProfile(): Observable<KeycloakProfile> {
    return from(this.keycloakService.loadUserProfile().catch(error => {
      console.warn('Failed to load user profile:', error);
      return null;
    }));
  }

  /**
   * Get user token
   */
  getToken(): string {
    try {
      const keycloakInstance = this.keycloakService.getKeycloakInstance();
      return keycloakInstance?.token || '';
    } catch (error) {
      console.warn('Keycloak instance not available yet:', error);
      return '';
    }
  }

  /**
   * Get user roles
   */
  getUserRoles(): string[] {
    return this.keycloakService.getUserRoles();
  }

  /**
   * Check if user has specific role
   */
  hasRole(role: string): boolean {
    return this.keycloakService.isUserInRole(role);
  }

  /**
   * Get username
   */
  getUsername(): string {
    try {
      const token = this.getToken();
      if (token) {
        const decoded = jwt_decode(token) as any;
        return decoded.preferred_username || decoded.username || decoded.email || 'Keycloak User';
      }
    } catch (tokenError) {
      console.warn('Could not decode token for username:', tokenError);
    }
    
    try {
      return this.keycloakService.getUsername();
    } catch (error) {
      console.warn('Could not get username from Keycloak service:', error);
    }
    
    return 'Keycloak User';
  }



  /**
   * Refresh token
   */
  async refreshToken(): Promise<void> {
    try {
      await this.keycloakService.getKeycloakInstance().updateToken(70);
    } catch (error) {
      console.error('Token refresh failed:', error);
      this.login();
    }
  }

  /**
   * Get authorization header
   */
  getAuthorizationHeader(): string {
    const token = this.getToken();
    return token ? `Bearer ${token}` : '';
  }
} 