import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TripChangeRatesPage } from './trip-change-rates';

@NgModule({
  declarations: [
    TripChangeRatesPage,
  ],
  imports: [
    IonicPageModule.forChild(TripChangeRatesPage),
  ],
})
export class TripChangeRatesPageModule {}
