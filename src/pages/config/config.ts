import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, App } from 'ionic-angular';
import { Currency, RestProvider } from '../../providers/rest/rest';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Rate, RatesProvider } from '../../providers/rates/rates';
import { AuthProvider, User } from '../../providers/auth/auth';
import { ToastController } from '../../../node_modules/ionic-angular';

/**
 * Generated class for the ConfigPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-config',
  templateUrl: 'config.html',
})
export class ConfigPage {
  currencies: Currency[];
  selectedGlobalCurrency: Currency;
  rates: Rate[];
  user: User;

  form: FormGroup;
  submitAttempt: boolean;
  samePasswordsError: boolean;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public restProvider: RestProvider,
    public formBuilder: FormBuilder,
    public ratesProvider: RatesProvider,
    public app: App,
    public authProvider: AuthProvider,
    public toastCtrl: ToastController) {
    this.form = formBuilder.group({
      firstPassword: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(20)]],
      secondPassword: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(20)]]
    });
    this.submitAttempt = false;
    this.samePasswordsError = false;
    this.selectedGlobalCurrency = new Currency("","");
  }

  logout() {
    this.authProvider.clearUserSession();
    const root = this.app.getRootNav();
    root.popToRoot();
  }

  ionViewWillEnter() {
    let username;
    let tmpUsers: User[];
    let tmpUser: User;

    this.authProvider.getUserSession().then(usernameElement => {
      username = usernameElement;
    }).then(() => {
      this.authProvider.getStorage().get("users").then(users => {
        tmpUsers = users;
        tmpUsers.forEach(userElement => {
          tmpUser = userElement;
          if (tmpUser.username == username) {
            this.user = tmpUser;
            this.selectedGlobalCurrency = JSON.parse(JSON.stringify(this.user.globalCurrency));
          }
        });
      })
    })

    this.getAllRates();
    this.restProvider.getAllCurrencies().subscribe(element => {
      let tmpArray: any[] = element;
      let tmpCurrencies: Currency[] = [];
      tmpArray.forEach(element1 => {
        element1.currencies.forEach(element2 => {
          if (element2.code != null && element2.code != undefined && element2.code != '(none)') {
            tmpCurrencies.push(new Currency(element2.code, element2.symbol));
          }
        });
      });
      // problem is that the objects you get returned from the rest have different "name" values
      // you have things like "United State dollar, United States Dollar, United state dollar,..."
      // which causes it to be interpreted as a different object and thus resulting in being added multiple times
      var uniqueCurrencies = new Set();
      tmpCurrencies.forEach(e =>
        uniqueCurrencies.add(JSON.stringify(e))
      );
      this.currencies = Array.from(uniqueCurrencies).map(e => JSON.parse(e));
    });
  }

  getAllRates() {
    this.ratesProvider.getRates().then(result => this.rates = result);
  }

  changeGlobalCurrency() {
    if (this.selectedGlobalCurrency) {
      console.log('Setting new global currency! =' + this.selectedGlobalCurrency.code);
      let username;
      let tmpUsers: User[];
      let tmpUser: User;

      this.currencies.forEach(currElement =>{
        if(currElement.code === this.selectedGlobalCurrency.code){
          this.selectedGlobalCurrency = currElement;
        }
      })

      this.authProvider.getUserSession().then(usernameElement => {
        username = usernameElement;
      }).then(() => {
        this.authProvider.getStorage().get("users").then(users => {
          tmpUsers = users;
          tmpUsers.forEach(userElement => {
            tmpUser = userElement;
            if (tmpUser.username == username) {
              this.user = tmpUser;
              this.user.globalCurrency = this.selectedGlobalCurrency;
            }
          });
        }).then(() => {
          this.authProvider.getStorage().set('users', tmpUsers).then(() => {
            let toast = this.toastCtrl.create({
              message: 'Changed new global currency to ' + this.selectedGlobalCurrency.code + '!',
              duration: 3000,
              position: 'bottom',
              showCloseButton: true
            });
            toast.present();
          });
        })
      })
    } else {
      let toast = this.toastCtrl.create({
        message: 'No currency selected!',
        duration: 3000,
        position: 'bottom',
        showCloseButton: true
      });
      toast.present();
    }
  }

  changePassword() {
    if (!this.form.valid) {
      this.submitAttempt = true;
    } else {

      if (this.form.controls.firstPassword.value !== this.form.controls.secondPassword.value) {
        this.samePasswordsError = true;
      } else {
        console.log('Setting new password! =' + this.form.controls.firstPassword.value);
        let username;
        let tmpUsers: User[];
        let tmpUser: User;

        this.authProvider.getUserSession().then(usernameElement => {
          username = usernameElement;
        }).then(() => {
          this.authProvider.getStorage().get("users").then(users => {
            tmpUsers = users;
            tmpUsers.forEach(userElement => {
              tmpUser = userElement;
              if (tmpUser.username == username) {
                tmpUser.password = this.form.controls.firstPassword.value;
              }
            });
          }).then(() => {
            this.authProvider.getStorage().set('users', tmpUsers).then(() => {
              let toast = this.toastCtrl.create({
                message: 'Succesfully changed your password!',
                duration: 3000,
                position: 'bottom',
                showCloseButton: true
              });
              toast.present();
            });
          })
        })
      }
    }
  }

}