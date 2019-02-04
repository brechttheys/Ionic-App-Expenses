import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { TripRate } from '../../providers/trip-rate/trip-rate';
import { FormGroup, FormBuilder, Validators } from '../../../node_modules/@angular/forms';
import { TripsProvider, Trip } from '../../providers/trips/trips';
import { AuthProvider } from '../../providers/auth/auth';
import { RestProvider } from '../../providers/rest/rest';

@IonicPage()
@Component({
  selector: 'page-trip-change-rates',
  templateUrl: 'trip-change-rates.html',
})
export class TripChangeRatesPage {
  rate: TripRate;
  trip: Trip;

  form: FormGroup;
  submitAttempt: boolean;

  liveRate: number = -1;

  constructor(public navCtrl: NavController, public navParams: NavParams, public formBuilder: FormBuilder, public tripsProvider: TripsProvider, public authProvider: AuthProvider, public restProvider: RestProvider) {
    this.rate = navParams.get("rate");
    this.trip = navParams.get("trip");
    this.submitAttempt = false;
    this.form = formBuilder.group({
      amount: ['1', [Validators.min(0), Validators.pattern("(0|([1-9][0-9]*))(\\.[0-9]+)?$"), Validators.required]]
    });

    restProvider.getCurrencyRate(this.rate.from.code, this.rate.to.code).subscribe(response => {
      this.liveRate = response[this.rate.from.code + '_' + this.rate.to.code];
      console.log('Live rate = ' + this.liveRate);
    })
  }

  changeRate(useFormRate: boolean) {
    if (!this.form.valid) {
      this.submitAttempt = true;
    } else {
      this.trip.rates.forEach(rateElement => {
        if (rateElement.from.code === this.rate.from.code
          && rateElement.to.code === this.rate.to.code) {

          if (useFormRate) {
            rateElement.multiplier = this.form.controls.amount.value;
          } else {
            rateElement.multiplier = this.liveRate
          }
        }
      });

      let tmpUsername;

      this.authProvider.getUserSession().then(username => {
        tmpUsername = username;
      }).then(() => {
        this.tripsProvider.updateTrip(this.trip, tmpUsername);
      }).then(() => {
        this.navCtrl.pop();
      })
    }
  }

}
