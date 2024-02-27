/**
 * OAuth2 token model.
 */
export interface OAuth2Token {
  access_token: string;
  token_type: string;
  refresh_token: string;
  expires_in: number;
  scope: string;
  jti: string;
}

export interface Introspect {
  exp:                number;
  iat:                number;
  jti:                string;
  iss:                string;
  aud:                string[];
  sub:                string;
  typ:                string;
  azp:                string;
  session_state:      string;
  name:               string;
  given_name:         string;
  preferred_username: string;
  email:              string;
  email_verified:     boolean;
  acr:                string;
  realm_access:       RealmAccess;
  resource_access:    ResourceAccess;
  scope:              string;
  sid:                string;
  client_id:          string;
  username:           string;
  active:             boolean;
}

export interface RealmAccess {
  roles: string[];
}

export interface ResourceAccess {
  'realm-management': RealmAccess;
  broker:             RealmAccess;
  account:            RealmAccess;
}
