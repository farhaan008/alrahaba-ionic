import { Component, Renderer } from '@angular/core';
import { NavController, NavParams, ViewController, AlertController, Events } from 'ionic-angular';
import { MasaratServiceProvider } from '../../providers/masarat-service/masarat-service';


@Component({
  selector: 'page-driverpopup',
  templateUrl: 'driverpopup.html',
})
export class DriverpopupPage {
  DriverList: any[] = [];
  isUo: boolean = false;
  isEa: boolean = false;
  isTo: boolean = false;
  constructor(public navCtrl: NavController, 
    params: NavParams,public events: Events,
    public renderer: Renderer,public viewCtr: ViewController, public navParams: NavParams,
    public alertCtrl: AlertController,
    private _http: MasaratServiceProvider) {
      this.renderer.setElementClass(viewCtr.pageRef().nativeElement, 'my-popup', true);
      if( this.navParams.get('Driverdata')!=undefined){
      this.DriverList = navParams.get('Driverdata');
      this.getUserType();
      }
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
    if( this.navParams.get('Driverdata')!=undefined){
      this.DriverList = this.navParams.get('Driverdata');
    }
    
  }
  onDissmiss() {
    this.viewCtr.dismiss();
  }
  addnewDriver() {
    let alert = this.alertCtrl.create({
      title: 'New driver',
      inputs: [
        
        {
          name: 'name',
          placeholder: 'Name',
        },
        {
          name: 'phoneNumber',
          placeholder: 'Phone Number',
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
        },
        {
          text: 'Ok',
          role: 'submit',
          handler: data => {
            var D_data;
            D_data={
              'id':'00',
              'name':data.name,
              'phoneNumber':data.phoneNumber,
              'idNumber':'00'
            };
            console.log(D_data);
            this._http.httpputRequest_Core('api/TransportMovements/SaveUnSubscribeTOs/' + localStorage.getItem('userId'), D_data).then(data => {
              let tempArray = JSON.parse(data['_body']);
              
            });
          }
        },
      ]
    });
    alert.present();
  }
  editDriver(index) {
    debugger;
    let alert = this.alertCtrl.create({
      title: 'Edit driver',
      inputs: [
        {
          name: 'name',
          placeholder: 'Name',
          value:this.DriverList[index].name
        },
        {
          name: 'phoneNumber',
          placeholder: 'Phone Number',
          value:this.DriverList[index].phoneNumber
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
        },
        {
          text: 'Ok',
          role: 'submit',
          handler: data => {
            var D_data;
            D_data={
              'id':this.DriverList[index].id,
              'name':data.name,
              'phoneNumber':data.phoneNumber,
              'idNumber':this.DriverList[index].idNumber
            };
            console.log(D_data);
            this._http.httpputRequest_Core('api/TransportMovements/SaveUnSubscribeTOs/' + localStorage.getItem('userId'), D_data).then(data => {
              let tempArray = JSON.parse(data['_body']);
              this.viewCtr.dismiss();
            });
          }
        },
      ]
    });
    alert.present();
  }
  
  onChangeDriver(Driver_id,dri){
    let Driver_name=dri;
    this._http.httpGetRequest_Core('api/TransportMovements/SaveTM_CustomDriver/' + localStorage.getItem('userId') + '/' + Driver_id + '/' + localStorage.getItem('transactionId')).then(data => {
        let tempArray = JSON.parse(data['_body']);
          this._http.changeD(Driver_name);
          this.DriverList = [];
          this.viewCtr.dismiss();
    });
}
}
