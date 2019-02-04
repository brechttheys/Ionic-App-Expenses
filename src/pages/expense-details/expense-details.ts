import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Expense, AssignedTo } from '../../providers/expenses/expenses';
import { Contact, ContactPayer } from '../../providers/contacts/contacts';
import { User } from '../../providers/auth/auth';
import { Storage } from '../../../node_modules/@ionic/storage';

/**
 * Generated class for the ExpenseDetailsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-expense-details',
  templateUrl: 'expense-details.html',
})
export class ExpenseDetailsPage {

  expense: Expense;
  paidBy: ContactPayer[] = [];
  ownShareCost: ContactPayer[] = [];
  names = undefined;

  constructor(public navCtrl: NavController, public navParams: NavParams, public storage: Storage) {
    this.expense = this.navParams.get("expense");
  }

  initPage() {
    let username: string;
    let users: User[];
    let tmpContacts: Contact[];
    this.storage.get("session").then(usernameResp => {
      username = usernameResp;
    }).then(() => {
      this.storage.get("users").then(usersResp => {
        users = usersResp;
        users.forEach(user => {
          if (username == user.username) {
            tmpContacts = user.contacts;
            tmpContacts.forEach(contactElement => {
              this.expense.paidBy.forEach(paidByElement => {
                if (contactElement.id == paidByElement.id) {
                  let newElement = new ContactPayer(contactElement.id, paidByElement.amount);
                  newElement.firstname = contactElement.firstname;
                  newElement.lastname = contactElement.lastname;
                  this.paidBy.push(newElement);
                }
              });
              if (this.expense.splitMethod == "own share" || "feeling lucky" || "divided evenly") {
                this.expense.expenseTracker.forEach(expenseTrackerElement => {
                  if (expenseTrackerElement.id == contactElement.id) {
                    let newElement = new ContactPayer(contactElement.id, expenseTrackerElement.amount);
                    newElement.firstname = contactElement.firstname;
                    newElement.lastname = contactElement.lastname;
                    this.ownShareCost.push(newElement);
                  }
                });
              }
              if (this.expense.splitMethod == "way of bill") {
                this.expense.expenseItems.forEach(expenseItemElement => {
                  expenseItemElement.assignedTo.forEach(assignedToElement => {
                    console.log("assignedToID: " + assignedToElement + "  " + contactElement.id);
                    if(assignedToElement.id == contactElement.id){
                      assignedToElement.firstname = contactElement.firstname;
                      assignedToElement.lastname = contactElement.lastname;
                      console.log("adding persons");
                    }
                  });
                });
              }
            });
          }
        });
      });
    });
  }

  async ionViewWillEnter() {
    this.paidBy = [];
    await this.initPage();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ExpenseDetailsPage');
  }

}
