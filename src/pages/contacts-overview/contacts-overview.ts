import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ToastController } from 'ionic-angular';
import { ContactsAddPage } from '../contacts-add/contacts-add';
import { User, AuthProvider } from '../../providers/auth/auth';
import { Contact, ContactsProvider } from '../../providers/contacts/contacts';
import { ContactExpensesOverviewPage } from '../contact-expenses-overview/contact-expenses-overview';

@IonicPage()
@Component({
  selector: 'page-contacts-overview',
  templateUrl: 'contacts-overview.html',
})
export class ContactsOverviewPage {

  public contacts: Contact[];

  constructor(public navCtrl: NavController, public navParams: NavParams, public authProvider: AuthProvider, public contactsProvider: ContactsProvider, public alertCtrl: AlertController, public toastCtrl: ToastController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ContactsOverviewPage');
  }

  navigateToContactsAddPage() {
    this.navCtrl.push(ContactsAddPage);
  }

  navigateToContactDetails(contact: Contact) {
    this.navCtrl.push(ContactExpensesOverviewPage, { "contact": contact });
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
          }
        });
      })
    })
  }
  deleteContact(contact: Contact) {
    let alert = this.alertCtrl.create({
      title: 'Delete confirmation',
      subTitle: 'Are you sure you want to delete ' + contact.firstname + ' ' + contact.lastname + '?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => { }
        },
        {
          text: 'Delete',
          handler: () => {
            this.contactsProvider.deleteContact(contact, () => {
              let toast = this.toastCtrl.create({
                message: 'Cannot delete yourself, dummy',
                duration: 3000,
                position: 'bottom',
                showCloseButton: true
              });
              toast.present();
            }).then(() => {
              this.initContacts();
            });
          }
        }
      ]
    });
    alert.present();

  }
}
