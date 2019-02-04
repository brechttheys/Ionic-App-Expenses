import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { User } from '../auth/auth';
import { Currency, RestProvider } from '../rest/rest';
import { Contact } from '../contacts/contacts';
import { Expense } from '../expenses/expenses';
import { TripRate } from '../trip-rate/trip-rate';
import { TripsOverviewPage } from '../../pages/trips-overview/trips-overview';
import { App } from "ionic-angular";

export class Trip {
  public id: number;
  public name: string;
  public country: string;
  public year: string;
  public currencies: Currency[];
  public participants: Contact[];
  public expenses: Expense[];
  public rates: TripRate[];
  public displayCurrency: Currency;

  constructor(name: string, country: string, year: string, currencies: Currency[], participants: Contact[], expenses: Expense[], displayCurrency: Currency = undefined) {
    this.id = new Date().valueOf();
    this.name = name;
    this.country = country;
    this.year = year;
    this.currencies = currencies;
    this.participants = participants;
    this.expenses = expenses;
    this.displayCurrency = displayCurrency;
  }
}

@Injectable()
export class TripsProvider {


  constructor(public storage: Storage, public restProvider: RestProvider, private app: App) {
  }


  getCurrenciesForTrip(trip: Trip) {
    let trips: Trip[] = [];
    let users: User[] = [];
    let currencies: Currency[] = [];
    let username: string;
    return this.storage.get("session").then((userSession) => {
      username = userSession;
      return this.storage.get("users").then((usersResp) => {
        users = usersResp;
        users.forEach(userElement => {
          if (userElement.username == username) {
            trips = userElement.trips;
            trips.forEach(tripElement => {
              if (tripElement.name == trip.name) {
                console.log(tripElement.participants.length);
                currencies = tripElement.currencies;
              }
            });
          }
        });
      }).then(() => {
        console.log("returning= " + currencies.length);
        return currencies;
      })
    })
  }

  getParticipantsForTrip(trip: Trip) {
    let trips: Trip[] = [];
    let users: User[] = [];
    let participants: Contact[] = [];
    let username: string;
    return this.storage.get("session").then((userSession) => {
      username = userSession;
      return this.storage.get("users").then((usersResp) => {
        users = usersResp;
        users.forEach(userElement => {
          if (userElement.username == username) {
            trips = userElement.trips;
            trips.forEach(tripElement => {
              if (tripElement.name == trip.name) {
                console.log(tripElement.participants.length);
                participants = tripElement.participants;
              }
            });
          }
        });
      }).then(() => {
        console.log("returning= " + participants.length);
        return participants;
      })
    })
  }


  async saveNewTrip(trip: Trip, username: string) {
    let tmpUsers: User[];
    let tmpTrips: Trip[];

    await this.storage.get("users").then(users => {
      tmpUsers = users;
      tmpUsers.forEach(userElement => {
        if (username == userElement.username) {
          tmpTrips = userElement.trips;
          tmpTrips.push(trip);
        }
      });
      this.storage.set("users", tmpUsers);
      this.app.getActiveNav().setRoot(TripsOverviewPage);
      this.app.getActiveNav().popToRoot();
    })
  }
  // simple addition to storage in regard to the session user
  async addTrip(trip: Trip, username: string) {
    let tmpCurrencies = trip.currencies;
    let tmpRates: TripRate[] = [];
    let counter: number = 0;

    //Fetch rates    
    if (tmpCurrencies.length > 1) {
      tmpCurrencies.forEach(currency => {
        tmpCurrencies.forEach(currency2 => {
          if (currency.code !== currency2.code) {
            console.log('No rate yet gotten, rates fetching now:' + currency.code + ' & ' + currency2.code);
            return this.restProvider.getCurrencyRate(currency.code, currency2.code).subscribe(
              rate => {
                tmpRates.push(new TripRate(currency, currency2, rate[currency.code + '_' + currency2.code]))
                console.log('New TripRate added to trip! (' + currency.code + ' to ' + currency2.code + ': ' + rate[currency.code + '_' + currency2.code] + ')');
                console.log("counter: " + counter);
                counter++;
                if (counter == (tmpCurrencies.length * (tmpCurrencies.length - 1))) {
                  trip.rates = tmpRates;
                  console.log("going t o  save new trip shite");
                  this.saveNewTrip(trip, username);
                  console.log("saved new trip shhite");
                }
              },
              //offline addition
              error => {
                console.log('error fetching rate data :( -- providing default rates of 1 to 1');
                tmpRates.push(new TripRate(currency, currency2, 1))
                console.log('New default TripRate added to trip! (' + currency.code + ' to ' + currency2.code + ': ' + 1 + ')');
                console.log("counter: " + counter);
                counter++;
                if (counter == (tmpCurrencies.length * (tmpCurrencies.length - 1))) {
                  trip.rates = tmpRates;
                  console.log("going t o  save new trip shite");
                  this.saveNewTrip(trip, username);
                  console.log("saved new trip shhite");
                }
              });
          }
        });
      });
      console.log("end of whole if pls do sthit before this");
    } else {
      trip.rates = [];
      this.saveNewTrip(trip, username);
    }
  }

  async updateTrip(trip: Trip, username: string) {
    let tmpUsers: User[];
    let tmpTrips: Trip[];

    await this.storage.get("users").then(users => {
      tmpUsers = users;
      tmpUsers.forEach(userElement => {
        if (username == userElement.username) {
          tmpTrips = userElement.trips;
          tmpTrips.forEach(tripElement => {
            if (tripElement.id === trip.id) {
              let index = tmpTrips.indexOf(tripElement);
              tmpTrips[index] = trip;
            }
          })
        }
      });
      this.storage.set("users", tmpUsers);
    })
  }

  async updateCurrency(trip: Trip, username: string, currency: Currency) {
    let multiplier: number = 1;

    trip.rates.forEach(rateElement => {
      if (rateElement.from.code === trip.displayCurrency.code && rateElement.to.code === currency.code) {
        multiplier = rateElement.multiplier;
        console.log('multiplier from:' + rateElement.from.code + ' & to:' + rateElement.to.code)
        console.log('Multiplier found! =' + multiplier);
      }
    })

    trip.expenses.forEach(expensesElement => {
      expensesElement.totalPrice = Number.parseFloat((Number.parseFloat(expensesElement.totalPrice.toString()) * Number.parseFloat(multiplier.toString())).toFixed(2));
      expensesElement.currency = currency;
      expensesElement.paidBy.forEach(paidByElement => {
        paidByElement.amount = Number.parseFloat((Number.parseFloat(paidByElement.amount.toString()) * Number.parseFloat(multiplier.toString())).toFixed(2))
      });
      expensesElement.participants.forEach(participantElement => {
        participantElement.due = Number.parseFloat((Number.parseFloat(participantElement.due.toString()) * Number.parseFloat(multiplier.toString())).toFixed(2));
        participantElement.receives = Number.parseFloat((Number.parseFloat(participantElement.receives.toString()) * Number.parseFloat(multiplier.toString())).toFixed(2));
      })
    })

    trip.displayCurrency = currency;

    await this.updateTrip(trip, username);
  }

  async deleteTrip(trip: Trip, username: string) {
    let tmpUsers: User[];
    let tmpTrips: Trip[];

    await this.storage.get("users").then(users => {
      tmpUsers = users;
      tmpUsers.forEach(userElement => {
        if (username == userElement.username) {
          tmpTrips = userElement.trips;
          tmpTrips.forEach(tripElement => {
            if (tripElement.id === trip.id) {
              let index = tmpTrips.indexOf(tripElement);
              tmpTrips.splice(index, 1);
            }
          })
        }
      });
      this.storage.set("users", tmpUsers);
    })
  }
}