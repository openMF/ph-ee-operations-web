/**
 * OAuth2 token model.
 */
export interface OAuth2Token {
  accessToken: string;
  accessTokenExpiration: string;
  passwordExpiration: string;
  refreshTokenExpiration: string;
  tokenType: string;
}
