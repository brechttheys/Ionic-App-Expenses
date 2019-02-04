import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TransferOverviewPage } from './transfer-overview';

@NgModule({
  declarations: [
    TransferOverviewPage,
  ],
  imports: [
    IonicPageModule.forChild(TransferOverviewPage),
  ],
})
export class TransferPageModule {}
