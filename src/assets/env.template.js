(function(window) {
    window["env"] = window["env"] || {};
  
    // BackEnd Environment variables
    window["env"]["serverApiUrlOps"] = '$PH_OPS_BACKEND_SERVER_URL';
    window["env"]["bulkConnectorOps"] = '$PH_OPS_BULK_CONNECTOR_URL';
    window['env']['signatureApiUrl'] = '$PH_OPS_SIGNATURE_URL';

    window["env"]["serverApiUrlVou"] = '$PH_VOU_BACKEND_SERVER_URL';
    window["env"]["callbackUrlVou"] = '$PH_VOU_CALLBACK_URL';
    window["env"]["serverApiUrlAct"] = '$PH_ACT_BACKEND_SERVER_URL';
  
    window["env"]["registeringInstitutionId"] = '$PH_REGISTERING_INSTITUTION_ID';
    window["env"]["platformTenantId"] = '$PH_PLATFORM_TENANT_ID';
    window["env"]["platformTenantIds"] = '$PH_PLATFORM_TENANT_IDS';

    window["env"]["authEnabled"] = '$PH_AUTH_ENABLED';

    window["env"]["oauthEnabled"] = '$PH_OAUTH_ENABLED';
    window["env"]["oauthType"] = '$PH_OAUTH_TYPE';
    window["env"]["oauthServerUrl"] = '$PH_OAUTH_SERVER_URL';
    window["env"]["oauthRealm"] = '$PH_OAUTH_REALM';
    window["env"]["oauthClientId"] = '$PH_OAUTH_CLIENT_ID';
    window["env"]["oauthClientSecret"] = '$PH_OAUTH_CLIENT_SECRET';
    window["env"]["oauthBasicAuth"] = '$PH_OAUTH_BASIC_AUTH';
    window["env"]["oauthBasicAuthToken"] = '$PH_OAUTH_BASIC_AUTH_TOKEN';
  
    // Language Environment variables
    window["env"]["defaultLanguage"] = '$PH_DEFAULT_LANGUAGE';
    window["env"]["supportedLanguages"] = '$PH_SUPPORTED_LANGUAGES';

  })(this);