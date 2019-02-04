import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ContactsOverviewPage } from './contacts-overview';

@NgModule({
  declarations: [
    ContactsOverviewPage,
  ],
  imports: [
    IonicPageModule.forChild(ContactsOverviewPage),
  ],
})
export class ContactsOverviewPageModule {}
