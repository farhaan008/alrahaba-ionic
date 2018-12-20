import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { TabsPage } from '../tabs/tabs';
import { FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import { MasaratServiceProvider } from '../../providers/masarat-service/masarat-service';
import { Geolocation } from '@ionic-native/geolocation';
import { TranslateService } from '@ngx-translate/core';
import { LanguageService } from '../../providers/masarat-service/Language.service';


@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
  providers:[LanguageService]
})
export class LoginPage {
  rootPage: any;
  busy: any;
  form: FormGroup;
  username: any;
  password: any;
  data: string;
  gavLocation = [{ name: 'herwad acc', lat: 16.6646, lng: 74.57495 },
  { name: ' herwad petrol accuracy', lat: 16.6555572, lng: 74.5665 },
  { name: 'darga accuracy', lat: 16.659353, lng: 74.569157 },
  { name: ' office', lat: 21.517080, lng: 39.183231 },
  { name: 'flat', lat: 21.520036, lng: 39.183750 },
  { name: 'mosque ', lat: 21.521415, lng: 39.183089 },
  { name: 'terwad accuracy ', lat: 16.665593, lng: 74.574939 },]


  buttonColor: string = '	#FFFFFF';
  buttonColorArabic: string = '#008000';
  lat: number = 0; long: number = 0;
  is_rtl: boolean;
  is_ltr: boolean;

  task: number;
  constructor(public navCtrl: NavController,
    private geolocation: Geolocation,
    private _http: MasaratServiceProvider,
    public loadingCtrl: LoadingController,
    public translate: TranslateService,
    public _LanguageService:LanguageService,
    private fb: FormBuilder, public navParams: NavParams) {
    this._LanguageService.GetLanguageContent()
    this.form = fb.group({
      Username: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required),
    });
    let login = localStorage.getItem('Login');
    if (login == "Login Success") {
      this.navCtrl.setRoot(TabsPage);
    }
    this.is_rtl = true;
    this.is_ltr = false;
    var templang = localStorage.getItem('lang')
    if (templang == undefined || templang == "null") {
      translate.setDefaultLang('en');
      this.switchLanguage('en')
    } else {
      this.switchLanguage(templang)
    }
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
    // this.task = setInterval(() => {
    //     this.getgeolocation();
    //   console.log('works....');
    // }, 5000);
  }
  login() {
    localStorage.setItem('lat',null);
    let loginRequest: LoginRequest = {
      Username: this.form.value.Username,
      Password: this.form.value.password
    };
    let loading = this.loadingCtrl.create({ content: "Logging in ,please wait..." });
    loading.present();
    this._http.httppostforlogin('api/Auth/auth', loginRequest)
      .then(data => {
        let message = JSON.parse(data['_body']);
        if (message.message == "Login Success") {
          loading.dismissAll();
          localStorage.setItem('Login', message.message);
          localStorage.setItem('userId', message.userAuth.data.userId);
          this.navCtrl.setRoot(TabsPage);
          this.afterLocationlogin(message.message);
        } else {
          loading.dismissAll();
          alert(" Userid or Password wrong")
        }
      });
  }
  getgeolocation() {
    let options = { timeout: 20000, enableHighAccuracy: true };
    this.geolocation.getCurrentPosition(options).then((resp) => {
      this.lat = resp.coords.latitude
      this.long = resp.coords.longitude
      var lat1 = resp.coords.latitude
      var lng2 = resp.coords.longitude
      this.gavLocation.forEach(a => {
        var earth = 6378.137,
          pi = Math.PI,
          m = (1 / ((2 * pi / 360) * earth)) / 1000;
        var maxLat = a.lat + (40 * m);
        var minLat = a.lat + (-30 * m);
        var earth = 6378.137,
          pi = Math.PI,
          cos = Math.cos,
          m = (1 / ((2 * pi / 360) * earth)) / 1000;
        var maxLong = a.lng + (40 * m) / cos(a.lat * (pi / 180));
        var minLong = a.lng + (-30 * m) / cos(a.lat * (pi / 180));
        if (lat1 >= minLat && lat1 <= maxLat && lng2 >= minLong && lng2 <= maxLong) {
          console.log('same loaction');
          alert("Success");
          alert(a.name);
          // alert(' current ' + this.lat + ' lat' + this.long + ' long' + 'newlatlog ' + maxLat + ' new_latitude ' + maxLong + "new_longitude " + '   array data ' + a.lat + 'a.lat' + a.lng + 'a.long ' + a.name);
          var date = new Date().toISOString();
          console.log(date);
          alert(date);
        }
      });
    }).catch((error) => {
      console.log('Error getting location', error);
    });
  }
          
  afterLocationlogin(message) {
    let options = { timeout: 10000, enableHighAccuracy: true };
    this.geolocation.getCurrentPosition(options).then((resp) => {
      this.lat = resp.coords.latitude
      this.long = resp.coords.longitude

      if (this.lat == 0) {
        alert("please allow to location");
      } else {
        if (message == "Login Success") {
          this.navCtrl.setRoot(TabsPage);
        }
      }
    }).catch((error) => {
      console.log('Error getting location', error);
    });
  }
  changelanguage() {
    this.buttonColor = '#008000';
    this.buttonColorArabic = '	#FFFFFF'
  }
  switchLanguage(language: string) {
    if (language == 'ar') {
      localStorage.setItem('lang', language); this.is_rtl = true; this.is_ltr = false; this.translate.use(language); this.buttonColorArabic = '#008000'; this.buttonColor = '#FFFFFF';
    }
    else {
      localStorage.setItem('lang', language);
      this.is_rtl = false; this.is_ltr = true; this.translate.use(language); this.buttonColor = '#008000'; this.buttonColorArabic = '	#FFFFFF'
    }

  }

}
interface LoginRequest {
  Username: string,
  Password: string,
}
enum LoginResultOptions {
  Sucess = 1,
  InvalidUsernameOrPassword = 2,
  Pending = 3,
  Deactive = 4,
  DuplicatedAuthInfo = 5,
  EnterEmailandPhone = 6
}



// http://coreapi.itrahaba.com/api/TransportMovements/GetAllDrivers/12325
// http://coreapi.itrahaba.com/api/TransportMovements/GetAllDrivers/12318