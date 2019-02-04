import { Injectable, Injector } from '@angular/core';
import { Storage } from '@ionic/storage';
import { AuthProvider, User } from '../auth/auth';
import { Transfer } from '../transfers/transfer';
import { ToastController } from '../../../node_modules/ionic-angular/umd';



export class Contact {
  public id: number;
  public firstname: string;
  public lastname: string;
  public due: number;
  public receives: number;
  public expenseCost: number;
  public transfers: Transfer[];

  constructor(firstname: string, lastname: string, due: number, receives: number) {
    this.id = new Date().valueOf();
    this.firstname = firstname;
    this.lastname = lastname;
    this.due = due;
    this.receives = receives;
    this.transfers = [];
  }
}

export class ContactPayer {
  public id: number;
  public amount: number;
  public firstname: string;
  public lastname: string;

  constructor(id: number, amount: number) {
    this.id = id;
    this.amount = amount;
  }
}


@Injectable()
export class ContactsProvider {

  private authProvider: AuthProvider;
  private storage: Storage;

  constructor(injector: Injector) {
    setTimeout(() => {
      this.authProvider = injector.get(AuthProvider);
      this.storage = injector.get(Storage);
    });
  }

  getContacts(username: string) {

  }

  // adding contacts (same as we did for other additions)
  addContact(contact: Contact) {
    let username: string;
    let users: User[];
    let contacts: Contact[];

    this.storage.get("users").then(usersResp => {
      users = usersResp;
      this.authProvider.getUserSession().then(usernameResp => {
        username = usernameResp;
      }).then(() => {
        users.forEach(userResp => {
          if (username == userResp.username) {
            contacts = userResp.contacts;
            contacts.push(contact);
          }
        });
        this.storage.set("users", users);
      })
    })
  }

  getContactById(id: number) { //untested & unused
    let username: string;
    let users: User[];
    let contacts: Contact[];

    this.storage.get("users").then(usersResp => {
      users = usersResp;
      this.authProvider.getUserSession().then(usernameResp => {
        username = usernameResp;
      }).then(() => {
        users.forEach(userResp => {
          if (username == userResp.username) {
            contacts = userResp.contacts;
            contacts.forEach(contact => {
              if (contact.id == id) {
                return contact;
              }
            })
          }
        });
      })
    })
    return null;
  }

  async deleteContact(contact: Contact, cb) {
    let username: string;
    let users: User[];

    await this.storage.get("users").then(usersResp => {
      users = usersResp;
      this.authProvider.getUserSession().then(usernameResp => {
        username = usernameResp;
      }).then(() => {
        users.forEach(userResp => {
          if (username == userResp.username) {
            userResp.contacts.forEach(contactElement => {
              if (contactElement.id === contact.id) {
                let index = userResp.contacts.indexOf(contactElement);
                if (index !== 0) {
                  userResp.contacts.splice(index, 1);
                } else {
                  cb();
                }
              }
            });
          }
        });
        this.storage.set("users", users);
      })
    })
  }
}
