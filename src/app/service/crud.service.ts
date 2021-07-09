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
    
    shutdownDate: Application['shutdownDate'],
    releaseDate: Application['releaseDate']
})//.add(Application);
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
}
