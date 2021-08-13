import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';


@Injectable({
  providedIn: 'root'
})
export class CrudService {

  constructor(public fireservices: AngularFirestore) { }

  create_NewApplication(Application, DocumentNr){ //Saves application in database, documentNr = key of application
    return this.fireservices.collection("Application").doc(DocumentNr).set({
    key: Application['key'],
    name: Application['name'],
    desc: Application['desc'],
    color: Application['color'],
    version: Application['version'],
   
    cots: Application['cots'],
    loc: Application['loc'], 
    shutdownDate: Application['shutdownDate'],
    releaseDate: Application['releaseDate']
})
  }

  updateLocation(DocumentNr, Application){ //Updates location of application, documentNr = key of application
    this.fireservices.doc("Application/"+DocumentNr).update(Application);
  }

  get_AllApplications(){ //Returns all application from database
    return this.fireservices.collection("Application").snapshotChanges();
  }

  updateApplication(app_key, Application){ //Updates application properties
this.fireservices.doc("Application/"+app_key).update(Application);
  }

  delete_Application(app_key){ //Deletes application in database, identified by key
    this.fireservices.doc("Application/" + app_key).delete();
  }

  create_NewDataObject(DataObject){ //Creates new data object in database
    return this.fireservices.collection("DataObject").doc(DataObject['dataobject']).set({
    dataobject: DataObject['dataobject'],
    personalData: DataObject['personalData'],
    description: DataObject['description'], 
})
  }

  create_LinkConnection(DataObject){ //Creates new link connection in database, saves name of dataobject & from(application key) -> to(application key)
    var LinkConnectionName = DataObject['dataobject']+DataObject['from']+DataObject['to'];
    return this.fireservices.collection("LinkConnection").doc(LinkConnectionName).set({
    dataobject: DataObject['dataobject'],
    from: DataObject['from'],
    to: DataObject['to'],
  })
}   

updateDataObject(dataobject_name, DataObject){ //Updates properties of data object
  this.fireservices.doc("DataObject/"+dataobject_name).update(DataObject);
    }

    delete_DataObject(dataobject_name){ //Deletes data object in database
      this.fireservices.doc("DataObject/" + dataobject_name).delete();
      for(var i=0;i<1000;i++){
      this.fireservices.doc("LinkConnection/" + dataobject_name+i).delete();
    }
    }

    delete_LinkConnection(dataobject){ //Deletes link connection in database
      this.fireservices.doc("LinkConnection/" + dataobject["dataobject"]+dataobject["from"]+dataobject["to"]).delete(); 
    }

  get_AllDataObjects(){ //Returns all data objects from database
    return this.fireservices.collection("DataObject").snapshotChanges();
  }

  get_AllLinkConnections(){ //Returns all link connections from database
    return this.fireservices.collection("LinkConnection").snapshotChanges();
  }

}
