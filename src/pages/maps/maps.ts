import { Component, ViewChild, OnInit } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation';
import { GoogleMaps, GoogleMap, GoogleMapsEvent, GoogleMapOptions, CameraPosition, MarkerOptions, Environment, LocationService, MyLocation, LatLng } from '@ionic-native/google-maps';
import { Platform, NavController, NavParams, ModalController } from 'ionic-angular';
import { HomePage } from '../home/home';
declare var google: any;
declare var navigator: any;
@Component({
  selector: 'page-maps',
  templateUrl: 'maps.html',
})

export class MapsPage implements OnInit {
  isUo: boolean = false;
  isEa: boolean = false;
  isTo: boolean = false;
  busCheckbox: boolean = false;
  repCheckbox: boolean = false;
  tempLocation = [{ id: 1, name: 'IT-Office', date: "11-11-2018", lat: 21.517080, lng: 39.183231 },
  { id: 2, name: 'Head-Office', date: "12-11-2018", lat: 21.577827, lng: 39.167093 },
  { id: 3, name: 'Home', date: "13-11-2018", lat: 21.576718, lng: 39.169574 },
  { id: 4, name: 'Rakesh', date: '15-11-2018', lat: 16.6555572, lng: 74.5665 },
  { id: 4, name: ' Petrol Pump', lat: 16.6555572, lng: 74.5665 },
  { id: 4, name: 'Darga ', lat: 16.659353, lng: 74.569157 },
  { id: 4, name: 'Terwad  ', lat: 16.665593, lng: 74.574939 }];

  map: GoogleMap = null;
  latlang: LatLng;
  wathId: any;
  lat: any;
  lng: any;
  mapElement: HTMLElement;
  tracking: number;
  setAttributfor_mapLoad: string = 'UnLoaded'
  task: number;
  selfmarker: any;
  busbuttonColor: string;
  resbuttonColor: string = '#000';
  langugeKey: string;
  setDirection: string;
  getCurrentposition: any;
  mapArry: any[];
  addMar: boolean;
  constructor(public navCtrl: NavController,
    public platform: Platform,
    public navParams: NavParams,
    private modelCtr: ModalController,
    private geolocation: Geolocation) {
    this.langugeKey = localStorage.getItem('lang')
    if (this.langugeKey != undefined || this.langugeKey != null) {
      if (this.langugeKey == 'ar') {
        this.setDirection = 'rtl';
      } else {
        this.setDirection = 'ltr';
      }
    }
    this.busbuttonColor = '#f3f1f1'
    this.resbuttonColor = '#f3f1f1';
  }
  ngOnInit() {
  }

  ionViewDidEnter() {
    this.task = setInterval(() => {
      // this.Map_rray();
      this.platform.ready().then(() => {
        if (this.map == null) {
          this.LoadMap();
          this.task=null;
        }
      });
    }, 8000);
    this.startTrackingLoop();
  }
  ionViewWillLeave() {

  }
  ionViewDidLoad() {
    // this.platform.ready().then(() => {
    //   if (this.map == null) {
    //     this.LoadMap();
    //   }
    // });
  }

  startTrackingLoop() {
    // this.tracking = setInterval(() => {
    //   let templat: number = +localStorage.getItem('lat');
    //     // this.platform.ready().then(() => {
    //     //   if (templat != null && this.map != null) {
    //     //   this.clearMap();
    //     //   this.map.clear();
    //     //   // this.addmarkers();
    //     //     }
    //     // });
    //   this.stopTrackingLoop();
    // }, 1000);
  }

  LoadMap() {
    let options = { timeout: 7000, enableHighAccuracy: true };
    this.geolocation.getCurrentPosition(options).then((resp) => {
      this.lat = resp.coords.latitude;
      this.lng = resp.coords.longitude;
      this.mapElement = document.getElementById('map');
      let mapOptions: GoogleMapOptions = {
        camera: {
          target: { lat: this.lat, lng: this.lng },
          zoom: 18,
          tilt: 30
        }
      };
      this.map = GoogleMaps.create(this.mapElement, mapOptions);
      this.map.one(GoogleMapsEvent.MAP_READY).then(
        () => {
          this.startgeolocation();
        });
    });
  }

  startgeolocation() {
    let options = { frequency: 3000, enableHighAccuracy: true };
    this.wathId = this.geolocation.watchPosition(options).subscribe(resp => {
      this.lat = resp.coords.latitude;
      this.lng = resp.coords.longitude;
      let userPosition: LatLng = new LatLng(this.lat, this.lng)
      if (this.selfmarker != null) {
        this.selfmarker.setPosition(userPosition);
        this.map.addMarker(this.selfmarker);
      } else {
        let markerOptions: MarkerOptions = {
          position: userPosition,
          icon: 'red',
          animation: 'BOUNCE'
        };
        this.map.addMarker(markerOptions).then((marker) => { this.selfmarker = marker; });
      }

      if (!this.busCheckbox && !this.repCheckbox) {
        if (this.addMar == false) {
          var ZoomLocation = {
            "lat": this.lat,
            "lng": this.lng
          }
          this.map.moveCamera({
            "target": ZoomLocation,
            "tilt": 30,
            "zoom": 18,

          });
        }
      }
    });
  }


  stopTrackingLoop() {
    clearInterval(this.tracking);
    this.tracking = null;
  }
  clearMap() {
    this.busCheckbox = false;
    this.repCheckbox = false;
    this.addMar = false;
    this.selfmarker = null
    this.busbuttonColor = '#f3f1f1'
    this.resbuttonColor = '#f3f1f1';
   
  }

  addmarkers(loc) {
    this.addMar = true;
    // let templat: number = +localStorage.getItem('lat');
    // let templng: number = +localStorage.getItem('lng');
    // let tempName: any = +localStorage.getItem('name');
     let isBUs = localStorage.getItem('isBus');
    let markerIcon;
    if (isBUs == 'true') {
      markerIcon = {
        'url': 'assets/imgs/movingBus.png',
        'size': { width: 40, height: 45, },
      }
    } else {
      markerIcon = {
        'url': 'assets/imgs/wmen_trans.png',
        'size': { width: 25, height: 40, }
      }

    }
    this.map.addMarker({
      title: loc.name,
      icon: markerIcon,
      animation: 'drop',
      position: {
        lat: loc.lat,
        lng: loc.lng
      }
    });
    var ZoomLocation = {
      "lat": loc.lat,
      "lng": loc.lng
    }
    this.map.moveCamera({
      "target": ZoomLocation,
      "tilt": 30,
      "zoom": 18,
    });
      localStorage.setItem('lat',null);
  }

  showBus() {
    this.busCheckbox = !this.busCheckbox; this.addMar = false;
    if (this.busCheckbox) {
    this.busbuttonColor = '#1471c1';
      this.mapArry = []
      this.mapArry = this.tempLocation;
      this.mapArry.forEach(res => {
        let markerIcon = {
          'url': 'assets/imgs/movingBus.png',
          'size': { width: 40, height: 45, },
        }
        this.map.addMarker({
          title: 'Res Location',
          icon: markerIcon,
          animation: 'drop',
          position: {
            lat: res.lat,
            lng: res.lng
          }
        });
      })
    } else {
      this.busbuttonColor = '#f3f1f1';
      this.map.clear();
      // if (!this.busCheckbox) {
      //   // this.repCheckbox = !this.repCheckbox;
      
      //   // this.showRep();
      // }
    }
  }

  showRep() {
    this.repCheckbox = !this.repCheckbox; this.addMar = false
    if (this.repCheckbox) {
    this.resbuttonColor = '#1471c1';
      var resloc = []
      resloc = this.tempLocation;
      resloc.forEach(res => {
        let markerIcon = {
          'url': 'assets/imgs/wmen_trans.png',
          'size': { width: 25, height: 40, }
        }
        this.map.addMarker({
          title: 'Res Location',
          icon: markerIcon,
          animation: 'drop',
          position: {
            lat: res.lat,
            lng: res.lng
          }
        });
      });
    } else {
      this.resbuttonColor = '#f3f1f1';
      if (!this.repCheckbox) {
        this.map.clear();
        this.busCheckbox = !this.busCheckbox;
        this.showBus();
      }
    }
  }
 
  moveLocation() {
    this.clearMap();
    this.map.clear();
    if(this.map!=null){
      navigator.geolocation.clearWatch(this.wathId);
      this.startgeolocation(); 
      // this.map.remove();
      // this.LoadMap();
      // this.stopTrackingLoop();
    }else{
      this.LoadMap();
    }
  }
  Map_rray() {
    if (this.lat && this.lng) {
      this.tempLocation.forEach(a => {
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
        // alert(this.lat+'\n'+this.lng);
        if (this.lat >= minLat && this.lat <= maxLat && this.lng >= minLong && this.lng <= maxLong) {
          console.log('same loaction');
          // alert("Success");
          // alert(a.name);
          var date = new Date().toISOString();
        }
      });
    }
  }
  clickLister(){
   this.modelCtr.create(HomePage).present();
  }
}


// ionic cordova plugin add https://github.com/mapsplugin/cordova... --variable API_KEY_FOR_ANDROID="AIzaSyBwlDZVV3lKeJggyWYHT7fDz3YkpPMfbG0" --variable API_KEY_FOR_IOS="AIzaSyBwlDZVV3lKeJggyWYHT7fDz3YkpPMfbG0"





//   mapView:boolean=true;
//   respLocationView:boolean=false;
//   BusLocationView:boolean=false;

//   map: GoogleMap=null;
//   text: string;
//   Lng: any;
//   Lat: any;
//   isLang: boolean=false;
//   langugeKey: any;
//   constructor( public platform: Platform) {
//    this.langugeKey = localStorage.getItem('lang');
//     if(this.langugeKey=='ar'){
//       this.isLang=!this.isLang
//     }
//   }
//   initialMapLoad: boolean = true;
//   ngOnInit() {
//     this.platform.ready().then(() => {

//       this.loadMap();
//     });
//   }
//   ionViewDidLoad() { 

//   }

//   loadMap(){
//     LocationService.getMyLocation().then((myLocation: MyLocation) => {
//       let options: GoogleMapOptions = {
//         camera: { target: myLocation.latLng, zoom: 15, }
//       };
//       this.map = GoogleMaps.create('map_canvas', options);
//         this.map.addMarker({
//           title:'hello ',
//           icon:'blue',
//           animation:'drop',
//           position:  myLocation.latLng
//         })
//      });
//   }
// addmarkers(){
//   let templat:any=localStorage.getItem('lat');
//   let templng:any=localStorage.getItem('lng');
//   this.map.addMarker({
//     title:'plugein ',
//     icon:'blue',
//     animation:'drop',
//     position: {
//       lat:+templat,
//       lng:+templng 
//     }
//   });
//   var ZoomLocation ={
//     "lat":  templat,
//    "lng": templng
//   }
//   this.map.moveCamera({
//     "target":ZoomLocation,
//     "tilt":60,
//     "zoom":18,
//     "bearing":140
//   })
// }
//   // ionic cordova plugin add cordova-plugin-googlemaps  --variable API_KEY_FOR_ANDROID="AIzaSyBwlDZVV3lKeJggyWYHT7fDz3YkpPMfbG0"  --variable API_KEY_FOR_IOS="AIzaSyBwlDZVV3lKeJggyWYHT7fDz3YkpPMfbG0"
//   switchLanguage(language: string) {
//     this.langugeKey=language;
//     localStorage.setItem('lang', language);
//     this.isLang = !this.isLang; 
//   }

