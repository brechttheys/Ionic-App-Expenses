import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Trip } from '../trips/trips';
import { Contact } from '../contacts/contacts';
import { Rate } from '../rates/rates';
import { Currency } from '../rest/rest';


export class User {
  public username: string;
  public password: string;
  public trips: Trip[];
  public contacts: Contact[];
  public rates: Rate[];
  public globalCurrency: Currency;

  constructor(username: string, password: string) {
    this.username = username;
    this.password = password;
    this.trips = [];
    this.contacts = [];
    this.rates = [];
    this.globalCurrency = new Currency("EUR", "€");
  }
}


@Injectable()
export class AuthProvider {



  constructor(private storage: Storage) {

    // initialize two users at first startup
    // if users does not exist, create it
    this.storage.get("users").then(resp => {
      if (!resp) {
        this.createDefaultUsers();
      }
    });
  }

  // this function will be called once through the entire lifecycle
  // it initializes our storage with two different users with a password
  async createDefaultUsers() {

    const storageName = 'users';
    const storageKeys = await this.storage.keys();

    if (!storageKeys.some(k => k === storageName)) {
      const array: {}[] =
        [
          {
            "username": "admin",
            "password": "admin",
            "trips": [
              {
                "id": 1533986852042,
                "name": "Safari",
                "country": "United Republic of Tanzania",
                "year": 2018,
                "currencies": [
                  {
                    "code": "TZS",
                    "symbol": "Sh"
                  }
                ],
                "participants": [
                  {
                    "id": 1533986760961,
                    "firstname": "admin",
                    "lastname": "(ME)",
                    "due": 4200000,
                    "receives": 47825000,
                    "transfers": []
                  },
                  {
                    "id": 1533986795222,
                    "firstname": "Bart",
                    "lastname": "Certyn",
                    "due": 20708333.34,
                    "receives": 3450000,
                    "transfers": []
                  },
                  {
                    "id": 1533986800000,
                    "firstname": "Steven",
                    "lastname": "Ghekiere",
                    "due": 16291666.67,
                    "receives": 12383333.33,
                    "transfers": []
                  },
                  {
                    "id": 1533986805110,
                    "firstname": "Brecht",
                    "lastname": "Theys",
                    "due": 22458333.34,
                    "receives": 0,
                    "transfers": []
                  }
                ],
                "expenses": [
                  {
                    "description": "Camping equipment",
                    "category": "Overnight",
                    "totalPrice": "5500000",
                    "currency": {
                      "code": "TZS",
                      "symbol": "Sh"
                    },
                    "originalCurrency": {
                      "code": "TZS",
                      "symbol": "Sh"
                    },
                    "date": "2018-08-11T11:27:43.317Z",
                    "paidBy": [
                      {
                        "id": 1533986760961,
                        "amount": "550000"
                      },
                      {
                        "id": 1533986795222,
                        "amount": "4950000"
                      }
                    ],
                    "participants": [
                      {
                        "id": 1533986760961,
                        "firstname": "admin",
                        "lastname": "(ME)",
                        "due": 450000,
                        "receives": 0,
                        "transfers": [],
                        "expenseCost": "1000000"
                      },
                      {
                        "id": 1533986795222,
                        "firstname": "Bart",
                        "lastname": "Certyn",
                        "due": 0,
                        "receives": 3450000,
                        "transfers": [],
                        "expenseCost": "1500000"
                      },
                      {
                        "id": 1533986800000,
                        "firstname": "Steven",
                        "lastname": "Ghekiere",
                        "due": "1500000",
                        "receives": 0,
                        "transfers": [],
                        "expenseCost": "1500000"
                      },
                      {
                        "id": 1533986805110,
                        "firstname": "Brecht",
                        "lastname": "Theys",
                        "due": "1500000",
                        "receives": 0,
                        "transfers": [],
                        "expenseCost": "1500000"
                      }
                    ],
                    "splitMethod": "own share",
                    "expenseTracker": [
                      {
                        "id": 1533986760961,
                        "amount": "1000000"
                      },
                      {
                        "id": 1533986795222,
                        "amount": "1500000"
                      },
                      {
                        "id": 1533986800000,
                        "amount": "1500000"
                      },
                      {
                        "id": 1533986805110,
                        "amount": "1500000"
                      }
                    ],
                    "expenseItems": []
                  },
                  {
                    "description": "Local Hotel",
                    "category": "Overnight",
                    "totalPrice": "7800000",
                    "currency": {
                      "code": "TZS",
                      "symbol": "Sh"
                    },
                    "originalCurrency": {
                      "code": "TZS",
                      "symbol": "Sh"
                    },
                    "date": "2018-08-11T11:29:03.472Z",
                    "paidBy": [
                      {
                        "id": 1533986760961,
                        "amount": "4500000"
                      },
                      {
                        "id": 1533986800000,
                        "amount": "3300000"
                      }
                    ],
                    "participants": [
                      {
                        "id": 1533986760961,
                        "firstname": "admin",
                        "lastname": "(ME)",
                        "due": 0,
                        "receives": 3450000,
                        "transfers": []
                      },
                      {
                        "id": 1533986795222,
                        "firstname": "Bart",
                        "lastname": "Certyn",
                        "due": 2166666.67,
                        "receives": 0,
                        "transfers": []
                      },
                      {
                        "id": 1533986800000,
                        "firstname": "Steven",
                        "lastname": "Ghekiere",
                        "due": 0,
                        "receives": 1133333.33,
                        "transfers": []
                      },
                      {
                        "id": 1533986805110,
                        "firstname": "Brecht",
                        "lastname": "Theys",
                        "due": 2416666.67,
                        "receives": 0,
                        "transfers": []
                      }
                    ],
                    "splitMethod": "way of bill",
                    "expenseTracker": [
                      {
                        "id": 1533986760961,
                        "amount": 0
                      },
                      {
                        "id": 1533986795222,
                        "amount": 0
                      },
                      {
                        "id": 1533986800000,
                        "amount": 0
                      },
                      {
                        "id": 1533986805110,
                        "amount": 0
                      }
                    ],
                    "expenseItems": [
                      {
                        "id": 1533986996161,
                        "description": "Regular Room",
                        "price": "800000",
                        "assignedTo": [
                          {
                            "id": 1533986760961
                          }
                        ]
                      },
                      {
                        "id": 1533987011782,
                        "description": "Deluxe Suite",
                        "price": "6500000",
                        "assignedTo": [
                          {
                            "id": 1533986795222
                          },
                          {
                            "id": 1533986800000
                          },
                          {
                            "id": 1533986805110
                          }
                        ]
                      },
                      {
                        "id": 1533987029790,
                        "description": "Warranty",
                        "price": "500000",
                        "assignedTo": [
                          {
                            "id": 1533986760961
                          },
                          {
                            "id": 1533986805110
                          }
                        ]
                      }
                    ]
                  },
                  {
                    "description": "Plane Tickets",
                    "category": "Transport",
                    "totalPrice": "15000000",
                    "currency": {
                      "code": "TZS",
                      "symbol": "Sh"
                    },
                    "originalCurrency": {
                      "code": "TZS",
                      "symbol": "Sh"
                    },
                    "date": "2018-08-07T11:31:10.197Z",
                    "paidBy": [
                      {
                        "id": 1533986800000,
                        "amount": "15000000"
                      }
                    ],
                    "participants": [
                      {
                        "id": 1533986760961,
                        "firstname": "admin",
                        "lastname": "(ME)",
                        "due": 3750000,
                        "receives": 0,
                        "transfers": []
                      },
                      {
                        "id": 1533986795222,
                        "firstname": "Bart",
                        "lastname": "Certyn",
                        "due": 3750000,
                        "receives": 0,
                        "transfers": []
                      },
                      {
                        "id": 1533986800000,
                        "firstname": "Steven",
                        "lastname": "Ghekiere",
                        "due": 0,
                        "receives": 11250000,
                        "transfers": []
                      },
                      {
                        "id": 1533986805110,
                        "firstname": "Brecht",
                        "lastname": "Theys",
                        "due": 3750000,
                        "receives": 0,
                        "transfers": []
                      }
                    ],
                    "splitMethod": "divided evenly",
                    "expenseTracker": [
                      {
                        "id": 1533986760961,
                        "amount": 0
                      },
                      {
                        "id": 1533986795222,
                        "amount": 0
                      },
                      {
                        "id": 1533986800000,
                        "amount": 0
                      },
                      {
                        "id": 1533986805110,
                        "amount": 0
                      }
                    ],
                    "expenseItems": []
                  },
                  {
                    "description": "Restaurant",
                    "category": "Food",
                    "totalPrice": "45600000",
                    "currency": {
                      "code": "TZS",
                      "symbol": "Sh"
                    },
                    "originalCurrency": {
                      "code": "TZS",
                      "symbol": "Sh"
                    },
                    "date": "2018-08-11T11:31:37.803Z",
                    "paidBy": [
                      {
                        "id": 1533986760961,
                        "amount": "45600000"
                      }
                    ],
                    "participants": [
                      {
                        "id": 1533986760961,
                        "firstname": "admin",
                        "lastname": "(ME)",
                        "due": 0,
                        "receives": 44375000,
                        "transfers": []
                      },
                      {
                        "id": 1533986795222,
                        "firstname": "Bart",
                        "lastname": "Certyn",
                        "due": 14791666.67,
                        "receives": 0,
                        "transfers": []
                      },
                      {
                        "id": 1533986800000,
                        "firstname": "Steven",
                        "lastname": "Ghekiere",
                        "due": 14791666.67,
                        "receives": 0,
                        "transfers": []
                      },
                      {
                        "id": 1533986805110,
                        "firstname": "Brecht",
                        "lastname": "Theys",
                        "due": 14791666.67,
                        "receives": 0,
                        "transfers": []
                      }
                    ],
                    "splitMethod": "way of bill",
                    "expenseTracker": [
                      {
                        "id": 1533986760961,
                        "amount": 0
                      },
                      {
                        "id": 1533986795222,
                        "amount": 0
                      },
                      {
                        "id": 1533986800000,
                        "amount": 0
                      },
                      {
                        "id": 1533986805110,
                        "amount": 0
                      }
                    ],
                    "expenseItems": [
                      {
                        "id": 1533987124917,
                        "description": "Champagne",
                        "price": "4500000",
                        "assignedTo": [
                          {
                            "id": 1533986760961
                          },
                          {
                            "id": 1533986795222
                          },
                          {
                            "id": 1533986800000
                          },
                          {
                            "id": 1533986805110
                          }
                        ]
                      },
                      {
                        "id": 1533987139017,
                        "description": "Entertainment",
                        "price": "41000000",
                        "assignedTo": [
                          {
                            "id": 1533986795222
                          },
                          {
                            "id": 1533986800000
                          },
                          {
                            "id": 1533986805110
                          }
                        ]
                      },
                      {
                        "id": 1533987146529,
                        "description": "Bugs",
                        "price": "100000",
                        "assignedTo": [
                          {
                            "id": 1533986760961
                          }
                        ]
                      }
                    ]
                  }
                ],
                "displayCurrency": {
                  "code": "TZS",
                  "symbol": "Sh"
                },
                "rates": []
              },
              {
                "id": 1533987177806,
                "name": "Las Vegas",
                "country": "USA",
                "year": 2018,
                "currencies": [
                  {
                    "code": "EUR",
                    "symbol": "€"
                  },
                  {
                    "code": "USD",
                    "symbol": "$"
                  }
                ],
                "participants": [
                  {
                    "id": 1533986760961,
                    "firstname": "admin",
                    "lastname": "(ME)",
                    "due": 4203750,
                    "receives": 47850000,
                    "transfers": []
                  },
                  {
                    "id": 1533986795222,
                    "firstname": "Bart",
                    "lastname": "Certyn",
                    "due": 20708333.34,
                    "receives": 3686250,
                    "transfers": []
                  },
                  {
                    "id": 1533986800000,
                    "firstname": "Steven",
                    "lastname": "Ghekiere",
                    "due": 16420416.67,
                    "receives": 12383333.33,
                    "transfers": []
                  },
                  {
                    "id": 1533986805110,
                    "firstname": "Brecht",
                    "lastname": "Theys",
                    "due": 22587083.34,
                    "receives": 0,
                    "transfers": []
                  }
                ],
                "expenses": [
                  {
                    "description": "Caesars Palace",
                    "category": "Overnight",
                    "totalPrice": "15000",
                    "currency": {
                      "code": "USD",
                      "symbol": "$"
                    },
                    "originalCurrency": {
                      "code": "USD",
                      "symbol": "$"
                    },
                    "date": "2018-08-15T11:33:04.632Z",
                    "paidBy": [
                      {
                        "id": 1533986795222,
                        "amount": "15000"
                      }
                    ],
                    "participants": [
                      {
                        "id": 1533986760961,
                        "firstname": "admin",
                        "lastname": "(ME)",
                        "due": 3750,
                        "receives": 0,
                        "transfers": []
                      },
                      {
                        "id": 1533986795222,
                        "firstname": "Bart",
                        "lastname": "Certyn",
                        "due": 0,
                        "receives": 11250,
                        "transfers": []
                      },
                      {
                        "id": 1533986800000,
                        "firstname": "Steven",
                        "lastname": "Ghekiere",
                        "due": 3750,
                        "receives": 0,
                        "transfers": []
                      },
                      {
                        "id": 1533986805110,
                        "firstname": "Brecht",
                        "lastname": "Theys",
                        "due": 3750,
                        "receives": 0,
                        "transfers": []
                      }
                    ],
                    "splitMethod": "divided evenly",
                    "expenseTracker": [
                      {
                        "id": 1533986760961,
                        "amount": 0
                      },
                      {
                        "id": 1533986795222,
                        "amount": 0
                      },
                      {
                        "id": 1533986800000,
                        "amount": 0
                      },
                      {
                        "id": 1533986805110,
                        "amount": 0
                      }
                    ],
                    "expenseItems": []
                  },
                  {
                    "description": "Casino",
                    "category": "Activities",
                    "totalPrice": "350000",
                    "currency": {
                      "code": "USD",
                      "symbol": "$"
                    },
                    "originalCurrency": {
                      "code": "USD",
                      "symbol": "$"
                    },
                    "date": "2018-08-19T11:33:29.743Z",
                    "paidBy": [
                      {
                        "id": 1533986760961,
                        "amount": "50000"
                      },
                      {
                        "id": 1533986795222,
                        "amount": "300000"
                      }
                    ],
                    "participants": [
                      {
                        "id": 1533986760961,
                        "firstname": "admin",
                        "lastname": "(ME)",
                        "due": 0,
                        "receives": 25000,
                        "transfers": [],
                        "expenseCost": "25000"
                      },
                      {
                        "id": 1533986795222,
                        "firstname": "Bart",
                        "lastname": "Certyn",
                        "due": 0,
                        "receives": 225000,
                        "transfers": [],
                        "expenseCost": "75000"
                      },
                      {
                        "id": 1533986800000,
                        "firstname": "Steven",
                        "lastname": "Ghekiere",
                        "due": "125000",
                        "receives": 0,
                        "transfers": [],
                        "expenseCost": "125000"
                      },
                      {
                        "id": 1533986805110,
                        "firstname": "Brecht",
                        "lastname": "Theys",
                        "due": "125000",
                        "receives": 0,
                        "transfers": [],
                        "expenseCost": "125000"
                      }
                    ],
                    "splitMethod": "own share",
                    "expenseTracker": [
                      {
                        "id": 1533986760961,
                        "amount": "25000"
                      },
                      {
                        "id": 1533986795222,
                        "amount": "75000"
                      },
                      {
                        "id": 1533986800000,
                        "amount": "125000"
                      },
                      {
                        "id": 1533986805110,
                        "amount": "125000"
                      }
                    ],
                    "expenseItems": []
                  }
                ],
                "displayCurrency": {
                  "code": "USD",
                  "symbol": "$"
                },
                "rates": [
                  {
                    "from": {
                      "code": "EUR",
                      "symbol": "€"
                    },
                    "to": {
                      "code": "USD",
                      "symbol": "$"
                    },
                    "multiplier": 1.14225
                  },
                  {
                    "from": {
                      "code": "USD",
                      "symbol": "$"
                    },
                    "to": {
                      "code": "EUR",
                      "symbol": "€"
                    },
                    "multiplier": 0.875465
                  }
                ]
              }
            ],
            "contacts": [
              {
                "id": 1533986760961,
                "firstname": "admin",
                "lastname": "(ME)",
                "due": 4204194,
                "receives": 47850150,
                "transfers": [
                  {
                    "from": 1533986760961,
                    "to": 1533986795222,
                    "amount": "444",
                    "currency": {
                      "code": "EUR",
                      "symbol": "€"
                    },
                    "date": "2018-08-11"
                  }
                ]
              },
              {
                "id": 1533986795222,
                "firstname": "Bart",
                "lastname": "Certyn",
                "due": 20754427.34,
                "receives": 3687444,
                "transfers": [
                  {
                    "from": 1533986795222,
                    "to": 1533986805110,
                    "amount": "150",
                    "currency": {
                      "code": "EUR",
                      "symbol": "€"
                    },
                    "date": "2018-08-11"
                  },
                  {
                    "from": 1533986795222,
                    "to": 1533986805110,
                    "amount": "44444",
                    "currency": {
                      "code": "EUR",
                      "symbol": "€"
                    },
                    "date": "2018-08-11"
                  },
                  {
                    "from": 1533986795222,
                    "to": 1533986800000,
                    "amount": "1500",
                    "currency": {
                      "code": "EUR",
                      "symbol": "€"
                    },
                    "date": "2018-08-11"
                  }
                ]
              },
              {
                "id": 1533986800000,
                "firstname": "Steven",
                "lastname": "Ghekiere",
                "due": 16421982.67,
                "receives": 12384833.33,
                "transfers": [
                  {
                    "from": 1533986800000,
                    "to": 1533986795222,
                    "amount": "750",
                    "currency": {
                      "code": "EUR",
                      "symbol": "€"
                    },
                    "date": "2018-08-09"
                  },
                  {
                    "from": 1533986800000,
                    "to": 1533986760961,
                    "amount": "150",
                    "currency": {
                      "code": "EUR",
                      "symbol": "€"
                    },
                    "date": "2018-08-11"
                  },
                  {
                    "from": 1533986800000,
                    "to": 1533986805110,
                    "amount": "666",
                    "currency": {
                      "code": "EUR",
                      "symbol": "€"
                    },
                    "date": "2018-08-16"
                  }
                ]
              },
              {
                "id": 1533986805110,
                "firstname": "Brecht",
                "lastname": "Theys",
                "due": 22587083.34,
                "receives": 45260,
                "transfers": []
              }
            ],
            "rates": [],
            "globalCurrency": {
              "code": "EUR",
              "symbol": "€"
            }
          },
          {
            "username": "test user",
            "password": "tests",
            "trips": [],
            "contacts": [
              {
                "id": 1533986785419,
                "firstname": "test user",
                "lastname": "(ME)",
                "due": 0,
                "receives": 0,
                "transfers": []
              }
            ],
            "rates": [],
            "globalCurrency": {
              "code": "EUR",
              "symbol": "€"
            }
          }
        ];
      await this.storage.set(storageName, array);
    }
  }

  // async await to deal with the fact that it is asynchronous and we really need the result in order to proceed with login
  loginVerification(username: string, password: string) {

    // default return is false
    let access = false;
    return this.storage.get("users").then(data => {
      // creating temp array in order to iterate over it to find out if password and username
      // combination are correct
      let users: User[] = [];
      users = data;
      users.forEach(user => {
        if (user.username == username && user.password == password) {
          access = true;
        }
      });
      return access;
    })
  }

  // registering a User
  // if a user tries to register with a username that is already in the "database" we will return false
  // else the user is being added to storage
  // if it's false we will prompt a message on  the registration page
  async registerUser(credentials) {
    let validRegistration = true;
    return await this.storage.get("users").then(data => {
      let users: User[] = [];
      users = data;
      users.forEach(user => {
        if (user.username == credentials.username) {
          validRegistration = false
        }
      });

      if (validRegistration) {

        let tmpUser: User = new User(credentials.username, credentials.password);
        tmpUser.contacts.push(new Contact(credentials.username, "(ME)", 0, 0));
        users.push(tmpUser);

        this.storage.set("users", users);
      }

      return validRegistration;
    })
  }

  /**
   * 
   * function that will get a specific user from the storage
   * used to set the session with this returned value
   * 
   * @param username the username we want to find (they are all unique)
   * 
   * @returns the found user
   */
  getSpecificUser(username: string) {

    let user: User;
    let users: User[] = [];

    return this.storage.get("users").then(resp => {
      users = resp;
      users.forEach(data => {
        let tmpUser: User = data;
        if (tmpUser.username == username) {
          user = data;
        } else {
          // IDLE
        }
      })
      return user;
    })
  }

  // setting user sessoin
  async setUserSession(username: string) {
    console.log("going to set session for: " + username);
    await this.storage.set("session", username);
  }

  async getUserSession() {
    console.log(this.storage.get("users"));
    return await this.storage.get("session").then((username) => {
      return username;
    })
  }

  // clearing user session
  clearUserSession() {
    this.storage.remove("session");
  }

  // returns the storage so we can access it wherever we need
  getStorage() {
    return this.storage;
  }
}
