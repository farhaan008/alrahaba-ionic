import { Component } from '@angular/core';
import { HomepagePage } from '../homepage/homepage';
import { MapsPage } from '../maps/maps';
import { RepsLocationPage } from '../reps-location/reps-location';
import { BusLocationPage } from '../bus-location/bus-location';
import { MasaratServiceProvider } from '../../providers/masarat-service/masarat-service';
import { NavController } from 'ionic-angular';
import { LoginPage } from '../login/login';
import { ContactPage } from '../contact/contact';
import { SettingPage } from '../setting/setting';
import { LanguageService } from '../../providers/masarat-service/Language.service';

@Component({
  selector: 'page-tabs',
  templateUrl: 'tabs.html'
})
export class TabsPage {
  tab1Root = SettingPage;
  tab2Root = MapsPage;
  tab3Root = RepsLocationPage;
  tab4Root = BusLocationPage;
  langugeKey: any;
  isUo: boolean = false;
  isEa: boolean = false;
  isTo: boolean = false;
  setDirection: any;
  resp_Tab: boolean = true;

  constructor(public navCtrl: NavController, private _http: MasaratServiceProvider, public _LanguageService: LanguageService, ) {
    this._LanguageService.GetLanguageContent();
    this.getUserType(localStorage.getItem('userId'))

  }

  directiveChange() {
    this.langugeKey = localStorage.getItem('lang');
    if (this.langugeKey != undefined || this.langugeKey != null) {
      if (this.langugeKey == 'ar') {
        this.setDirection = 'rtl';
      } else {
        this.setDirection = 'ltr';
      }
    }
  }

  getUserType(userUd) {
    this._http.httpGetRequest_Core('api/Auth/User_Login_PartiesInfo_OldId/' + userUd).then(data => {
      let isUser = JSON.parse(data['_body']);
      this.isUo = isUser.uOs.length ? true : false;
      this.isEa = isUser.eAs.length ? true : false;
      this.isTo = isUser.tOs.length ? true : false;
      if (this.isUo) {
        this.resp_Tab = true;
      } else {
        this.resp_Tab = false;
      }
    });
  }

  logout() {
    localStorage.clear();
    this.navCtrl.setRoot(LoginPage)
  }
}
