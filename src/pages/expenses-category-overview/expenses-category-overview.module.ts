import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ExpensesCategoryOverviewPage } from './expenses-category-overview';

@NgModule({
  declarations: [
    ExpensesCategoryOverviewPage,
  ],
  imports: [
    IonicPageModule.forChild(ExpensesCategoryOverviewPage),
  ],
})
export class TripDetailsPageModule {}
