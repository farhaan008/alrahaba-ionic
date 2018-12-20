import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { AboutPage } from '../pages/about/about';
import { ContactPage } from '../pages/contact/contact';
import { HomePage } from '../pages/home/home';
import { TabsPage } from '../pages/tabs/tabs';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { LoginPage } from '../pages/login/login';
import { MasaratServiceProvider } from '../providers/masarat-service/masarat-service';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { HttpModule } from '@angular/http';
import { Geolocation } from '@ionic-native/geolocation';
import { Diagnostic } from '@ionic-native/diagnostic';
import { HomepagePage } from '../pages/homepage/homepage';
import { LanguageService } from '../providers/masarat-service/Language.service';
import { TranslateModule} from '@ngx-translate/core';
import { TranslateLoader} from '@ngx-translate/core';
import { TranslateHttpLoader} from '@ngx-translate/http-loader';
import { ConnectivityProvider } from '../providers/connectivity/connectivity';
import { MapsPage } from '../pages/maps/maps';
import { RepsLocationPage } from '../pages/reps-location/reps-location';
import { BusLocationPage } from '../pages/bus-location/bus-location';
import { NativeGeocoder } from '@ionic-native/native-geocoder';
import { GoogleMaps, GoogleMap } from '@ionic-native/google-maps';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { SettingPage } from '../pages/setting/setting';
import { DriverpopupPage } from '../pages/driverpopup/driverpopup';



export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    MyApp,AboutPage,ContactPage, HomePage, LoginPage, HomepagePage,DriverpopupPage,
    TabsPage,MapsPage,RepsLocationPage,BusLocationPage,SettingPage
  ],
  imports: [
    BrowserModule,HttpModule,    HttpClientModule,FormsModule,
    TranslateModule.forRoot({
      loader: {
          provide: TranslateLoader,
          useFactory: (createTranslateLoader),
          deps: [HttpClient]
      }
  }),
    IonicModule.forRoot(MyApp,{tabsPlacement: 'top'})
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,AboutPage,ContactPage,HomepagePage,LoginPage,SettingPage,
    HomePage,TabsPage,MapsPage,RepsLocationPage,BusLocationPage,DriverpopupPage
  ],
  providers: [
    StatusBar,GoogleMaps,LanguageService,ConnectivityProvider,TabsPage,MasaratServiceProvider,
    SplashScreen,HttpClient,Geolocation,Diagnostic,NativeGeocoder,DatePipe,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    ConnectivityProvider
    
  ]
})
export class AppModule {}
