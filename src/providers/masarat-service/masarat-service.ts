import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions,  } from '@angular/http';
import {  HttpHeaders } from "@angular/common/http";
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
@Injectable()
export class MasaratServiceProvider {
  private _options = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
  BaseUrl = 'http://coreapi.umraline.com/';
  httpRequestOptions: RequestOptions;
  httpheader: Headers;
  private tempValue = new BehaviorSubject(<String>('tempValue'))
  public Selectedlang = this.tempValue.asObservable();
  
changeD(message:string){
  this.tempValue.next(message);
}
  constructor(public http: Http) {
    this.httpheader = new Headers({ 'Content-Type': 'application/json' });
     this.httpRequestOptions = new RequestOptions({ headers: this.httpheader });
  }

  httppostforlogin(url: string, data: any) {
    let headers: any = new HttpHeaders({ 'Content-Type': 'application/json' });
    return new Promise((resolve, reject) => {
      this.http.post(this.BaseUrl + url, data, headers).subscribe(data => {
        resolve(data);}, err => { reject(err);
      });
    });
  }
  httpGetRequest_Core(url: string) {
    return new Promise((resolve, reject) => {
      this.http.get(this.BaseUrl + url).subscribe(data => {
        resolve(data); 
      }, err => {  reject(err);
      });
    });
  }
  httpputRequest_Core(url: string, data: any) {
    let headers: any = new HttpHeaders({ 'Content-Type': 'application/json' });
    return new Promise((resolve, reject) => {
      this.http.put(this.BaseUrl + url, data, headers).subscribe(data => {
        resolve(data);}, err => { reject(err);
      });
    });
  }
}
