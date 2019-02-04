import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Trip, TripsProvider } from '../../providers/trips/trips';
import { Contact } from '../../providers/contacts/contacts';
import { Currency } from '../../providers/rest/rest';
import { ExpensesProvider } from '../../providers/expenses/expenses';
import { ExpensesAddSplitMethodPage } from '../expenses-add-split-method/expenses-add-split-method';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@IonicPage()
@Component({
  selector: 'page-expenses-add',
  templateUrl: 'expenses-add.html',
})
export class ExpensesAddPage {

  trip: Trip;
  category: string;
  participants: Contact[];
  currencies: Currency[] = [];
  splitMethods: string[];
  buttonText: string;
  selectedSplitMethod: string;
  form: FormGroup;
  submitAttempt: boolean;

  constructor(public navCtrl: NavController, public navParams: NavParams, public tripsProvider: TripsProvider, public expensesProvider: ExpensesProvider, public formBuilder: FormBuilder) {
    this.buttonText = "Next";

    this.form = formBuilder.group({
      description: ['', [Validators.required, Validators.minLength(3)]],
      totalPrice: ['', [Validators.maxLength(30), Validators.pattern('(0|([1-9][0-9]*))(\\.[0-9]+)?$'), Validators.required]],
      selectedCurrencies: ['', [Validators.required]],
      date: [new Date().toISOString(), [Validators.required]],
      selectedSplitMethod: ['', [Validators.required]],
      selectedPaidBy: ['', [Validators.required]],
      selectedParticipants: ['', [Validators.required]],
    });
  }

  addExpense() {
    if (!this.form.valid) {
      this.submitAttempt = true;
    } else {
      var { description, totalPrice, selectedCurrencies, date, selectedPaidBy, selectedSplitMethod, selectedParticipants } = this.form.controls;

      this.navCtrl.push(ExpensesAddSplitMethodPage, {
        "expense": {
          "description": description.value,
          "category": this.category,
          "totalPrice": totalPrice.value,
          "selectedCurrency": selectedCurrencies.value,
          "date": date.value,
          "selectedPaidBy": selectedPaidBy.value,
          "selectedParticipants": selectedParticipants.value,
          "selectedSplitMethod": selectedSplitMethod.value,
        },
        "trip": this.trip
      })
    }
  }

  ionViewWillEnter() {
    this.trip = this.navParams.get("trip");
    this.category = this.navParams.get("category");
    this.tripsProvider.getParticipantsForTrip(this.trip).then((particpantsResp) => {
      console.log("in the view: " + particpantsResp.length);
      console.log(particpantsResp);
      this.participants = particpantsResp;
    }).then(() => {
      console.log("in the then");
      this.tripsProvider.getCurrenciesForTrip(this.trip).then((currenciesResp) => {
        console.log("in the view then: " + currenciesResp.length);
        this.currencies = currenciesResp;

        if (this.currencies.length === 1) {
          this.form.controls.selectedCurrencies.setValue(this.currencies[0]);
        }
      })
    }).then(() => {
      this.splitMethods = [];
      this.splitMethods.push("divided evenly");
      this.splitMethods.push("own share");
      this.splitMethods.push("way of bill");
      this.splitMethods.push("feeling lucky");
    })
  }

}
