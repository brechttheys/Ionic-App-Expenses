import 'rxjs/add/operator/map';
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { User, AuthProvider } from '../auth/auth';
import { Currency } from '../rest/rest';

export class Transfer {
    public from: number;
    public to: number;
    public amount: number;
    public currency: Currency;
    public date: Date;

    constructor(from: number, to: number, amount: number, currency: Currency, date: Date = new Date()) {
        this.from = from;
        this.to = to;
        this.amount = amount;
        this.currency = currency;
        this.date = date;
    }
}


@Injectable()
export class TransfersProvider {

    constructor(public storage: Storage, public authProvider: AuthProvider) { }

    async addTransfer(newTransfer: Transfer) {
        let username: string;
        let tmpUsers: User[];

        let from = newTransfer.from;
        let to = newTransfer.to;
        let amt = Number.parseFloat(newTransfer.amount.toString());

        await this.storage.get("users").then(usersResp => {
            tmpUsers = usersResp;
            this.authProvider.getUserSession().then(usernameResp => {
                username = usernameResp;
            }).then(() => {
                tmpUsers.forEach(userResp => {
                    if (username == userResp.username) {
                        userResp.contacts.forEach(contact => {
                            if (contact.id === from) {
                                contact.due = Number.parseFloat(contact.due.toString()) + amt;
                                contact.transfers.push(newTransfer);
                            }
                            if (contact.id === to) {
                                contact.receives = Number.parseFloat(contact.receives.toString()) + amt;
                            }
                        })
                    }
                });
                this.storage.set("users", tmpUsers);
            })
        });
    }

    async deleteTransfer(newTransfer: Transfer) {
        let username: string;
        let tmpUsers: User[];

        let from = newTransfer.from;
        let to = newTransfer.to;
        let amt = Number.parseFloat(newTransfer.amount.toString());

        await this.storage.get("users").then(usersResp => {
            tmpUsers = usersResp;
            this.authProvider.getUserSession().then(usernameResp => {
                username = usernameResp;
            }).then(() => {
                tmpUsers.forEach(userResp => {
                    if (username == userResp.username) {
                        userResp.contacts.forEach(contact => {
                            if (contact.id === from) {
                                contact.due = Number.parseFloat(contact.due.toString()) - amt;
                                let index = contact.transfers.indexOf(newTransfer);
                                contact.transfers.splice(index, 1)
                            }
                            if (contact.id === to) {
                                contact.receives = Number.parseFloat(contact.receives.toString()) - amt;
                            }
                        })
                    }
                });
                this.storage.set("users", tmpUsers);
            })
        });
    }
}