import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { TabsPage } from '../tabs/tabs';
import { AuthProvider } from '../../providers/auth/auth';
import { User } from '../../providers/auth/auth';

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams, 
    public authProvider: AuthProvider,
    public alertCtrl: AlertController
  ) {}

  ionViewDidLoad() {
    console.log('ionViewDidLoad Login');
  }

  // getting the access "token" from our authProvider
  // if it's false we present an alert message box
  async login(username: string, password: string) {
    let user : User;
    // we will chain differnt async calls together
    this.authProvider.loginVerification(username, password).then(resp =>{
      console.log("response in login: " + resp);
      let access = resp;
      if(access){
        this.authProvider.getSpecificUser(username).then(resp => {
          user = resp;
        }).then(() => {
          this.authProvider.setUserSession(user.username);''
        }).then(() => {
          this.navCtrl.push(TabsPage);
        })
      } else {
        let alert = this.alertCtrl.create({
          title: 'Invalid username or password',
          subTitle: 'Please try again',
          buttons: ['Ok']
        });
        alert.present();
      }
    }) 
  }
}
