import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TransfersAddPage } from './transfers-add';

@NgModule({
  declarations: [
    TransfersAddPage,
  ],
  imports: [
    IonicPageModule.forChild(TransfersAddPage),
  ],
})
export class TransfersAddPageModule {}
