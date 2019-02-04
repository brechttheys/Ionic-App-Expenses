import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ContactsProvider, Contact } from '../../providers/contacts/contacts';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';



@IonicPage()
@Component({
  selector: 'page-contacts-add',
  templateUrl: 'contacts-add.html',
})
export class ContactsAddPage {
  form: FormGroup;
  submitAttempt: boolean;

  constructor(public navCtrl: NavController, public navParams: NavParams, public contactsProvider: ContactsProvider, public formbuilder: FormBuilder) {
    this.form = formbuilder.group({
      firstname: ['', Validators.compose([Validators.maxLength(15), Validators.pattern('[a-zA-Z ]*'), Validators.required])],
      lastname: ['', Validators.compose([Validators.maxLength(20), Validators.pattern('[a-zA-Z ]*'), Validators.required])],
    });
  }



  addContact(firstname: string, lastname: string) {

    if (!this.form.valid) {
      this.submitAttempt = true;
    } else {
      let contact: Contact = new Contact(firstname, lastname, 0, 0);
      this.contactsProvider.addContact(contact);
      this.navCtrl.pop();
    }
  }
}
