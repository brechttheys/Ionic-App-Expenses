//import { HttpClient } from '@angular/common/http';
import { Http } from '@angular/http';
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';


export class Currency {
  public code: string;
  public symbol: string;

  constructor(code: string, symbol: string) {
    this.code = code;
    this.symbol = symbol;
  }
}



@Injectable()
export class RestProvider {

  constructor(public http: Http) {
    console.log('Hello RestProvider Provider');
  }


  getAllCurrencies() {
    var url = 'https://restcountries.eu/rest/v2/all';
    var response = this.http.get(url).map(res => res.json());
    return response;
  }

  getCurrencies(country: string) {
    var url = 'https://restcountries.eu/rest/v2/name/' + encodeURI(country) + '?fullText=true';
    var response = this.http.get(url).map(res => res.json());
    return response;
  }

  // https://free.currencyconverterapi.com/
  // example call
  // : http://free.currencyconverterapi.com/api/v3/convert?q=USD_PHP&compact=ultra 
  getCurrencyRate(from: string, to: string) {
    var url = 'http://free.currencyconverterapi.com/api/v3/convert?q=' + encodeURI(from) + '_' + encodeURI(to) + '&compact=ultra ';
    var response = this.http.get(url).map(res => res.json());
    return response;
  }
}
