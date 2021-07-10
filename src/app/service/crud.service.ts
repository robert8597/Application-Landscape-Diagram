import { analyzeAndValidateNgModules } from '@angular/compiler';
import { Variable } from '@angular/compiler/src/render3/r3_ast';
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';


@Injectable({
  providedIn: 'root'
})
export class CrudService {

  constructor(public fireservices: AngularFirestore) { }
  create_NewApplication(Application, DocumentNr){
    return this.fireservices.collection("Application").doc(DocumentNr).set({
    key: Application['key'],
    name: Application['name'],
    desc: Application['desc'],
    color: Application['color'],
    version: Application['version'],
   
    cots: Application['cots'],
    loc: Application['loc'], ///////////////
    shutdownDate: Application['shutdownDate'],
    releaseDate: Application['releaseDate']
})//.add(Application);
  }

  updateLocation(DocumentNr, Application){
    //let Application = {};
 
    //Application['location']=location;
    
    this.fireservices.doc("Application/"+DocumentNr).update(Application);
 
  }

  get_AllApplications(){


    //this.fireservices.collection("Application").valueChanges()
//.subscribe(val => console.log(val));

    return this.fireservices.collection("Application").snapshotChanges();
  }

  updateApplication(app_key, Application){
this.fireservices.doc("Application/"+app_key).update(Application);
  }

  delete_Application(app_key){
    this.fireservices.doc("Application/" + app_key).delete();
  }

  create_NewDataObject(DataObject){
    return this.fireservices.collection("DataObject").doc(DataObject['dataobject']).set({
    dataobject: DataObject['dataobject'],
    personalData: DataObject['personalData'],
    description: DataObject['description'],
   
})
  }

  create_LinkConnection(DataObject, Counter){
    var LinkConnectionName = DataObject['dataobject']+Counter;
    return this.fireservices.collection("LinkConnection").doc(LinkConnectionName).set({
    dataobject: DataObject['dataobject'],
    from: DataObject['from'],
    to: DataObject['to'],
  })
}   

updateDataObject(dataobject_name, DataObject){
  this.fireservices.doc("DataObject/"+dataobject_name).update(DataObject);
    }

    delete_DataObject(dataobject_name){
      this.fireservices.doc("DataObject/" + dataobject_name).delete();
      for(var i=0;i<1000;i++){
      this.fireservices.doc("LinkConnection/" + dataobject_name+i).delete();
    }
    }

  get_AllDataObjects(){
    return this.fireservices.collection("DataObject").snapshotChanges();
  }

  get_AllLinkConnections(){
    return this.fireservices.collection("LinkConnection").snapshotChanges();
  }

}
