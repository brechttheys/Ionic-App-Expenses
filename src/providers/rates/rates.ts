import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { User, AuthProvider } from '../auth/auth';

export class Rate {
  from : string;
  to : string;
  multiplier : number;

  constructor(from : string, to : string, multiplier : number) {
    this.from = from;
    this.to = to;
    this.multiplier = multiplier;
  }
}

@Injectable()
export class RatesProvider {

  constructor(public storage : Storage, public authProvider: AuthProvider) {}

  addRate(newRate: Rate) {
    let tmpUsers : User[] = [];
    console.log("---- LOGGING ----> inside add rate");
    this.storage.get("users").then(userResp => {
        tmpUsers = userResp;
        let username: string;
    this.authProvider.getUserSession().then((session) => {
        username = session;
    }).then(() => {
            tmpUsers.forEach(user => {
                if (username = user.username) {
                    let tmpRates: Rate[] = [];
                    tmpRates = user.rates;
                    console.log("attempting to add Rate");
                    console.log(newRate);
                    tmpRates.push(newRate);
                    console.log("added rate to tmp");
                    user.rates = tmpRates;
                }
            });
            this.storage.set("users",tmpUsers);
        });
    });
}

getRates() {
    let rates : Rate[] = [];
    let username: string;
    return this.storage.get("session").then((userSession) => {
      username = userSession;
    }).then(() => {
        return this.authProvider.getSpecificUser(username).then((user) => {
            rates = user.rates;
        });
    }).then(() => {
        return rates;
    })
  }

removeRate(toRemoveRate : Rate) {
    let users : User[] = [];
    let username: string;
    this.storage.get("users").then(userResp => {
        users = userResp;
    });
    this.authProvider.getUserSession().then((session) => {
        username = session;
    }).then(() => {
        users.forEach(user => {
            if (username = user.username) {
                let rates : Rate[] = [];
                rates = user.rates;
                rates.forEach(rate => {
                    if (rate = toRemoveRate) {
                        rates.pop();
                    }
                    user.rates = rates;
                });
            }
        });
        this.storage.set("users",users);
    });
}

}
