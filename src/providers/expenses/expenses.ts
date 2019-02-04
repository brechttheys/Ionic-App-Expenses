import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Contact, ContactPayer } from '../contacts/contacts';
import { User, AuthProvider } from '../auth/auth';
import { Trip } from '../trips/trips';
import { Storage } from '@ionic/storage';
import { Currency, RestProvider } from '../rest/rest';
import { App } from "ionic-angular";
import { ExpensesCategoryDetailsPage } from '../../pages/expenses-category-details/expenses-category-details';


export class ExpenseItem {
  public id: number;
  public description: string;
  public price: string;

  // the id's of the contacts
  public assignedTo: AssignedTo[];

  constructor(description: string, price: string, assignedTo: AssignedTo[]) {
    this.id = new Date().valueOf();
    this.description = description;
    this.price = price;
    this.assignedTo = assignedTo;
  }
}

export class AssignedTo{
  public id: number;
  public firstname: string;
  public lastname: string;

  constructor(id: number){
    this.id = id;
  }
}

export class Expense {
  public description: string;
  public category: string;
  public totalPrice: number;
  public date: Date;
  public currency: Currency;
  public originalCurrency: Currency;
  public paidBy: ContactPayer[]
  public splitMethod: string;
  public participants: Contact[];
  public expenseTracker: ContactPayer[];
  public expenseItems: ExpenseItem[];

  constructor(
    description: string,
    category: string,
    totalPrice: number,
    currency: Currency,
    originalCurrency: Currency,
    date: Date,
    paidBy: ContactPayer[],
    participants: Contact[],
    splitMethod: string,
    expenseTracker: ContactPayer[],
    expenseItems: ExpenseItem[]
  ) {
    this.description = description;
    this.category = category;
    this.totalPrice = totalPrice;
    this.currency = currency;
    this.originalCurrency = originalCurrency;
    this.date = date;
    this.paidBy = paidBy;
    this.participants = participants;
    this.splitMethod = splitMethod;
    this.expenseTracker = expenseTracker;
    this.expenseItems = expenseItems;
  }
}

export class ContactExpense {
  currencySymbol: string;
  tripName: string;
  date: string;
  category: string;
  toPay: number;
  toReceive: number;

  constructor(tripName: string, category: string, currencySymbol: string, date: string, toPay: number, toReceive: number) {
    this.tripName = tripName;
    this.category = category;
    this.currencySymbol = currencySymbol;
    this.date = date;
    this.toPay = toPay;
    this.toReceive = toReceive;
  }
}

export class ExpenseByDate {

  date: string;
  expenses: ContactExpense[];

  constructor(date: string, expenses: ContactExpense[]) {
    this.date = date;
    this.expenses = expenses;
  }

}

export class ExpenseByCategory {

  category: string;
  expenses: ContactExpense[];

  constructor(category: string, expenses: ContactExpense[]) {
    this.category = category;
    this.expenses = expenses;
  }

}

@Injectable()
export class ExpensesProvider {

  constructor(public http: HttpClient, public authProvider: AuthProvider, public storage: Storage, public restProvider: RestProvider, public app: App) {
    console.log('Hello ExpensesProvider Provider');
  }


  addExpenseToTrip(description: string, category: string, totalPrice: number, selectedCurrency: Currency, date: Date,
    paidBy: ContactPayer[], selectedParticipants: Contact[], selectedSplitMethod: string, expenseTracker: ContactPayer[], expenseItems: ExpenseItem[], trip: Trip) {

    let originalCurrency = selectedCurrency;
    if (trip.displayCurrency.code !== selectedCurrency.code) {
      let multiplier: number = 1;

      trip.rates.forEach(rateElement => {
        if (rateElement.from.code === selectedCurrency.code && rateElement.to.code === trip.displayCurrency.code) {
          multiplier = rateElement.multiplier;
        }
      })

      totalPrice = Number.parseFloat((Number.parseFloat(totalPrice.toString()) * Number.parseFloat(multiplier.toString())).toFixed(2));
      paidBy.forEach(paidByElement => {
        paidByElement.amount = Number.parseFloat((Number.parseFloat(paidByElement.amount.toString()) * Number.parseFloat(multiplier.toString())).toFixed(2))
      });
      selectedCurrency = trip.displayCurrency;
      selectedParticipants.forEach(participantElement => {
        participantElement.due = Number.parseFloat((Number.parseFloat(participantElement.due.toString()) * Number.parseFloat(multiplier.toString())).toFixed(2));
        participantElement.receives = Number.parseFloat((Number.parseFloat(participantElement.receives.toString()) * Number.parseFloat(multiplier.toString())).toFixed(2));
      })
    }

    let username: string;
    let users: User[] = [];
    let contacts: Contact[] = [];
    let trips: Trip[] = [];
    let expenses: Expense[] = [];
    let participants: Contact[] = [];
    this.storage.get("session").then(usernameResp => {
      username = usernameResp;
    }).then(() => {
      this.storage.get("users").then(usersResp => {
        users = usersResp;
        users.forEach(user => {
          if (username == user.username) {
            contacts = user.contacts;
            trips = user.trips;
            trips.forEach(tripElement => {
              if (tripElement.name == trip.name) {
                expenses = tripElement.expenses;
                let paidByArr: ContactPayer[] = [];
                paidBy.forEach(element => {
                  paidByArr.push(new ContactPayer(element.id, element.amount));
                });
                expenses.push(new Expense(description, category, totalPrice, selectedCurrency, originalCurrency, date, paidByArr, selectedParticipants, selectedSplitMethod, expenseTracker, expenseItems));
                participants = tripElement.participants;
                participants.forEach(participantElement => {
                  selectedParticipants.forEach(selectPartElement => {
                    if (selectPartElement.id == participantElement.id) {
                      participantElement.due = Number.parseFloat(participantElement.due.toString()) + Number.parseFloat(selectPartElement.due.toString());
                      participantElement.receives = Number.parseFloat(participantElement.receives.toString()) + Number.parseFloat(selectPartElement.receives.toString());
                      //updating the contacts json thingymajig recieves and dues
                      contacts.forEach(contactElement => {
                        if (contactElement.id == selectPartElement.id) {
                          contactElement.due = Number.parseFloat(contactElement.due.toString()) + Number.parseFloat(selectPartElement.due.toString());
                          contactElement.receives = Number.parseFloat(contactElement.receives.toString()) + Number.parseFloat(selectPartElement.receives.toString());
                        }
                      });
                    }
                  });
                });
              }
            });
            this.storage.set("users", users);
          }
        })
      })
    })
  }

  finalCallback(test: boolean) {
    return test;
  }

  storageCallback(users: any, trip: Trip, category: string) {
    console.log("in callback");
    this.storage.set("users", users);
    this.app.getActiveNav().push(ExpensesCategoryDetailsPage, {
      "trip": trip,
      "category": category
    });
    //this.app.getActiveNav().setRoot(TripsOverviewPage);
    //this.app.getActiveNav().popToRoot();
  }

  getExpensesByCategoryAndUserSession(category: string, trip: Trip) {
    let username: string;
    let users: User[] = [];
    let trips: Trip[] = [];
    let expenses: Expense[] = [];
    let expensesByCategory: Expense[] = [];
    return this.storage.get("session").then(usernameResp => {
      username = usernameResp;
    }).then(() => {
      return this.storage.get("users").then(usersResp => {
        users = usersResp;
        users.forEach(user => {
          if (username == user.username) {
            trips = user.trips;
            trips.forEach(tripElement => {
              if (tripElement.name == trip.name) {
                expenses = tripElement.expenses;
                expenses.forEach(expenseElement => {
                  if (expenseElement.category == category) {
                    expensesByCategory.push(expenseElement);
                  }
                });
              }
            });
          }
        })
      })
    }).then(() => {
      return expensesByCategory
    })
  }

  getAllExpensesDates(contact: Contact) {
    let users: User[] = [];
    let trips: Trip[] = [];
    let expenses: Expense[] = [];
    let dates: Set<string> = new Set<string>();
    let username: string;
    return this.storage.get("session").then(usernameResp => {
      username = usernameResp;
    }).then(() => {
      return this.storage.get("users").then(usersResp => {
        users = usersResp;
        users.forEach(user => {
          if (username == user.username) {
            console.log("got user");
            trips = user.trips;
            trips.forEach(tripElement => {
              let name = tripElement.name;
              console.log(name);
              expenses = tripElement.expenses;
              expenses.forEach(expenseElement => {
                let participants: Contact[] = expenseElement.participants;
                let found = false;
                participants.forEach(participant => {
                  if (participant == contact) {
                    found = true;
                  }
                });
                if (found = true) {
                  let tmpDate: string = new Date(expenseElement.date).toLocaleDateString();
                  dates.add(tmpDate);
                }
              });
            })
          };
        });
      });
    }).then(() => {
      return dates;
    });
  }

  getAllExpensesCategories(contact: Contact) {
    let users: User[] = [];
    let trips: Trip[] = [];
    let expenses: Expense[] = [];
    let categories: Set<string> = new Set<string>();
    let username: string;
    return this.storage.get("session").then(usernameResp => {
      username = usernameResp;
    }).then(() => {
      return this.storage.get("users").then(usersResp => {
        users = usersResp;
        users.forEach(user => {
          if (username == user.username) {
            console.log("got user");
            trips = user.trips;
            trips.forEach(tripElement => {
              let name = tripElement.name;
              console.log(name);
              expenses = tripElement.expenses;
              expenses.forEach(expenseElement => {
                let participants: Contact[] = expenseElement.participants;
                let found = false;
                participants.forEach(participant => {
                  if (participant == contact) {
                    found = true;
                  }
                });
                if (found = true) {
                  let tmpCat: string = expenseElement.category;
                  categories.add(tmpCat);
                }
              });
            });
          }
        });
      });
    }).then(() => {
      return categories;
    });
  }

  async getExpenseByCategoryForContact(contact: Contact) {
    let contactExpenses: ExpenseByCategory[] = [];
    let categories: Set<string> = new Set<string>();
    await this.getAllExpensesCategories(contact).then(result => { categories = result });
    categories.forEach(element => {
      let tmpContactExpenses: ContactExpense[] = [];
      let tmpExpenseCategory: ExpenseByCategory = new ExpenseByCategory(element, tmpContactExpenses);
      contactExpenses.push(tmpExpenseCategory);
    });
    console.log("this is the category list");
    console.log(categories);
    let users: User[] = [];
    let trips: Trip[] = [];
    let expenses: Expense[] = [];
    let username: string;
    return this.storage.get("session").then(usernameResp => {
      username = usernameResp;
    }).then(() => {
      return this.storage.get("users").then(usersResp => {
        users = usersResp;
        users.forEach(user => {
          if (username == user.username) {
            console.log("got user");
            trips = user.trips;
            trips.forEach(tripElement => {
              let name = tripElement.name;
              console.log(name);
              expenses = tripElement.expenses;
              expenses.forEach(expenseElement => {
                console.log("into expenses")
                let currency = expenseElement.currency;
                let date = expenseElement.date;
                let cat = expenseElement.category;
                let contactPayments: Contact[] = expenseElement.participants;
                contactPayments.forEach(participantElement => {
                  let payer: Contact = participantElement;
                  if (contact.id == payer.id) {
                    console.log("matching participant id");
                    let tmpContactExpense: ContactExpense = new ContactExpense(name, cat, currency.symbol, new Date(date).toLocaleDateString(), payer.due, payer.receives);
                    console.log(tmpContactExpense);
                    contactExpenses.forEach(ce => {
                      if (ce.category == cat) {
                        console.log("found matching category");
                        ce.expenses.push(tmpContactExpense);
                      }
                    }
                    );
                  }
                })
              });
            });
          }
        });
      });
    }).then(() => {
      console.log(contactExpenses);
      return contactExpenses
    });
  }

  async getExpenseByDateForContact(contact: Contact) {
    let contactExpenses: ExpenseByDate[] = [];
    let dates: Set<string> = new Set<string>();
    await this.getAllExpensesDates(contact).then(result => { dates = result });
    dates.forEach(element => {
      let tmpContactExpenses: ContactExpense[] = [];
      let tmpExpenseDate: ExpenseByDate = new ExpenseByDate(element, tmpContactExpenses);
      contactExpenses.push(tmpExpenseDate);
    });
    console.log("this is the category list");
    console.log(dates);
    let users: User[] = [];
    let trips: Trip[] = [];
    let expenses: Expense[] = [];
    let username: string;
    return this.storage.get("session").then(usernameResp => {
      username = usernameResp;
    }).then(() => {
      return this.storage.get("users").then(usersResp => {
        users = usersResp;
        users.forEach(user => {
          if (username == user.username) {
            console.log("got user");
            trips = user.trips;
            trips.forEach(tripElement => {
              let name = tripElement.name;
              console.log(name);
              expenses = tripElement.expenses;
              expenses.forEach(expenseElement => {
                console.log("into expenses")
                let currency = expenseElement.currency;
                let date = new Date(expenseElement.date).toLocaleDateString();
                let cat = expenseElement.category;
                let contactPayments: Contact[] = expenseElement.participants;
                contactPayments.forEach(participantElement => {
                  let payer: Contact = participantElement;
                  if (contact.id == payer.id) {
                    console.log("matching participant id");
                    let tmpContactExpense: ContactExpense = new ContactExpense(name, cat, currency.symbol, date, payer.due, payer.receives);
                    console.log(tmpContactExpense);
                    contactExpenses.forEach(ce => {
                      if (ce.date == date) {
                        console.log("same date: " + ce.date + " " + date + "@| pushing: " + tmpContactExpense.date);
                        ce.expenses.push(tmpContactExpense);
                      }
                    }
                    );
                  }
                })
              });
            });
          }
        });
      });
    }).then(() => {
      console.log(contactExpenses);
      return contactExpenses
    });
  }
  async deleteExpense(expense: Expense, trip: Trip) {
    let username: string;
    let users: User[] = [];
    let trips: Trip[] = [];
    let expenses: Expense[] = [];

    await this.storage.get("session").then(usernameResp => {
      username = usernameResp;
    }).then(() => {
      this.storage.get("users").then(usersResp => {
        users = usersResp;
        users.forEach(user => {
          if (username == user.username) {
            trips = user.trips;
            trips.forEach(tripElement => {
              if (tripElement.name == trip.name) {
                expenses = tripElement.expenses;

                expense.participants.forEach(expenseParticipantElement => {
                  tripElement.participants.forEach(participantElement => {
                    if (participantElement.id === expenseParticipantElement.id) {
                      participantElement.due = participantElement.due - expenseParticipantElement.due;
                      participantElement.receives = participantElement.receives - expenseParticipantElement.receives;
                    }
                  })
                  user.contacts.forEach(contactElement => {
                    if (contactElement.id === expenseParticipantElement.id) {
                      contactElement.due = contactElement.due - expenseParticipantElement.due;
                      contactElement.receives = contactElement.receives - expenseParticipantElement.receives;
                    }
                  })
                });
                let index = expenses.indexOf(expense);
                expenses.splice(index, 1);
              }
            });
            this.storage.set("users", users);
          }
        })
      })
    })
  }
}