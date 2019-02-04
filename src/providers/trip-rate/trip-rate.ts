import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { User } from '../auth/auth';
import { Currency } from '../rest/rest';
import { HttpClient } from '../../../node_modules/@angular/common/http';
import { Trip } from '../trips/trips';

export class TripRate {
  from : Currency;
  to : Currency;
  multiplier : number;

  constructor(from : Currency, to : Currency, multiplier : number) {
    this.from = from;
    this.to = to;
    this.multiplier = multiplier;
  }
}


@Injectable()
export class TripRateProvider {

  constructor(public http: HttpClient, public storage: Storage) {
    console.log('Hello TripRateProvider Provider');

  }

  getAllRatesPerTrip(trip: Trip) {
    let username: string;
    let users: User[] = [];
    let trips: Trip[] = [];
    let tripRates: TripRate[] = [];
    return this.storage.get("session").then(usernameResp => {
      username = usernameResp;
    }).then(() => {
      return this.storage.get("users").then(usersResp => {
        users = usersResp;
        users.forEach(user => {
          if (username == user.username) {
            trips = user.trips;
            trips.forEach(tripElement => {
              if (tripElement.name == trip.name) {
               tripRates = tripElement.rates;
              }
            });
          }
        })
      })
    }).then(() => {
      console.log("returning from trip rates provider: " + tripRates.length);
      return tripRates;
    })
  }
  

}
