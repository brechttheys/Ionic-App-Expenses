import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TripConfigPage } from './trip-config';

@NgModule({
  declarations: [
    TripConfigPage,
  ],
  imports: [
    IonicPageModule.forChild(TripConfigPage),
  ],
})
export class TripConfigPageModule {}
