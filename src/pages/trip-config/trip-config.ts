import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Trip, TripsProvider } from '../../providers/trips/trips';
import { Currency } from '../../providers/rest/rest';
import { TripRateProvider, TripRate } from '../../providers/trip-rate/trip-rate';
import { AuthProvider } from '../../providers/auth/auth';
import { ToastController } from '../../../node_modules/ionic-angular';
import { TripChangeRatesPage } from '../trip-change-rates/trip-change-rates';

@IonicPage()
@Component({
  selector: 'page-trip-config',
  templateUrl: 'trip-config.html',
})
export class TripConfigPage {

  trip: Trip;
  currencies: Currency[];
  rates: TripRate[] = [];
  displayCurrency: Currency;

  constructor(public navCtrl: NavController, public navParams: NavParams, public tripRateProvider: TripRateProvider, public tripsProvider: TripsProvider, public authProvider: AuthProvider, public toastCtrl: ToastController) {
    this.trip = this.navParams.get('trip');
    this.currencies = this.trip.currencies;
    this.displayCurrency = JSON.parse(JSON.stringify(this.trip.displayCurrency));
  }


  ionViewWillEnter() {
    this.initRates();
  }

  initRates() {
    this.tripRateProvider.getAllRatesPerTrip(this.trip).then((resp) => {
      let tmpRates: TripRate[] = [];
      tmpRates = resp;
      this.rates = tmpRates;
      console.log("length: " + this.rates.length);
    })
  }



  changeDisplayCurrency() {
    if (this.displayCurrency.code !== this.trip.displayCurrency.code) {
      let tmpCurr;
      let tmpUsername;

      this.trip.currencies.forEach(curr => {
        if (curr.code === this.displayCurrency.code) {
          tmpCurr = curr;
        }
      })

      this.authProvider.getUserSession().then(username => {
        tmpUsername = username;
      }).then(() => {
        console.log('Updating currency of whole trip!')
        this.tripsProvider.updateCurrency(this.trip, tmpUsername, tmpCurr)
      }).then(() => {
        let toast = this.toastCtrl.create({
          message: 'Display currency succesfully changed!',
          duration: 3000,
          position: 'bottom',
          showCloseButton: true
        });
        toast.present();
      })
    } else {
      let toast = this.toastCtrl.create({
        message: 'Error setting new display currency',
        duration: 3000,
        position: 'bottom',
        showCloseButton: true
      });
      toast.present();
    }
  }

  changeRate(rate: TripRate) {
    this.navCtrl.push(TripChangeRatesPage, { "trip": this.trip, rate })
  }
}
