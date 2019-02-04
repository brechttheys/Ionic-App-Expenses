import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ExpensesAddPage } from './expenses-add';

@NgModule({
  declarations: [
    ExpensesAddPage,
  ],
  imports: [
    IonicPageModule.forChild(ExpensesAddPage),
  ],
})
export class ExpensesAddPageModule {}
