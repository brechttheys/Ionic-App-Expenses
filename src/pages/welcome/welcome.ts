import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController } from 'ionic-angular';
import { LoginPage } from '../login/login';
import { RegisterPage } from '../register/register';
import { AuthProvider } from '../../providers/auth/auth';
import { TabsPage } from '../tabs/tabs';

@Component({
  selector: 'page-welcome',
  templateUrl: 'welcome.html',
})
export class WelcomePage {

  constructor(public navCtrl: NavController, public navParams: NavParams, public authProvider: AuthProvider, public loadingCtrl: LoadingController) {}

  presentLoadingIos() {
    let loading = this.loadingCtrl.create({
      spinner: 'ios',
      content: 'Restoring last user session',
      duration: 1500
    });

    loading.present();
  }


  ionViewCanEnter() {
    // if a sessions is already set and a user did not logout, resume application with the current user session
    this.authProvider.getStorage().get("session").then(resp => {
      if (resp) {
        this.navCtrl.push(TabsPage);
      }
    })
  }

  login() {
    this.navCtrl.push(LoginPage);
  }

  register() {
    this.navCtrl.push(RegisterPage)
  }

}
