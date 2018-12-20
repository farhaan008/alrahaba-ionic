import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { MapsPage } from '../maps/maps';

@Component({
  selector: 'page-reps-location',
  templateUrl: 'reps-location.html',
  providers:[MapsPage]
})
export class RepsLocationPage { 
  tempLocation=[{ id:1,name:'IT-Office', date:"11-11-2018",lat:21.517080, lng:39.183231},
  { id:2,name:'Head-Office', date:"12-11-2018",lat:21.577827, lng:39.167093},
  { id:3,name:'Home', date:"13-11-2018",lat:21.576718, lng:39.169574},
  { id:4,name:'Rakesh',  date:'15-11-2018', lat: 16.6555572, lng: 74.5665},
  { id:4,name: ' Petrol Pump', lat: 16.6555572, lng: 74.5665 },
  {id:4, name: 'Darga ', lat: 16.659353, lng: 74.569157 },
  { id:4,name: 'Terwad  ', lat: 16.665593, lng: 74.574939 }];
  constructor(public navCtrl: NavController,  public maps:MapsPage, public navParams: NavParams,public Map:MapsPage) {
  }

  ionViewDidLoad(loc) {
    console.log('ionViewDidLoad RepsLocationPage');
  }
  locationGet(loc){
    console.log(loc);
    if(loc!=undefined||loc!=null){
      localStorage.setItem('lat',loc.lat);
      localStorage.setItem('lng',loc.lng);
      localStorage.setItem('name',loc.name);
      localStorage.setItem('isBus','false');
       this.navCtrl.parent.select(0);
       this.Map.addmarkers(loc);
    }
   
  }
}
