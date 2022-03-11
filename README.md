# Payment Hub EE - UI

UI component for the Payment Hub EE application.

This project is based on the **openMF/web-app** to provide the same UX as we have for Fineract 1.x.

## Getting started

1. Ensure you have the following installed in your system:

    [`git`](https://git-scm.com/downloads)

    [`npm`](https://nodejs.org/en/download/)

2. Install [angular-cli](https://github.com/angular/angular-cli) globally.
```
npm install -g @angular/cli@12.2.16
```

3. Clone the project locally into your system.
```
git clone git@github.com:openMF/ph-ee-operations-web.git
```

4. `cd` into project root directory and make sure you are on the master branch.

5. Install the dependencies.
```
npm install --force
```

6. To preview the app, run the following command and navigate to `http://localhost:4200/`.
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


## Environment configuration

You can find the configuration file in the `environments` directory.
Please modify them accordingly your needs (serverUrl, authServerUrl, etc.)

## Profiles

There are 3 profiles at the moment:
- DEV (default): `environment.ts` 
- PROD: `environment.prod.ts`
- KUBERNETES: `environment.kubernetes.ts`

You can define various settings based on these profiles.

### Usage

`npm [build|server] --configuration [prod|kubernetes]`

To build the application with the kubernetes profile: `npm build --configuration kubernetes`

## Mocked backend

To use mocked responses please do the following modifications:


### Transaction service
Change

    getTransactions(fields: any, page: number, count: number): Observable<Transactions> {
        let params = '';
        fields.forEach((field: any) => {
        if (field.value !== undefined && field.value !== null && field.value !== '') {
            params += field.type + '=' + field.value + '&';
        }
        });
        params += 'page=' + page + '&size=' + count;

        return this.http.get('/transactions?' + params).pipe(map((transactions: any) => transactions as Transactions));
    }

To

    getTransactions(fields: any, page: number, count: number): Observable<Transactions> {
        let params = '';
        fields.forEach((field: any) => {
        if (field.value !== undefined && field.value !== null && field.value !== '') {
            params += field.type + '=' + field.value + '&';
        }
        });
        params += 'page=' + page + '&size=' + count;
        
        return this.http
        .disableApiPrefix()
        .get('/assets/mock/payment-hub/transactions.mock.json?' + params)
        .pipe(map((transactions: any) => transactions as Transactions));
    }


  Also change

    getTransactionDetail(id: string): Observable<TransactionDetails> {
        return this.http.get('/transaction/' + id).pipe(map((transaction: any) => transaction as TransactionDetails));
    }

To

    getTransactionDetail(id: string): Observable<TransactionDetails> {
        return this.http
            .disableApiPrefix()
            .get('/assets/mock/payment-hub/transaction-details.mock.json')
            .pipe(map((transaction: TransactionDetails) => transaction as TransactionDetails));
    }

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