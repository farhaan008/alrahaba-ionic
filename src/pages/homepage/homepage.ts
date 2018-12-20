import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform, ViewController } from 'ionic-angular';
import {
  GoogleMaps,
  GoogleMap,
  GoogleMapsEvent,
  GoogleMapOptions,
  CameraPosition,
  MarkerOptions,
  Marker,
  Environment,
  LocationService,
  MyLocation
} from '@ionic-native/google-maps';
import { Geolocation } from '@ionic-native/geolocation';
declare var google: any;
/**
 * Generated class for the HomepagePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-homepage',
  templateUrl: 'homepage.html',
})
export class HomepagePage implements OnInit {

  mapHome: GoogleMap=null;
  lat:any = 16.6555572;
  lng:any = 74.5665 ;
  mapElement2:HTMLElement;
  tracking: number;
  busbuttonColor: string;
  mapArry: any;
  busCheckbox: boolean;
  tempLocation: any;
  repCheckbox: boolean;
  resbuttonColor: string;
  constructor(public navCtrl: NavController,private viewCtr:ViewController,  public platform: Platform ,public navParams: NavParams,  private geolocation: Geolocation,) {
    this.busCheckbox =false; 
    this.repCheckbox =false; 
    this.busbuttonColor = '#f3f1f1'
    this.resbuttonColor = '#f3f1f1';
    // if(this.map==null){
    //   this.platform.ready().then(() => {
    //     this.LoadMap();
    //   });
    // }
  }
  ngOnInit(){
      // if(this.map==null){
      //   this.platform.ready().then(() => {
      //     this.LoadMap();
      //   });
      // }   
  }
  ionViewDidLoad() {
    this.platform.ready().then(() => {
      if (this.mapHome == null) {
        this.LoadMap();
      }
    });
  }
  LoadMap(){
      this.mapElement2 = document.getElementById('homeMap');
      let mapOptions: GoogleMapOptions = {
        camera: {
          target: { lat: this.lat, lng: this.lng },
          zoom: 18,
          tilt: 30
        }
      };
      this.mapHome = GoogleMaps.create(this.mapElement2, mapOptions);
      this.mapHome.one(GoogleMapsEvent.MAP_READY).then(
        () => {
        });
  }

  showBus() {
    this.busCheckbox = !this.busCheckbox; 
    if (this.busCheckbox) {
    this.busbuttonColor = '#1471c1';
      this.mapArry = []
      this.mapArry = this.tempLocation;
      this.mapArry.forEach(res => {
        let markerIcon = {
          'url': 'assets/imgs/movingBus.png',
          'size': { width: 40, height: 45, },
        }
        this.mapHome.addMarker({
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
      if (!this.busCheckbox) {
        this.repCheckbox = !this.repCheckbox;
        this.mapHome.clear();
        this.showRep();
      }
    }
  }

  showRep() {
    this.repCheckbox = !this.repCheckbox; 
    if (this.repCheckbox) {
    this.resbuttonColor = '#1471c1';
      var resloc = []
      resloc = this.tempLocation;
      resloc.forEach(res => {
        let markerIcon = {
          'url': 'assets/imgs/wmen_trans.png',
          'size': { width: 25, height: 40, }
        }
        this.mapHome.addMarker({
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
        this.mapHome.clear();
        this.busCheckbox = !this.busCheckbox;
        this.showBus();
      }
    }
  }
  onDissmiss() {
    if(this.mapHome!=null){
      this.mapHome.remove();
    }
    this.viewCtr.dismiss();
  }

// startTrackingLoop() {
//   this.tracking = setInterval(() => {
//     this.addmarkers()
//     this.stopTrackingLoop();
//   }, 2000);
// }
// stopTrackingLoop() {
//   clearInterval(this.tracking);
//   this.tracking = null;
// }

}
