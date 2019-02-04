import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Trip } from '../../providers/trips/trips';
import { ExpensesCategoryDetailsPage } from '../expenses-category-details/expenses-category-details';
import { TripConfigPage } from '../trip-config/trip-config';



@IonicPage()
@Component({
  selector: 'page-expenses-category-overview',
  templateUrl: 'expenses-category-overview.html',
})
export class ExpensesCategoryOverviewPage {

  trip: Trip;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.trip = this.navParams.get("trip");
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ExpensesCategoryOverviewPage');
  }

  navigateToTripsConfigPage() {
    this.navCtrl.push(TripConfigPage, { "trip": this.trip });
  }

  navigateToCategoryDetailPage(category) {
    console.log(category)
    this.navCtrl.push(ExpensesCategoryDetailsPage, {
      "trip": this.trip,
      "category": category
    })
  }

}
