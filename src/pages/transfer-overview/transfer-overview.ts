import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { User, AuthProvider } from '../../providers/auth/auth';
import { TransfersAddPage } from '../transfers-add/transfers-add';
import { Contact } from '../../providers/contacts/contacts';
import { Transfer, TransfersProvider } from '../../providers/transfers/transfer';

@IonicPage()
@Component({
  selector: 'page-transfer-overview',
  templateUrl: 'transfer-overview.html',
})
export class TransferOverviewPage {
  contacts: Contact[];
  names = undefined;

  constructor(public navCtrl: NavController, public navParams: NavParams, public authProvider: AuthProvider, public transfersProvider: TransfersProvider, public alertCtrl: AlertController) {
  }

  ionViewWillEnter() {
    this.initTransfers();
  }

  navigateToTransfersAddPage() {
    this.navCtrl.push(TransfersAddPage);
  }

  initTransfers() {
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

            tmpUser.contacts.forEach(contact => {
              if (contact.transfers !== undefined && contact.transfers.length > 0) {
                this.contacts.push(contact);
              }

              if (!this.names || !this.names.hasOwnProperty(contact.id)) {
                this.names = { ...this.names, [contact.id]: contact.lastname + " " + contact.firstname };
              }
            })
          }
        });
      })
    })
  }

  deleteTransfer(transfer: Transfer) {
    let alert = this.alertCtrl.create({
      title: 'Delete confirmation',
      subTitle: 'Are you sure you want to delete this transfer?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => { }
        },
        {
          text: 'Delete',
          handler: () => {
            this.transfersProvider.deleteTransfer(transfer).then(() => {
              this.initTransfers();
            })
          }
        }
      ]
    });
    alert.present();
  }
}
