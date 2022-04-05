import { NgModule, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
/* import { TranslateService } from '@ngx-translate/core'; */

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
import { JwtModule } from '@auth0/angular-jwt';
import { NgxMaskModule, IConfig } from 'ngx-mask';
import { AgmCoreModule } from '@agm/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { SaLoadingScreenService } from './shared/components/sa-loading-screen/sa-loading-screen.service';
import { SaLoadingScreenComponent } from './shared/components/sa-loading-screen/sa-loading-screen.component';
import { LoadingScreenInterceptor } from './shared/services/loading-screen.interceptors';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { MaterialModule } from './shared/material.module';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { HammerModule} from '@angular/platform-browser';


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

export function tokenGetter() {
    return localStorage.getItem('access_token');
}
  
@NgModule({
    bootstrap: [App],
    declarations: [
        App
    ],
    imports: [
        BrowserModule,
        HammerModule,
        HttpClientModule,
        RouterModule,
        FormsModule,
        ReactiveFormsModule,
        MaterialModule,
        NgaModule.forRoot(),
        PagesModule,
        routing,
        BrowserAnimationsModule,
        JwtModule.forRoot({
            config: {
                authScheme: 'JWT',
                tokenGetter: tokenGetter
            }
        }),
        ServiceWorkerModule.register('./ngsw-worker.js', { enabled: environment.production }),
        NgxMaskModule.forRoot(),
        AgmCoreModule.forRoot({
            apiKey: 'xxxxxxxxxxxxxxxxxxxxxxxx'
        }),
        TooltipModule.forRoot()
    ],
    providers: [
        APP_PROVIDERS,
        SaLoadingScreenService,
        {
            provide: HTTP_INTERCEPTORS,
            useClass: LoadingScreenInterceptor,
            multi: true
        }
    ],
    schemas: [
      CUSTOM_ELEMENTS_SCHEMA    ]
})

export class AppModule {

  constructor(public appState: AppState) {
  }
}






