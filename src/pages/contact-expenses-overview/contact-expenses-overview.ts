import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Contact } from '../../providers/contacts/contacts';
import { Expense, ExpensesProvider, ContactExpense, ExpenseByCategory, ExpenseByDate } from '../../providers/expenses/expenses';

/**
 * Generated class for the ContactExpensesOverviewPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */


@IonicPage()
@Component({
  selector: 'page-contact-expenses-overview',
  templateUrl: 'contact-expenses-overview.html',
})
export class ContactExpensesOverviewPage {

  contact : Contact;
  expensesByCategory : ExpenseByCategory[];
  expensesByDate : ExpenseByDate[];
  expensesByDateTest : ExpenseByDate[];
  buttonEnabled : boolean = true;
  buttonText : string = "Show per date";

  constructor(public navCtrl: NavController, public navParams: NavParams, public expensesProvider : ExpensesProvider) {
    this.contact = this.navParams.get('contact');
    this.getAllExpensesForContactPerCategory(this.contact);
    this.getAllExpensesForContactPerDate(this.contact);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ContactExpensesOverviewPage');
  }

  ionViewWillEnter() {
    this.getAllExpensesForContactPerCategory(this.contact);
    this.getAllExpensesForContactPerDate(this.contact);
  }

  ngOnInit() {
    this.getAllExpensesForContactPerCategory(this.contact);
    this.getAllExpensesForContactPerDate(this.contact);
  }

  getAllExpensesForContactPerCategory(contact : Contact) {
    this.expensesProvider.getExpenseByCategoryForContact(contact).then(result => {
      this.expensesByCategory = result;
    })
  }

  getAllExpensesForContactPerDate(contact : Contact) {
    this.expensesProvider.getExpenseByDateForContact(contact).then(result => {
      this.expensesByDate = result;
      /*
      this.expensesByDate.forEach(element => {
        var d = new Date(element.date);
        console.log("logging: " + d.toLocaleDateString());
      });
      */
    })
  }

  switchView() {
    this.buttonEnabled = !this.buttonEnabled;
    if (this.buttonEnabled) {
      this.buttonText = "Show per date";
    }
    else {
      this.buttonText = "Show per category";
    }
  }

}