import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ContactsAddPage } from './contacts-add';

@NgModule({
  declarations: [
    ContactsAddPage,
  ],
  imports: [
    IonicPageModule.forChild(ContactsAddPage),
  ],
})
export class ContactsAddPageModule {}
