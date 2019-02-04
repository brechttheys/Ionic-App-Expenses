import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

import { TripsOverviewPage } from '../pages/trips-overview/trips-overview';
import { TransferOverviewPage } from '../pages/transfer-overview/transfer-overview';
import { TabsPage } from '../pages/tabs/tabs';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { LoginPage } from '../pages/login/login';
import { RegisterPage } from '../pages/register/register';
import { ConfigPage } from '../pages/config/config';

import { WelcomePage } from '../pages/welcome/welcome';

import { IonicStorageModule } from '@ionic/storage';
import { AuthProvider } from '../providers/auth/auth';
import { TripsProvider } from '../providers/trips/trips';
import { TripsAddPage } from '../pages/trips-add/trips-add';
import { RestProvider } from '../providers/rest/rest';
import { HttpClientModule } from '@angular/common/http';
import { HttpModule } from '@angular/http';
import { ContactExpensesOverviewPage } from '../pages/contact-expenses-overview/contact-expenses-overview';
import { ContactsProvider } from '../providers/contacts/contacts';
import { ContactsOverviewPage } from '../pages/contacts-overview/contacts-overview';
import { ContactsAddPage } from '../pages/contacts-add/contacts-add';
import { ExpensesProvider } from '../providers/expenses/expenses';
import { ExpensesCategoryOverviewPage } from '../pages/expenses-category-overview/expenses-category-overview';
import { ExpensesCategoryDetailsPage } from '../pages/expenses-category-details/expenses-category-details';
import { ExpensesAddPage } from '../pages/expenses-add/expenses-add';
import { TransfersAddPage } from '../pages/transfers-add/transfers-add';
import { TransfersProvider } from '../providers/transfers/transfer';
import { ExpensesAddSplitMethodPage } from '../pages/expenses-add-split-method/expenses-add-split-method';
import { RatesProvider } from '../providers/rates/rates';
import { TripConfigPage } from '../pages/trip-config/trip-config';
import { TripRateProvider } from '../providers/trip-rate/trip-rate';
import { TripsAddDisplayCurrencyPage } from '../pages/trips-add-display-currency/trips-add-display-currency';
import { TripChangeRatesPage } from '../pages/trip-change-rates/trip-change-rates';
import { ExpenseDetailsPage } from '../pages/expense-details/expense-details';

@NgModule({
  declarations: [
    MyApp,
    TripsOverviewPage,
    ContactExpensesOverviewPage,
    ContactsOverviewPage,
    TransferOverviewPage,
    TabsPage,
    LoginPage,
    RegisterPage,
    ConfigPage,
    WelcomePage,
    TripsAddPage,
    ContactsOverviewPage,
    ContactsAddPage,
    ExpensesCategoryOverviewPage,
    ExpensesCategoryDetailsPage,
    ExpensesAddPage,
    TransfersAddPage,
    ExpensesAddSplitMethodPage,
    TripConfigPage,
    TripsAddDisplayCurrencyPage,
    TripChangeRatesPage,
    ExpenseDetailsPage
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    HttpModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot({
      driverOrder: ['localstorage']
    }),
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    TripsOverviewPage,
    ContactExpensesOverviewPage,
    ContactsOverviewPage,
    TransferOverviewPage,
    TabsPage,
    LoginPage,
    RegisterPage,
    ConfigPage,
    WelcomePage,
    TripsAddPage,
    ContactsOverviewPage,
    ContactsAddPage,
    ExpensesCategoryOverviewPage,
    ExpensesCategoryDetailsPage,
    ExpensesAddPage,
    TransfersAddPage,
    ExpensesAddSplitMethodPage,
    TripConfigPage,
    TripsAddDisplayCurrencyPage,
    TripChangeRatesPage,
    ExpenseDetailsPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    AuthProvider,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    TripsProvider,
    RestProvider,
    ContactsProvider,
    ExpensesProvider,
    TransfersProvider,
    RatesProvider,
    TripRateProvider
  ]
})
export class AppModule { }
