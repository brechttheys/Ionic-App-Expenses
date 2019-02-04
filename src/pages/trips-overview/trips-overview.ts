import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { AuthProvider } from '../../providers/auth/auth';
import { TripsAddPage } from '../trips-add/trips-add';
import { Trip, TripsProvider } from '../../providers/trips/trips';
import { User } from '../../providers/auth/auth';
import { ExpensesCategoryOverviewPage } from '../expenses-category-overview/expenses-category-overview';
@IonicPage()
@Component({
  selector: 'page-trips-overview',
  templateUrl: 'trips-overview.html',
})
export class TripsOverviewPage {

  public trips: Trip[];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public authProvider: AuthProvider,
    public tripsProvider: TripsProvider,
    public alertCtrl: AlertController) { }


  navigateToTripsDetailsPage(trip: Trip) {
    this.navCtrl.push(ExpensesCategoryOverviewPage, {
      "trip": trip
    });
  }

  navigateToTripsAddPage() {
    this.navCtrl.push(TripsAddPage)
  }


  ionViewWillEnter() {
    this.initTrips();
  }

  initTrips() {
    let username: string;
    let tmpUsers: User[];
    let tmpUser: User;
    this.trips = [];

    this.authProvider.getUserSession().then(usernameElement => {
      username = usernameElement;
    }).then(() => {
      this.authProvider.getStorage().get("users").then(users => {
        tmpUsers = users;
        tmpUsers.forEach(userElement => {
          tmpUser = userElement;
          if (tmpUser.username == username) {
            this.trips = tmpUser.trips;
          }
        });
      })
    })
  }
  deleteTrip(trip: Trip) {
    let alert = this.alertCtrl.create({
      title: 'Delete confirmation',
      subTitle: 'Are you sure you want to delete ' + trip.name + '?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => { }
        },
        {
          text: 'Delete',
          handler: () => {
            let username;
            this.authProvider.getUserSession().then(usernameElement => {
              username = usernameElement;
            }).then(() =>
              this.tripsProvider.deleteTrip(trip, username).then(() => {
                this.initTrips();
              }))
          }
        }
      ]
    });
    alert.present();
  }
}
