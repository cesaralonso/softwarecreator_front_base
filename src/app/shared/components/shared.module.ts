import { AgmCoreModule } from '@agm/core';
import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MapVisitasComponent } from './map/map.component';

@NgModule({
  declarations: [
    MapVisitasComponent
  ],
  imports: [
    CommonModule, 
    AgmCoreModule
  ],
  exports: [
    MapVisitasComponent
  ],
  schemas: [
    NO_ERRORS_SCHEMA
  ],
  entryComponents: [
  ],
  providers: [
  ]
})
export class SharedModule {
}
