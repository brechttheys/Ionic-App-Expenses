import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import {  ExpensesCategoryDetailsPage } from './expenses-category-details';

@NgModule({
  declarations: [
    ExpensesCategoryDetailsPage,
  ],
  imports: [
    IonicPageModule.forChild( ExpensesCategoryDetailsPage),
  ],
})
export class CategoryDetailsPageModule {}
