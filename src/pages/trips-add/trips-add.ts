import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { User, AuthProvider } from '../../providers/auth/auth';
import { TripsProvider } from '../../providers/trips/trips';
import { Trip } from '../../providers/trips/trips';
import { Currency } from '../../providers/rest/rest';
import { RestProvider } from '../../providers/rest/rest';
import { Contact, ContactsProvider } from '../../providers/contacts/contacts';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TripsAddDisplayCurrencyPage } from '../trips-add-display-currency/trips-add-display-currency';

@IonicPage()
@Component({
  selector: 'page-trips-add',
  templateUrl: 'trips-add.html',
})
export class TripsAddPage {

  currencies: Currency[];
  selectedCurrencies: any[];
  contacts: Contact[];
  selectedParticipants: Contact[];
  form: FormGroup;
  submitAttempt: boolean;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public authProvider: AuthProvider,
    public tripsProvider: TripsProvider,
    public restProvider: RestProvider,
    public contactsProvider: ContactsProvider,
    public formBuilder: FormBuilder
  ) {
    // this will create default currency
    this.currencies = [];
    this.selectedCurrencies = [];

    this.form = formBuilder.group({
      name: ['', [Validators.required, Validators.maxLength(20)]],
      country: ['', [Validators.required, Validators.maxLength(30)]],
      year: [new Date().getFullYear(), [Validators.required, Validators.min(2000), Validators.max(3000)]],
      selectedCurrencies: ['', Validators.required],
      selectedParticipants: ['', Validators.required],
    });
    this.submitAttempt = false;
  }

  getCurrencies() {
    // rest the currencies once again and add the default one
    this.currencies = [];
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
            this.currencies.push(tmpUser.globalCurrency);
          }
        });
      })
    })

    // process the json returned from the getCurrencies method
    // each currency is put into the public accessible this.currencies with respective fields
    this.restProvider.getCurrencies(this.form.controls.country.value).subscribe(
      data => {
        data.forEach(element => {
          let tmpCurrencies: any[];
          tmpCurrencies = element.currencies;
          tmpCurrencies.forEach(currencyElement => {
            // if it's the same as the default currency, do not add it
            if (currencyElement.code !== tmpUser.globalCurrency.code) {
              this.currencies.push(new Currency(currencyElement.code, currencyElement.symbol));
            }
          });
        });
      },
      err => {
        // maybe do something if it gives an error (alert that the given country is not valid?)
        console.log('ERROR' + this.currencies.length);
      },
      () => this.currencies.forEach(element => {
        console.log("code:" + element.code);
      })
    );
  }

  async addTrip() {
    if (!this.form.valid) {
      this.submitAttempt = true;
    } else {
      let tmpUsername: string;
      let resultCurrencies: Currency[] = [];
      this.currencies.forEach(currencyRef => {
        this.form.controls.selectedCurrencies.value.forEach(currencySelected => {
          if (currencySelected.code == currencyRef.code) {
            resultCurrencies.push(currencyRef);
          }
        });
      });
      console.log("result currencies: " + resultCurrencies.length);
      let trip: Trip = new Trip(this.form.controls.name.value, this.form.controls.country.value, this.form.controls.year.value, resultCurrencies, this.form.controls.selectedParticipants.value, []);
      console.log("gonna add trip");

      /*
      console.log('More than one currency selected. Asking display currency.')
      this.navCtrl.push(TripsAddDisplayCurrencyPage, { "trip": trip });
      */
      // this was causing a bug when adding a country using only one currency
      if (resultCurrencies.length > 1) {
        console.log('More than one currency selected. Asking display currency.')
        this.navCtrl.push(TripsAddDisplayCurrencyPage, { "trip": trip });
      } else {
        this.authProvider.getUserSession().then(username => {
          tmpUsername = username;
        }).then(() => {
          trip.displayCurrency = trip.currencies[0];
          this.tripsProvider.addTrip(trip, tmpUsername);
        })
      }

    }
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
            console.log("init contacts");
            if (this.currencies.length == 0) {
              this.currencies.push(tmpUser.globalCurrency);
            } else {
              let found = false;
              this.currencies.forEach(element => {
                console.log("in for each");
                if (element.code == tmpUser.globalCurrency.code) {
                  found = true;
                }
              });
              if(!found){
                this.currencies.push(tmpUser.globalCurrency);
              }
            }
          }
        });
      })
    })
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TripsAddPage qsdfqsdf');
  }

}
