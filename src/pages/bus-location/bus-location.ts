import { Component } from '@angular/core';
import { NavController, NavParams, ModalController, AlertController, Events } from 'ionic-angular';
import { MapsPage } from '../maps/maps';
import { MasaratServiceProvider } from '../../providers/masarat-service/masarat-service';
import { DatePipe } from '@angular/common';
import { LanguageService } from '../../providers/masarat-service/Language.service';
import { DriverpopupPage } from '../driverpopup/driverpopup';
@Component({
    selector: 'page-bus-location',
    templateUrl: 'bus-location.html',
    providers: [MapsPage]
})
export class BusLocationPage {
    tempLocation = [{ id: 1, name: 'IT-Office', date: "11-11-2018", lat: 21.517080, lng: 39.183231 },
    { id: 2, name: 'Head-Office', date: "12-11-2018", lat: 21.577827, lng: 39.167093 },
    { id: 3, name: 'Home', date: "13-11-2018", lat: 21.576718, lng: 39.169574 },
    { id: 4, name: 'Rakesh', date: '15-11-2018', lat: 16.6555572, lng: 74.5665 },
    { id: 4, name: ' Petrol Pump', lat: 16.6555572, lng: 74.5665 },
    { id: 4, name: 'Darga ', lat: 16.659353, lng: 74.569157 },
    { id: 4, name: 'Terwad  ', lat: 16.665593, lng: 74.574939 }];
    setDirction: any;
    transpoertList: any[] = [];
    isLanguage: string;
    istranspoertList: boolean = true;
    indexOflist: number = null;
    unSubscribeTos: any[] = [];
    getAlldrivers: any[] = [];
    tempDriver: any[] = [];
    toChange: any;
    driverId: any;
    isdisableDriver: boolean;
    setValueforDriver: any;
    selectedDriver:any='';
    setTosPlace: any;
    isUo: boolean = false;
    isEa: boolean = false;
    isTo: boolean = false;
    constructor(public navCtrl: NavController, public datepipe: DatePipe, public alertCtrl: AlertController,public events: Events,
        public navParams: NavParams, public Map: MapsPage, private _http: MasaratServiceProvider,public modalCtrl: ModalController,
        public _LanguageService: LanguageService) {
            _http.Selectedlang.subscribe(message=>{
                this.selectedDriver=message;
            });
            this.getUserType();
    }
    getUserType() {
        this._http.httpGetRequest_Core('api/Auth/User_Login_PartiesInfo_OldId/' + localStorage.getItem('userId')).then(data => {
          let isUser = JSON.parse(data['_body']);
          this.isUo = isUser.uOs.length ? true : false;
          this.isEa = isUser.eAs.length ? true : false;
          this.isTo = isUser.tOs.length ? true : false;
        });
      }
    ionViewDidLoad() {
        this.istranspoertList = true;
    }
    ionViewDidEnter() {
        this._http.Selectedlang.subscribe(message=>{
             this.getAlltransort();
              this.selectedDriver=message;
        })
        this.isLanguage = localStorage.getItem('lang');
        if (this.isLanguage == 'ar') {
            this.setDirction = 'rtl';
        } else {
            this.setDirction = 'ltr';
        }
        this.istranspoertList = true;
        this.getAlltransort();
    }
    locationGet(loc) {
        console.log(loc);
        if (loc != undefined || loc != null) {
            localStorage.setItem('lat', loc.lat);
            localStorage.setItem('lng', loc.lng);
            localStorage.setItem('name', loc.name);
            localStorage.setItem('isBus', 'true');
            this.navCtrl.parent.select(0);
        }
    }

    getAlltransort() {
        var d = new Date();
        var n = d.getTimezoneOffset();
        var timezone = n / -60;
        let timeStamp: number = timezone + 12;
        var timeNow = new Date().getTime();
        var fetureTime = new Date(timeNow + 1000 * 60 * 60 * timeStamp).toISOString();
        let timeStamp1: number = timezone - 2;
        var pastTime = new Date(timeNow + 1000 * 60 * 60 * timeStamp1).toISOString();
        pastTime = pastTime.split('.')[0];
        fetureTime = fetureTime.split('.')[0];
        this._http.httpGetRequest_Core('api/TransportMovements/GetAllTransportMovementTrips_MobileData/' + localStorage.getItem('userId') + '/' + pastTime + '/' + fetureTime).then(data => {
            let tempArray = JSON.parse(data['_body']);
            this.transpoertList = []
            this.transpoertList = tempArray.data;
            this.transform(this.transpoertList);
            console.log(this.transpoertList, 'this.sorted');
            this.getAllunsubcribeTo();
            this.getAlldriver();
        });
    }
    showDetails(loc) {
        this.toChange=null;
        this._LanguageService.GetLanguageContent();
        this.isLanguage = localStorage.getItem('lang');
        this.indexOflist = loc;
        this.istranspoertList = false;
        if (this.isLanguage == 'eng') { this.setTosPlace=this.transpoertList[this.indexOflist].to.nameEng;}else{ this.setTosPlace=this.transpoertList[this.indexOflist].to.nameAr;}
        if (this.transpoertList[this.indexOflist].to.nameAr == null) {
            this.getAlldrivers = [];
            this.isdisableDriver = false
            this.selectedDriver=null;
        }else{
            this.selectedDriver=this.transpoertList[this.indexOflist].driver.nameAr;
        }
    }
    hideDetails() {
        this.istranspoertList = true;
    }
    transform(records: any, args?: any): any {
        if (records) {
            return records.sort(function (a, b) {
                if (a.date.split('T')[0] > b.date.split('T')[0]) {
                    return 1;
                }
                else if (a.date.split('T')[0] < b.date.split('T')[0]) {
                    return -1;
                }
                else {
                    if (a.date.split('T')[1] > b.date.split('T')[1]) {
                        return 1;
                    }
                    else if (a.date.split('T')[1] < b.date.split('T')[1]) {
                        return -1;
                    }
                    else {
                        return 0;
                    }
                }
            });
        }

    }
    getAllunsubcribeTo() {
        this._http.httpGetRequest_Core('api/TransportMovements/AllUnSubscribeTOs/' + localStorage.getItem('userId')).then(data => {
            let tempArray = JSON.parse(data['_body']);
            this.unSubscribeTos = tempArray;
            // console.log(this.unSubscribeTos);
        });
    }
    getAlldriver() {
        let uri=(this.isTo) ?'api/TransportMovements/GetAllDrivers/':'api/TransportMovements/GetAllDrivers/';
        this._http.httpGetRequest_Core(uri + localStorage.getItem('userId')).then(data => {
            let tempArray = JSON.parse(data['_body']);
            this.tempDriver = tempArray;
        });
    }
    onChangeTo(tos) {
        localStorage.setItem('transactionId',this.transpoertList[this.indexOflist].id);
        this.isdisableDriver = true;
        this.selectedDriver='Select Driver'
        this.getAlldrivers = this.tempDriver;
        this._http.httpGetRequest_Core('api/TransportMovements/SaveUnSubscribeTOs/' + localStorage.getItem('userId') + '/' + this.transpoertList[this.indexOflist].id + '/' + tos).then(data => {
            let tempArray = JSON.parse(data['_body']);
            this.onChangeDriver(this.transpoertList[this.indexOflist].id);
        });

    }
    onChangeDriver(transactionId) {
        this._http.httpGetRequest_Core('api/TransportMovements/SaveTM_CustomDriver/' + localStorage.getItem('userId') + '/' + 0 + '/' + transactionId).then(data => {
            let tempArray = JSON.parse(data['_body']);
            this.getAlltransort();
        });
    }
    DriverList(){
        let  modalPage = this.modalCtrl.create(DriverpopupPage,{'Driverdata':this.tempDriver});
        modalPage.present();
    }
    selectetTos(tos){
        if(this.toChange){
            return  this.toChange
        }
   }
}
