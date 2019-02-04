import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { WelcomePage } from '../welcome/welcome';
import { AuthProvider } from '../../providers/auth/auth';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastController } from '../../../node_modules/ionic-angular';

@IonicPage()
@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
})
export class RegisterPage {
  form: FormGroup;
  submitAttempt: boolean;
  passwordsError: boolean;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public authProvider: AuthProvider,
    public alertCtrl: AlertController,
    public formBuilder: FormBuilder,
    public toastCtrl: ToastController) {

    this.form = formBuilder.group({
      username: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(20)]],
      password: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(20)]],
      password2: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(20)]]
    })
    this.submitAttempt = false;
    this.passwordsError = false;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RegisterPage');
  }

  checkValidPasswords() {
    console.log("passwordsError false");
    this.passwordsError = false;
  }

  // again making use of the async and await keywords
  async register(username: string, password: string) {
    if (!this.form.valid) {
        this.submitAttempt = true;
    }
    else {
      let { username, password, password2 } = this.form.controls;
      console.log(password.value + ' ' + password2.value)
      if (password.value !== password2.value) {
        this.passwordsError = true;
        console.log('passwords do not match')
      } else {
        console.log('passwords do match')
        let credentials = {
          username: username.value,
          password: password.value
        };

        let valid = await this.authProvider.registerUser(credentials);

        // if registration was successful, push to welcomepage so that user can login
        // else present an alert box saying that username already exists or that something else went wrong
        if (valid) {
          this.navCtrl.push(WelcomePage).then(() => {
            let toast = this.toastCtrl.create({
              message: 'Registered succesfully!',
              duration: 3000,
              position: 'bottom',
              showCloseButton: true
            });
            toast.present();
          });


        } else {
          let alert = this.alertCtrl.create({
            title: 'Username already exists',
            subTitle: 'Please choose a different username',
            buttons: ['Ok']
          });
          alert.present();

        }
      }
    }
  }
}
