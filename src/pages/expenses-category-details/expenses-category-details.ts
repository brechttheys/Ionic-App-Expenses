import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, App } from 'ionic-angular';
import { Trip, TripsProvider } from '../../providers/trips/trips';
import { Expense, ExpensesProvider } from '../../providers/expenses/expenses';
import { AuthProvider, User } from '../../providers/auth/auth';
import { ExpensesAddPage } from '../expenses-add/expenses-add';
import { ExpenseDetailsPage } from '../expense-details/expense-details';
import { TripsOverviewPage } from '../trips-overview/trips-overview';
import { ExpensesCategoryOverviewPage } from '../expenses-category-overview/expenses-category-overview';


@IonicPage()
@Component({
  selector: 'page-expenses-category-details',
  templateUrl: 'expenses-category-details.html',
})
export class ExpensesCategoryDetailsPage {

  trip: Trip;
  categoryStr: string;
  expenses: Expense[];

  constructor(public navCtrl: NavController, public navParams: NavParams, public expensesProvider: ExpensesProvider, public authProvider: AuthProvider, public alertCtrl: AlertController, public app: App, public tripProvider: TripsProvider) {
    this.trip = this.navParams.get("trip");
    this.categoryStr = <string>this.navParams.get("category");
  }

  navigateToExpenseDetailsPage(expense: Expense) {
    this.navCtrl.push(ExpenseDetailsPage, {
      "expense": expense
    });
  }

  ionViewWillEnter() {
    this.initOverview();
  }

  leave() {
    console.log("leaving");
    let username;
    let tmpUsers: User[] = [];
    let tmpUser: User;

    this.authProvider.getUserSession().then(usernameElement => {
      username = usernameElement;
    }).then(() => {
      this.authProvider.getStorage().get("users").then(users => {
        tmpUsers = users;
        tmpUsers.forEach(userElement => {
          tmpUser = userElement;
          if (tmpUser.username == username) {
            tmpUser.trips.forEach(tmpTrip => {
              if (tmpTrip.id == this.trip.id) {
                this.trip = tmpTrip;
              }
            })
          }
        });
        this.navCtrl.popToRoot();
        this.navCtrl.push(ExpensesCategoryOverviewPage, { trip: this.trip });
      })
    })
  }

  initOverview() {
    let username; 
    let tmpUsers: User[] = [];
    let tmpUser: User;

    this.authProvider.getUserSession().then(usernameElement => {
      username = usernameElement;
    }).then(() => {
      this.authProvider.getStorage().get("users").then(users => {
        tmpUsers = users;
        tmpUsers.forEach(userElement => {
          tmpUser = userElement;
          if (tmpUser.username == username) {
            tmpUser.trips.forEach(tmpTrip =>{
              if(tmpTrip.id == this.trip.id){
                this.trip = tmpTrip;
              }
            })
          }
        });
      })
    })    

    this.expensesProvider.getExpensesByCategoryAndUserSession(this.categoryStr, this.trip).then(resp => {
      this.expenses = resp;
      console.log("initOverview done");
    })
  }

  navigateToExpensesAddPage() {
    this.navCtrl.push(ExpensesAddPage, {
      "category": this.categoryStr,
      "trip": this.trip
    })
  }

  deleteExpense(expense: Expense) {
    let alert = this.alertCtrl.create({
      title: 'Delete confirmation',
      subTitle: 'Are you sure you want to delete ' + expense.description + '?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => { }
        },
        {
          text: 'Delete',
          handler: () => {
            this.expensesProvider.deleteExpense(expense, this.trip).then(() => {
              this.initOverview();
            });
          }
        }
      ]
    });
    alert.present();
  }

}
