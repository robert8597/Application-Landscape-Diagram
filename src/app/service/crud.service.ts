import { Variable } from '@angular/compiler/src/render3/r3_ast';
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';


@Injectable({
  providedIn: 'root'
})
export class CrudService {

  constructor(public fireservices: AngularFirestore) { }
  create_NewApplication(Application){
    return this.fireservices.collection("Application").add(Application);
  }

  get_AllApplications(){


    //this.fireservices.collection("Application").valueChanges()
//.subscribe(val => console.log(val));

    return this.fireservices.collection("Application").snapshotChanges();
  }


}
