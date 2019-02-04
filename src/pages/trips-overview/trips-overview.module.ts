import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TripsOverviewPage } from './trips-overview';

@NgModule({
  declarations: [
    TripsOverviewPage,
  ],
  imports: [
    IonicPageModule.forChild(TripsOverviewPage),
  ],
})
export class TripsOverviewPageModule {}
