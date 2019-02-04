import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ContactExpensesOverviewPage } from './contact-expenses-overview';

@NgModule({
  declarations: [
    ContactExpensesOverviewPage,
  ],
  imports: [
    IonicPageModule.forChild(ContactExpensesOverviewPage),
  ],
})
export class ContactExpensesOverviewPageModule {}
