import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ExpenseDetailsPage } from './expense-details';

@NgModule({
  declarations: [
    ExpenseDetailsPage,
  ],
  imports: [
    IonicPageModule.forChild(ExpenseDetailsPage),
  ],
})
export class ExpenseDetailsPageModule {}
