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
}
