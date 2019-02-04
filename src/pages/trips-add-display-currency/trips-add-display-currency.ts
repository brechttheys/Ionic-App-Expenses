import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Trip, TripsProvider } from '../../providers/trips/trips';
import { Currency } from '../../providers/rest/rest';
import { AuthProvider } from '../../providers/auth/auth';

@IonicPage()
@Component({
  selector: 'page-trips-add-display-currency',
  templateUrl: 'trips-add-display-currency.html',
})
export class TripsAddDisplayCurrencyPage {
  trip: Trip;
  currencies: Currency[];
  selectedCurrency: Currency;

  constructor(public navCtrl: NavController, public navParams: NavParams, public authProvider: AuthProvider, public tripsProvider: TripsProvider) {
    this.trip = navParams.get('trip');
    this.currencies = this.trip.currencies;
    this.selectedCurrency = this.currencies[0];
  }

  async addTrip(){
    let tmpUsername;
    this.trip.displayCurrency = this.selectedCurrency;
    console.log("in add trip of tris add display " + this.trip.displayCurrency);
    await this.authProvider.getUserSession().then(username => {
      tmpUsername = username;
    }).then(() => {
      this.tripsProvider.addTrip(this.trip, tmpUsername);
    })
  }

}
