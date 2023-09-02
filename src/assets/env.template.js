(function(window) {
    window["env"] = window["env"] || {};
  
    // BackEnd Environment variables
    window["env"]["serverApiUrls"] = '$PH_BACKEND_SERVER_URLS';
    window["env"]["serverApiUrl"]  = '$PH_BACKEND_SERVER_URL';
  
    window["env"]["apiPath"] = '$PH_BACKEND_SERVER_PATH';
    window["env"]["apiVersion"]  = '$PH_BACKEND_SERVER_API_VERSION';
  
    window["env"]["platformTenantId"]  = '$PH_PLATFORM_TENANT_ID';
    window["env"]["platformTenantIds"]  = '$PH_PLATFORM_TENANT_IDS';
  
    window["env"]["authEnabled"] = '$PH_AUTH_ENABLED';
    window["env"]["oauthEnabled"] = '$PH_OAUTH_ENABLED';
    window["env"]["oauthServerUrl"] = '$PH_OAUTH_SERVER_URL';
    window["env"]["oauthBasicAuth"] = '$PH_OAUTH_BASIC_AUTH';
    window["env"]["oauthBasicAuthToken"] = '$PH_OAUTH_BASIC_AUTH_TOKEN';
  
    // Language Environment variables
    window["env"]["defaultLanguage"] = '$PH_DEFAULT_LANGUAGE';
    window["env"]["supportedLanguages"] = '$PH_SUPPORTED_LANGUAGES';

  })(this);