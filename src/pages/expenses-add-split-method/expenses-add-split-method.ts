import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { Expense, ExpensesProvider, ExpenseItem, AssignedTo } from '../../providers/expenses/expenses';
import { Trip } from '../../providers/trips/trips';
import { Contact, ContactPayer } from '../../providers/contacts/contacts';
import { Currency } from '../../providers/rest/rest';
import { ExpensesCategoryDetailsPage } from '../expenses-category-details/expenses-category-details';

@IonicPage()
@Component({
  selector: 'page-expenses-add-split-method',
  templateUrl: 'expenses-add-split-method.html',
})
export class ExpensesAddSplitMethodPage {

  expense: Expense;
  trip: Trip;
  expenseArr: number[] = [];
  expensePaidByArr: number[] = [];
  newAmount: number;
  amountToBePaid: number;

  splitValid: boolean;
  priceValid: boolean;
  itemSumValid: boolean;
  submitAttempt: boolean;

  // epxense fields
  description: string;
  category: string;
  totalPrice: number;
  selectedCurrency: Currency;
  date: Date;
  selectedPaidBy: Contact[];
  selectedParticipants: Contact[];
  selectedSplitMethod: string;

  // temp array
  tmpCostHolder: ContactPayer[] = [];
  tmpItemsArr: ExpenseItem[] = [];
  tmpItemsArrSelected: ExpenseItem[] = [];


  constructor(public navCtrl: NavController, public navParams: NavParams, public expensesProvider: ExpensesProvider, public alertCtrl: AlertController) {
    this.description = this.navParams.get("expense").description;
    this.category = this.navParams.get("expense").category;
    this.totalPrice = this.navParams.get("expense").totalPrice;
    this.selectedCurrency = this.navParams.get("expense").selectedCurrency;
    this.date = this.navParams.get("expense").date;
    this.selectedPaidBy = this.navParams.get("expense").selectedPaidBy;
    this.selectedParticipants = this.navParams.get("expense").selectedParticipants;
    this.selectedSplitMethod = this.navParams.get("expense").selectedSplitMethod;
    this.trip = this.navParams.get("trip");

    this.expense = this.navParams.get("expense");


    this.expense.description = this.description;
    this.expense.category = this.category;
    this.expense.totalPrice = this.totalPrice;
    this.expense.currency = this.selectedCurrency;
    this.expense.date = this.date;

    let tmpArr: ContactPayer[] = [];
    this.selectedPaidBy.forEach(element => {
      tmpArr.push(new ContactPayer(Number.parseInt(element.id.toString()), 0));
    });

    this.expense.paidBy = tmpArr;
    this.expense.participants = this.selectedParticipants;

    // need to set all these elements to 0 because they still hold the values of the participants in storage
    this.expense.participants.forEach(participantElement => {
      participantElement.due = 0;
      participantElement.receives = 0;

      this.tmpCostHolder.push(new ContactPayer(participantElement.id, 0));

    });
    this.expense.splitMethod = this.selectedSplitMethod;
    this.expense.expenseItems = [];

    this.tmpItemsArr = this.expense.expenseItems;

    if (this.expense.paidBy.length === 1 || this.expense.splitMethod == "feeling lucky") {
      console.log('exactly one payer. Setting priceValid now...');
      this.changeTotalAmountPaidBy({ value: this.expense.totalPrice }, this.expense.paidBy[0].id);

      if (this.expense.splitMethod == "divided evenly" || this.expense.splitMethod == "feeling lucky") {
        this.addExpense();
      }
    }
  }

  customTrackBy(index: number, obj: any): any {
    return index;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ExpensesAddSplitMethodPage');
  }

  ionViewWillEnter() {
    this.expense = this.navParams.get("expense");
    this.trip = this.navParams.get("trip");
    this.newAmount = this.expense.totalPrice;
    this.amountToBePaid = this.expense.totalPrice;

  }

  changeTotalAmount(selectedValue, id: any) {
    let minus: number = 0;
    let inputValue: number = selectedValue.value || 0;


    // adjusting the values for own share
    this.expense.participants.forEach(participantElement => {
      if (id == participantElement.id) {
        participantElement.expenseCost = inputValue;
        participantElement.due = inputValue;
        participantElement.receives = 0;
        this.expense.paidBy.forEach(paidByElement => {
          if (paidByElement.id == id) {
            if (Number.parseFloat(inputValue.toString()) - Number.parseFloat(paidByElement.amount.toString()) > 0) {
              participantElement.due = Number.parseFloat((Number.parseFloat(inputValue.toString()) - Number.parseFloat(paidByElement.amount.toString())).toFixed(2));
              participantElement.receives = 0;
            } else if (Number.parseFloat(inputValue.toString()) - Number.parseFloat(paidByElement.amount.toString()) < 0) {
              participantElement.receives = Number.parseFloat((Number.parseFloat(paidByElement.amount.toString()) - Number.parseFloat(inputValue.toString())).toFixed(2));
              participantElement.due = 0;
            }
          }
        });
      }
    });

    this.tmpCostHolder.forEach(element => {
      if (element.id == id) {
        element.amount = inputValue;
      }
      minus = Number.parseFloat((Number.parseFloat(minus.toString()) + Number.parseFloat(element.amount.toString())).toFixed(2));
    });

    this.newAmount = Number.parseFloat((Number.parseFloat(this.expense.totalPrice.toString()) - Number.parseFloat(minus.toString())).toFixed(2));
    this.splitValid = this.newAmount === 0;
    console.log('SPLIT DATA IS VALID:' + this.splitValid);
  }

  changeTotalAmountPaidBy(selectedValue: any, participantId: any) {
    let minus: number = 0;
    this.expense.paidBy.forEach(element => {
      if (participantId == element.id) {
        element.amount = selectedValue.value;
      }
    });

    this.expense.paidBy.forEach(element => {
      if (element.amount.toString().length !== 0) {
        minus = Number.parseFloat(minus.toString()) + Number.parseFloat(element.amount.toString());
      }
    });
    this.amountToBePaid = Number.parseFloat(this.expense.totalPrice.toString()) - Number.parseFloat(minus.toString());
    this.priceValid = this.amountToBePaid === 0;
    console.log('PAYMENT DATA IS VALID:' + this.priceValid);
  }

  /**
   * 
   * @param selectedValue participants
   * @param index index so that we can grab the expense associated with the passed through participants 
   */
  onSelectChange(selectedValue: any, index: any) {
    this.expense.expenseItems[index].assignedTo = [];
    selectedValue.forEach(element => {
      let assignedTo = new AssignedTo(element.id);
      this.expense.expenseItems[index].assignedTo.push(assignedTo);
    });
    this.submitAttempt = false;
  }

  promptAddItem() {
    let alert = this.alertCtrl.create({
      title: 'Add Item',
      message: '',
      inputs: [
        {
          name: 'description',
          placeholder: 'description'
        },
        {
          name: 'price',
          placeholder: 'price'
        }
      ],
      buttons: [
        {
          text: 'Add',
          handler: (data) => {
            if (data.description.length >= 1 && data.price.length >= 1 && Number.parseFloat(data.price) > 0 && (this.newAmount - Number.parseFloat(Number.parseFloat(data.price).toFixed(2)) >= 0)) {
              let expenseItem: ExpenseItem = new ExpenseItem(data.description, data.price, []);
              console.log(data.description + " " + data.price);
              this.expense.expenseItems.push(expenseItem);
              this.checkTotalItemSum();
              console.log('added item to list' + " " + this.expense.expenseItems.length + " id : " + expenseItem.id);
            } else {
              alert.setMessage('Please provide a valid description/price');
              return false;
            }
          }
        },
        {
          text: 'Cancel',
          handler: () => {
            console.log('Cancelled alert');
          }
        },
      ]
    });

    alert.present();
    this.submitAttempt = false;
  }

  checkTotalItemSum() {
    let sum: number = 0;
    console.log('Checking total item sum')
    this.expense.expenseItems.forEach(item => {
      sum = sum + Number.parseFloat(item.price);
    });
    this.newAmount = Number.parseFloat(this.expense.totalPrice + '') - sum;
    this.itemSumValid = sum === Number.parseFloat(this.expense.totalPrice + '');
  }

  async addExpense() {
    if (!this.priceValid ||
      (this.expense.splitMethod == "own share" && !this.splitValid) ||
      (this.expense.splitMethod == "way of bill" && !this.itemSumValid)) {
      this.submitAttempt = true;
    } else {
      if (this.expense.splitMethod == "feeling lucky") {
        let totalSumPaidBy = this.expense.totalPrice;
        this.expense.paidBy.forEach((paidByRandom, index) => {
          if (this.expense.paidBy.length - 1 == index) {
            paidByRandom.amount = totalSumPaidBy;
          } else {
            let rnd = Math.floor(Math.random() * totalSumPaidBy);
            totalSumPaidBy = Number.parseInt(totalSumPaidBy.toString()) - Number.parseInt(rnd.toString());
            paidByRandom.amount = rnd;
          }
        });

        

        let totalSumParticipants = this.expense.totalPrice;
        this.expense.participants.forEach((participantElement, index) => {
          if (this.expense.participants.length - 1 == index) {
            participantElement.due = totalSumParticipants;
            this.tmpCostHolder.forEach(tmpCost => {
              if(tmpCost.id == participantElement.id){
                tmpCost.amount = totalSumParticipants;
              }
            })
          } else {
            let rnd = Math.floor(Math.random() * totalSumParticipants);
            totalSumParticipants = Number.parseInt(totalSumParticipants.toString()) - Number.parseInt(rnd.toString());
            participantElement.due = rnd;
            this.tmpCostHolder.forEach(tmpCost => {
              if(tmpCost.id == participantElement.id){
                tmpCost.amount = rnd;
              }
            })
          }
          participantElement.receives = 0;
          this.expense.paidBy.forEach(paidByElement => {
            if (paidByElement.id == participantElement.id) {
              participantElement.receives = Number.parseFloat((Number.parseFloat(paidByElement.amount.toString()) - (Number.parseFloat(participantElement.due.toString()))).toFixed(2));
              if (participantElement.receives < 0) {
                participantElement.due = Number.parseFloat((Number.parseFloat(participantElement.receives.toString()) * Number.parseFloat((-1).toString())).toFixed(2));
                participantElement.receives = 0;
              } else if (participantElement.receives > 0) {
                participantElement.due = Number.parseFloat((Number.parseFloat(paidByElement.amount.toString()) - Number.parseFloat(participantElement.receives.toString()) - (Number.parseFloat(participantElement.due.toString()))).toFixed(2));
              }
            }
          })
        });

        console.log("PARTICIPANTS")
        this.expense.participants.forEach(element => {
          console.log("id: " + element.id + " || due: " + element.due + " || receives: " + element.receives);
        });

        console.log("\nPaid BY")
        this.expense.paidBy.forEach(element => {
          console.log("id: " + element.id + " || due: " + element.amount);
        });
      }
      if (this.expense.splitMethod == "divided evenly") {
        console.log("in divided evenly");
        this.expense.participants.forEach(participantElement => {
          participantElement.due = Number.parseFloat((Number.parseFloat(this.expense.totalPrice.toString()) / Number.parseFloat(this.expense.participants.length.toString())).toFixed(2));
          participantElement.receives = 0;
          this.expense.paidBy.forEach(paidByElement => {
            if (paidByElement.id == participantElement.id) {
              participantElement.receives = Number.parseFloat((Number.parseFloat(paidByElement.amount.toString()) - (Number.parseFloat(this.expense.totalPrice.toString()) / Number.parseFloat(this.expense.participants.length.toString()))).toFixed(2));
              if (participantElement.receives < 0) {
                participantElement.due = Number.parseFloat((Number.parseFloat(participantElement.receives.toString()) * Number.parseFloat((-1).toString())).toFixed(2));
                participantElement.receives = 0;
              } else if (participantElement.receives > 0) {
                participantElement.due = Number.parseFloat((Number.parseFloat(paidByElement.amount.toString()) - Number.parseFloat(participantElement.receives.toString()) - (Number.parseFloat(this.expense.totalPrice.toString()) / Number.parseFloat(this.expense.participants.length.toString()))).toFixed(2));
              }
            }
          });
          this.tmpCostHolder.forEach(tmpCost => {
            if(tmpCost.id == participantElement.id){
              tmpCost.amount = Number.parseFloat((Number.parseFloat(this.expense.totalPrice.toString()) / Number.parseFloat(this.expense.participants.length.toString())).toFixed(2));
            }
          })
        });
      }
      if (this.expense.splitMethod == "way of bill") {
        this.expense.participants.forEach(participantElement => {
          participantElement.receives = 0;
          participantElement.due = 0;
          this.expense.expenseItems.forEach(item => {
            item.assignedTo.forEach(assignedToElement => {
              if (assignedToElement.id == participantElement.id) {
                participantElement.due = Number.parseFloat((Number.parseFloat(participantElement.due.toString()) + (Number.parseFloat(item.price.toString()) / Number.parseFloat(item.assignedTo.length.toString()))).toFixed(2));
              }
            });
          });
          this.expense.paidBy.forEach(paidByElement => {
            if (paidByElement.id == participantElement.id) {
              participantElement.receives = Number.parseFloat((Number.parseFloat(paidByElement.amount.toString()) - Number.parseFloat(participantElement.due.toString())).toFixed(2));
              if (participantElement.receives < 0) {
                participantElement.due = Number.parseFloat((Number.parseFloat(participantElement.receives.toString()) * Number.parseFloat((-1).toString())).toFixed(2));
                participantElement.receives = 0;
              } else if (participantElement.receives > 0) {
                participantElement.receives = Number.parseFloat((Number.parseFloat(paidByElement.amount.toString()) - Number.parseFloat(participantElement.due.toString())).toFixed(2));
                participantElement.due = 0;
              }
            }
          });
        });
      }

      this.expensesProvider.addExpenseToTrip(
        this.expense.description,
        this.expense.category,
        this.expense.totalPrice,
        this.expense.currency,
        this.expense.date,
        this.expense.paidBy,
        this.expense.participants,
        this.expense.splitMethod,
        this.tmpCostHolder,
        this.expense.expenseItems,
        this.trip);

      this.navCtrl.push(ExpensesCategoryDetailsPage, {
        "trip": this.trip,
        "category": this.expense.category
      })

    }
  }
}
