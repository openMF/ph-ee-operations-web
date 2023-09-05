# Payment Hub EE - UI

UI component for the Payment Hub EE application.

This project is based on the **openMF/web-app** to provide the same UX as we have for Fineract 1.x.


## Getting started

1. Ensure you have the following installed in your system:

    [`git`](https://git-scm.com/downloads)

    [`npm`](https://nodejs.org/en/download/)

2. Install [angular-cli](https://github.com/angular/angular-cli) globally.
```
npm install -g @angular/cli@16.2.1
```

3. Clone the project locally into your system.
```
git clone git@github.com:openMF/ph-ee-operations-web.git
```

4. `cd` into project root directory and make sure you are on the master branch.

5. Install the dependencies.
```
npm install
```

6. Before to run the app, set the environment variables as you need it, please see the environment variable details above

7. To preview the app, run the following command and navigate to `http://localhost:4200/`.
```
ng serve
```

The application is using the demo server with basic authentication by default. The credentials for the same are:
 
    Username - mifos
    Password - password


### Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

### Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use
`ng generate directive|pipe|service|class|guard|interface|enum|module`.

### Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `-prod` flag for a production build.


## Environment variables

You can set the parameters now using environment variables:
Please modify them accordingly your needs (serverUrl, authServerUrl, etc.)

The environment variables to be set are:


`PH_BACKEND_SERVER_URL`
Setting for the Payment Hub server url to backend services

`PH_BACKEND_SERVER_API_PATH`
Setting for the APIs path calls, Default value `/opsapp/api`

`PH_BACKEND_SERVER_API_VERSION`
Setting for the APIs version calls, Default value `/v1`

`PH_PLATFORM_TENANT_ID`
Setting for the Platform Tenant Identifier used in the APIs calls, Default value `phdefault`

`PH_OAUTH_ENABLED`
Boolean value to Enable or Disable the OAuth authentication

`PH_OAUTH_SERVER_URL`
Setting for the server url to OAuth services

`PH_OAUTH_BASIC_AUTH`
Boolean value to Enable or Disable the Basic Authentication for OAuth

`PH_OAUTH_BASIC_AUTH_TOKEN`
Setting the Authentication Token for OAuth authentication

`PH_DEFAULT_LANGUAGE`
Setting for Languages (i18n) still under development
Default language to be used, by default `en` (English US)

`PH_SUPPORTED_LANGUAGES`
Language list of available languages, splited by colon, like en,fr,es

## Profiles

There are 3 profiles at the moment:
- DEV (default): `environment.ts` 
- PROD: `environment.prod.ts`
- KUBERNETES: `environment.kubernetes.ts`

You can define various settings based on these profiles.

### Usage

`npm [build|server] --configuration [prod|kubernetes]`

To build the application with the kubernetes profile: `npm build --configuration kubernetes`

## Docker compose
It is possible to do a 'one-touch' installation of Mifos X Web App using containers (AKA "Docker").
Fineract now packs the Mifos community-app web UI in it's docker deploy.

As Prerequisites, you must have `docker` and `docker-compose` installed on your machine; see
[Docker Install](https://docs.docker.com/install/) and
[Docker Compose Install](https://docs.docker.com/compose/install/).

Now to run a new MifosX Web App instance you can simply:

1. `git clone https://github.com/openMF/ph-ee-operations-web.git ; cd ph-ee-operations-web`

1. for windows, use `git clone https://github.com/openMF/ph-ee-operations-web.git --config core.autocrlf=input ; cd ph-ee-operations-web`

2. `docker-compose up -d`

3. Access the webapp on http://localhost:4200 in your browser.

## Mocked backend

To use mocked responses please do the following modifications:


### Authentication Service

Change

    login(loginContext: LoginContext) {
        this.alertService.alert({ type: 'Authentication Start', message: 'Please wait...' });
        this.rememberMe = loginContext.remember;
        this.storage = this.rememberMe ? localStorage : sessionStorage;
        this.authenticationInterceptor.setTenantId(loginContext.tenant);
        let httpParams = new HttpParams();
        httpParams = httpParams.set('username', loginContext.username);
        httpParams = httpParams.set('password', loginContext.password);
        //httpParams = httpParams.set('tenantIdentifier', loginContext.tenant);
        if (environment.oauth.enabled === 'true') {

            httpParams = httpParams.set('grant_type', 'password');
            if (environment.oauth.basicAuth) {
                this.authenticationInterceptor.setAuthorization(`Basic ${environment.oauth.basicAuthToken}`);
            }
            return this.http.disableApiPrefix().post(`${environment.oauth.serverUrl}/oauth/token`, {}, { params: httpParams })
                .pipe(
                map((tokenResponse: OAuth2Token) => {
                    // TODO: fix UserDetails API
                    this.storage.setItem(this.oAuthTokenDetailsStorageKey, JSON.stringify(tokenResponse));
                    this.onLoginSuccess({ username: loginContext.username, accessToken: tokenResponse.access_token, authenticated: true, tenantId: loginContext.tenant } as any);
                    return of(true);
                })
                );
        } else {
            return this.http.post('/authentication', {}, { params: httpParams })
                .pipe(
                map((credentials: Credentials) => {
                    this.onLoginSuccess(credentials);
                    return of(true);
                })
                );
        }
    }

To

   
    login(loginContext: LoginContext) {
        this.alertService.alert({ type: 'Authentication Start', message: 'Please wait...' });
        this.rememberMe = loginContext.remember;
        this.storage = this.rememberMe ? localStorage : sessionStorage;
        this.authenticationInterceptor.setTenantId(loginContext.tenant);
        let httpParams = new HttpParams();
        httpParams = httpParams.set('username', loginContext.username);
        httpParams = httpParams.set('password', loginContext.password);
        //httpParams = httpParams.set('tenantIdentifier', loginContext.tenant);
       
        this.onLoginSuccess({} as any);
        return of(true);
    }

#Auto
