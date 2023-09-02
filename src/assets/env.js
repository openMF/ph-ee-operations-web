(function(window) {
    window["env"] = window["env"] || {};
  
    // BackEnd Environment variables
    window["env"]["serverApiUrls"] = '';
    window["env"]["serverApiUrl"]  = '';
  
    window["env"]["apiPath"] = '';
    window["env"]["apiVersion"]  = '/v1';
  
    window["env"]["platformTenantId"]  = '';
    window["env"]["platformTenantIds"]  = '';
  
    window["env"]["authEnabled"] = '';
    window["env"]["oauthEnabled"] = '';
    window["env"]["oauthServerUrl"] = '';
    window["env"]["oauthBasicAuth"] = '';
    window["env"]["oauthBasicAuthToken"] = '';
  
    // Language Environment variables
    window["env"]["defaultLanguage"] = 'en';
    window["env"]["supportedLanguages"] = 'en,fr';

  })(this);