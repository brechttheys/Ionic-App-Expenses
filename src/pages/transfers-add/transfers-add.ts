import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ContactsProvider, Contact } from '../../providers/contacts/contacts';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User, AuthProvider } from '../../providers/auth/auth';
import { Transfer, TransfersProvider } from '../../providers/transfers/transfer';
import { Currency } from '../../providers/rest/rest';



@IonicPage()
@Component({
  selector: 'page-transfers-add',
  templateUrl: 'transfers-add.html',
})
export class TransfersAddPage {
  form: FormGroup;
  submitAttempt: boolean;
  fromToError: boolean;

  contacts: Contact[];
  currency: Currency;

  from: Contact;
  to: Contact;
  amount: number;
  date: Date;

  constructor(public navCtrl: NavController, public navParams: NavParams, public contactsProvider: ContactsProvider, public formbuilder: FormBuilder, public authProvider: AuthProvider, public transferProvider: TransfersProvider) {
    this.form = formbuilder.group({
      from: ['', Validators.required],
      to: ['', Validators.required],
      amount: ['', [Validators.min(0), Validators.required]],
      date: ['', Validators.required],
    });
    this.currency = new Currency(undefined, undefined);
  }

  ionViewWillEnter() {
    this.initContacts();
  }

  initContacts() {
    let username: string;
    let tmpUsers: User[];
    let tmpUser: User;
    this.contacts = [];

    this.authProvider.getUserSession().then(usernameElement => {
      username = usernameElement;
    }).then(() => {
      this.authProvider.getStorage().get("users").then(users => {
        tmpUsers = users;
        tmpUsers.forEach(userElement => {
          tmpUser = userElement;
          if (tmpUser.username == username) {
            this.contacts = tmpUser.contacts;
            this.currency = JSON.parse(JSON.stringify(tmpUser.globalCurrency));
            console.log('currency set to ' + this.currency.code + this.currency.symbol);
          }
        });
      })
    })
  }

  addTransfer() {
    if (this.form.controls.from.value === this.form.controls.to.value && this.form.controls.from.value) {
      this.fromToError = true;
    } else {
      if (!this.form.valid) {
        this.submitAttempt = true;
      } else {
        let { from, to, amount, date, currency } = this.form.controls;

        let transfer: Transfer = new Transfer(from.value.id, to.value.id, amount.value, this.currency, date.value);

        this.transferProvider.addTransfer(transfer).then(() => {
          this.navCtrl.pop();
        })
      }
    }
  }
}
