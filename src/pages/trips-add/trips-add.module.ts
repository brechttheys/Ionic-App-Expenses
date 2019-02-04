import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TripsAddPage } from './trips-add';

@NgModule({
  declarations: [
    TripsAddPage,
  ],
  imports: [
    IonicPageModule.forChild(TripsAddPage),
  ],
})
export class TripsAddPageModule {}
