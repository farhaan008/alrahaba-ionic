import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { TabsPage } from '../tabs/tabs';
import { Http, Headers, RequestOptions, Response } from '@angular/http';

import { LanguageService } from '../../providers/masarat-service/Language.service';
import { MasaratServiceProvider } from '../../providers/masarat-service/masarat-service';

@Component({
  selector: 'page-setting',
  templateUrl: 'setting.html',
})
export class SettingPage {
  switchLanguage: string;
  isEng: boolean=false;
  setDirection: string;
  ElementsTextsContent: any[] = [];
  constructor(public navCtrl: NavController, public navParams: NavParams,
    public _LanguageService:LanguageService) {
      this.switchLanguage=localStorage.getItem('lang');
      if( this.switchLanguage=='eng'){
        this.setDirection='ltr';
          this.isEng=true;
      }else{
          this.isEng=false;
          this.setDirection='rtl';
      }
  }
 
  ionViewDidEnter() {
   
  }
  
  languageChange(key){
    this.isEng=! this.isEng;
    if(this.isEng){
      this.setDirection='ltr';
    }else{   this.setDirection='rtl';}
    localStorage.setItem('lang',key);
    }
  
  ionViewDidLoad() {
    console.log('ionViewDidLoad SettingPage');
  }
}
