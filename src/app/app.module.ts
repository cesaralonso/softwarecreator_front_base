import { BootstrapModalModule } from 'ng2-bootstrap-modal';
import { AuthLocalstorage } from './shared/auth-localstorage.service';
import { AuthService } from './shared/auth.service';
import { AuthGuard } from './shared/services/auth-guard.service';
import { NgModule, ApplicationRef, NO_ERRORS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { JwtModule } from '@auth0/angular-jwt';

import { routing } from './app.routing';
// Configuración
import { Configuration } from './app.constants';

// App is our top level component
import { App } from './app.component';
import { AppState, InternalStateType } from './app.service';
import { GlobalState } from './global.state';
import { NgaModule } from './theme/nga.module';
import { PagesModule } from './pages/pages.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { Http, RequestOptions } from '@angular/http';
import { LocalStorageModule } from 'angular-2-local-storage';


export function tokenGetter() {
  return localStorage.getItem('access_token');
}

// Application wide providers
const APP_PROVIDERS = [
  AppState,
  GlobalState,
  Configuration,
];

export type StoreType = {
  state: InternalStateType,
  restoreInputValues: () => void,
  disposeOldHosts: () => void,
};

/**
 * `AppModule` is the main entry point into Angular2's bootstraping process
 */
@NgModule({
  bootstrap: [App],
  declarations: [
    App,
  ],
  imports: [ // import Angular's modules
    BrowserModule,
    HttpClientModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    NgaModule.forRoot(),
    PagesModule,
    routing,
    BrowserAnimationsModule, // required animations module
    ToastrModule.forRoot(), // ToastrModule added,,
    JwtModule.forRoot({
      config: {
        authScheme: 'JWT',
        tokenGetter: tokenGetter
      }
    }),
    LocalStorageModule.forRoot({
        prefix: 'my-app',
        storageType: 'localStorage'
    }),
    BootstrapModalModule.forRoot({ container: document.body }),
  ],
  entryComponents: [
  ],
  providers: [ // expose our Services and Providers into Angular's dependency injection
    APP_PROVIDERS,
    AuthGuard,
    AuthService,
    AuthLocalstorage
  ],
  schemas: [
    NO_ERRORS_SCHEMA
  ]
})

export class AppModule {

  constructor(public appState: AppState) {
  }
}

