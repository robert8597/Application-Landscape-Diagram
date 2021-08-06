import { DOCUMENT, JsonPipe } from '@angular/common';
import { ThisReceiver, ThrowStmt } from '@angular/compiler';
import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, NgForm, Validators } from '@angular/forms';
import { CsvDataService } from '../csv/csv-data.service';
import * as go from 'gojs';
import { CrudService } from '../service/crud.service';

@Component({
  selector: 'app-inspector',
  templateUrl: './inspector.component.html',
  styleUrls: ['./inspector.component.css']
})
export class InspectorComponent implements OnInit {

  //Variable declaration
  
  public _selectedNode: go.Node;
  public _selectedLink: go.Link;
  public _selectedDataObject: string;
  public _selectedLocation: any;

  key: string;
  name: string;
  desc: string;
  Application: any;
  DataObject: any;
  LinkConnections: any;

  public dataobject: string;
  today = new Date();

  //Data Array which contains the properties of an Node
  public data = {
    key: null,
    name: null,
    version: null,
    desc: null,
    cots: null,
    releaseDate: null,
    shutdownDate: null,
    color: null
  };

  //LinkData Array which contains the properties of an DataObject
  public LinkData = {
    dataobject: null,
    personalData: false,
    description: null,
    from: null,
    to: null,
    text: null
  }

  //Variables for Workaround to fix the Electron Alert Bug
  AlertSehen = 'none';
  AlertSehenDate1 = 'none';
  AlertSehenDate2 = 'none';
  AlertSehenCreate = 'none';
  AlertSehenAppDelete = 'none';
  AlertSehenDataChange = 'none';
  AlertSehenCreateData = 'none';
  AlertSehenAppUpdated = 'none';
  AlertSehenDataDelete = 'none';
  AppSehen = 'none';
  DataObjectSehen = 'none';
  DataObjectCustomize = 'none';
  DataObjectListe = "none";
  ChooseDataObject = "";
  DataObjectCreate = "";

  ngOnInit(): void {
    var mySub = this.crudservice.get_AllApplications().subscribe(data2 => {
      this.Application = data2.map(e => {

        return {
          id: e.payload.doc.id,
          key: e.payload.doc.data()["key"],
          name: e.payload.doc.data()["name"],
          version: e.payload.doc.data()["version"],
          color: e.payload.doc.data()["color"],
          cots: e.payload.doc.data()["cots"],
          desc: e.payload.doc.data()["desc"],
          releaseDate: e.payload.doc.data()["releaseDate"],
          shutdownDate: e.payload.doc.data()["shutdownDate"],
          loc: e.payload.doc.data()["loc"],
        };
      })
      this.model.addNodeDataCollection(this.Application);
      mySub.unsubscribe();
    })
    var mySub2 = this.crudservice.get_AllDataObjects().subscribe(data2 => {
      this.DataObject = data2.map(e => {
        return {
          id: e.payload.doc.id,
          dataobject: e.payload.doc.data()["dataobject"],
          description: e.payload.doc.data()["description"],
          personalData: e.payload.doc.data()["personalData"],
          text: e.payload.doc.data()["dataobject"],
          from: e.payload.doc.data()["from"],
          to: e.payload.doc.data()["to"],
        };
      })
      if (this.model instanceof go.GraphLinksModel) {
        this.model.addLinkDataCollection(this.DataObject);
      }
      mySub2.unsubscribe();
    })



    ///Link Connections LOADING///////
    var mySub3 = this.crudservice.get_AllLinkConnections().subscribe(data2 => {
      this.LinkConnections = data2.map(e => {

        return {
          id: e.payload.doc.id,
          dataobject: e.payload.doc.data()["dataobject"],
          from: e.payload.doc.data()["from"],
          to: e.payload.doc.data()["to"],
        };
      })
      for (var i = 0; i < this.DataObject.length; i++) {
        for (var x = 0; x < this.LinkConnections.length; x++) {
          if (this.DataObject[i].dataobject == this.LinkConnections[x].dataobject) {
            this.LinkConnections[x]["description"] = this.DataObject[i].description;
            this.LinkConnections[x]["personalData"] = this.DataObject[i].personalData;
            this.LinkConnections[x]["text"] = this.DataObject[i].dataobject;
          }
        }
      }

      if (this.model instanceof go.GraphLinksModel) {
        this.model.addLinkDataCollection(this.LinkConnections);
      }
      mySub3.unsubscribe();
    })
  }

  createApplication() {
    let Application = {};
    Application['key'] = (this.model.nodeDataArray.length + 1);
    Application['name'] = "Application " + (this.model.nodeDataArray.length + 1);
    Application['desc'] = "Your Description here...";
    Application['color'] = "lightblue";
    Application['cots'] = "COTS";
    Application['version'] = "Default";
    Application['releaseDate'] = "01.01.0001";
    Application['shutdownDate'] = "31.12.9999";
    Application['loc'] = "";

    this.model.addNodeData(Application);
    var DocumentNr = Application['key'];
    this.crudservice.create_NewApplication(Application, DocumentNr.toString()).then(res => {
      console.log("RESDING=" + res);
    }).catch(error => {
      console.log(error)
    });
  }

  updateApplication(app_key) {
    let Application = {};

    Application['name'] = this.data.name;
    Application['desc'] = this.data.desc;
    Application['color'] = this.data.color;
    Application['cots'] = this.data.cots;
    Application['version'] = this.data.version;
    Application['releaseDate'] = this.data.releaseDate;
    Application['shutdownDate'] = this.data.shutdownDate;

    this.crudservice.updateApplication(app_key, Application);
  }

  deleteApplication(app_key, app_name) {
    this.crudservice.delete_Application(app_key);
    var Application = this.model.findNodeDataForKey(app_key);
    this.model.removeNodeData(Application);
    this.AppSehen = 'none';
  }

  @Input()
  public model: go.Model;

  @Input()
  get selectedLocation() { return this._selectedLocation; }
  set selectedLocation(location: any) {
    if (location != null) {
      let Application = {};
      Application['loc'] = location;
      this.crudservice.updateLocation(this.data.key, Application);
    }
  }

  //Calling selectedLink() method from diagram.component.ts
  @Input()
  get selectedLink() { return this._selectedLink; }
  set selectedLink(link: go.Link) {
    if (link) {
      this.AlertSehen = 'none';
      this.AlertSehenDate1 = 'none';
      this.AlertSehenDate2 = 'none';
      this.AlertSehenCreate = 'none';
      this.AlertSehenAppDelete = 'none';
      this.AlertSehenDataChange = 'none';
      this.AlertSehenCreateData = 'none';
      this.AlertSehenAppUpdated = 'none';
      this.AlertSehenDataDelete = 'none';
      this.DataObjectSehen = 'block';
      this.AppSehen = 'none';
      this.DataObjectCustomize = 'none';
      this.DataObjectListe = "none";
      this.ChooseDataObject = "";
      this.DataObjectCreate = "none";
      this._selectedLink = link;

      this.LinkData.dataobject = this._selectedLink.data.dataobject;
      this.LinkData.personalData = this._selectedLink.data.personalData;
      this.LinkData.description = this._selectedLink.data.description;
      this.LinkData.from = this._selectedLink.data.from;
      this.LinkData.to = this._selectedLink.data.to;
      this.LinkData.text = this._selectedLink.data.text;

    }
    else {
      this.AlertSehen = 'none';
      this.AlertSehenDate1 = 'none';
      this.AlertSehenDate2 = 'none';
      this.AlertSehenCreate = 'none';
      this.AlertSehenAppDelete = 'none';
      this.AlertSehenDataChange = 'none';
      this.AlertSehenCreateData = 'none';
      this.AlertSehenAppUpdated = 'none';
      this.AlertSehenDataDelete = 'none';
      this.DataObjectSehen = 'none';
      this.AppSehen = 'none';
      this.DataObjectCustomize = 'none';
      this.DataObjectCreate = "none";
    }
  }

//Calling selectedNode() method from diagram.component.ts
  @Input()
  get selectedNode() { return this._selectedNode; }
  set selectedNode(node: go.Node) {
    if (node) {

      this.AlertSehen = 'none';
      this.AlertSehenDate1 = 'none';
      this.AlertSehenDate2 = 'none';
      this.AlertSehenCreate = 'none';
      this.AlertSehenAppDelete = 'none';
      this.AlertSehenDataChange = 'none';
      this.AlertSehenCreateData = 'none';
      this.AlertSehenAppUpdated = 'none';
      this.AlertSehenDataDelete = 'none';
      this.AppSehen = 'block';
      this.DataObjectSehen = 'none';
      this.DataObjectCustomize = 'none';
      this.DataObjectCreate = "none";

      this._selectedNode = node;

      this.data.key = this._selectedNode.data.key;
      this.data.name = this._selectedNode.data.name;
      this.data.version = this._selectedNode.data.version;
      this.data.desc = this._selectedNode.data.desc;
      this.data.cots = this._selectedNode.data.cots;
      this.data.releaseDate = this._selectedNode.data.releaseDate;
      this.data.shutdownDate = this._selectedNode.data.shutdownDate;
      this.data.color = this._selectedNode.data.color;

    } else {
      this.AlertSehen = 'none';
      this.AlertSehenDate1 = 'none';
      this.AlertSehenDate2 = 'none';
      this.AlertSehenCreate = 'none';
      this.AlertSehenAppDelete = 'none';
      this.AlertSehenDataChange = 'none';
      this.AlertSehenCreateData = 'none';
      this.AlertSehenAppUpdated = 'none';
      this.AlertSehenDataDelete = 'none';
      this.AppSehen = 'none';
      this.DataObjectSehen = 'none';
      this.DataObjectCustomize = 'none';
      this.DataObjectCreate = "none";
    }
  }

  //Methods for each Message - Alert Workaround

  //resets the Message Box
  resetalert() {
    this.AppSehen = 'block';
    this.DataObjectSehen = 'none';
    this.DataObjectCustomize = 'none';
    this.DataObjectCreate = "none";
    this.AlertSehen = "none";
  }

  // Alert Method for when there is already a Node with that Key
  setalert() {
    this.AppSehen = 'none';
    this.DataObjectSehen = 'none';
    this.DataObjectCustomize = 'none';
    this.DataObjectCreate = "none";
    this.AlertSehen = "block";
  }

  //Alert for when Release date later than Shutdown date
  setalertdate1() {
    this.AppSehen = 'none';
    this.DataObjectSehen = 'none';
    this.DataObjectCustomize = 'none';
    this.DataObjectCreate = "none";
    this.AlertSehenDate1 = "block";
  }

  resetalertdate1() {
    this.AppSehen = 'block';
    this.DataObjectSehen = 'none';
    this.DataObjectCustomize = 'none';
    this.DataObjectCreate = "none";
    this.AlertSehenDate1 = "none";
  }
  //Alert for when Shutdown date earlier than Release date
  setalertdate2() {
    this.AppSehen = 'none';
    this.DataObjectSehen = 'none';
    this.DataObjectCustomize = 'none';
    this.DataObjectCreate = "none";
    this.AlertSehenDate2 = "block";
  }

  resetalertdate2() {
    this.AppSehen = 'none';
    this.DataObjectSehen = 'none';
    this.DataObjectCustomize = 'none';
    this.DataObjectCreate = "none";
    this.AlertSehenDate2 = "block";
  }
  //Alert for when Node created
  setalertcreate() {
    this.AppSehen = 'none';
    this.DataObjectSehen = 'none';
    this.DataObjectCustomize = 'none';
    this.DataObjectCreate = "none";
    this.AlertSehenCreate = 'block';
  }
  //Resets / Closes the Alert
  resetalertcreate() {
    this.AppSehen = 'none';
    this.DataObjectSehen = 'none';
    this.DataObjectCustomize = 'none';
    this.DataObjectCreate = "none";
    this.AlertSehenCreate = 'none';
  }

  //Alert for when Node deleted
  setalertappdelete() {
    this.AppSehen = 'none';
    this.DataObjectSehen = 'none';
    this.DataObjectCustomize = 'none';
    this.DataObjectCreate = "none";
    this.AlertSehenAppDelete = 'block';
  }

  //Resets / Closes the Alert
  resetalertappdelete() {
    this.AppSehen = 'none';
    this.DataObjectSehen = 'none';
    this.DataObjectCustomize = 'none';
    this.DataObjectCreate = "none";
    this.AlertSehenAppDelete = 'none';
  }

  //Alert for when Data Object updated
  setalertdataobjectchange() {
    this.AppSehen = 'none';
    this.DataObjectSehen = 'none';
    this.DataObjectCustomize = 'none';
    this.DataObjectCreate = "none";
    this.AlertSehenDataChange = 'block';
  }

  //Resets / Closes the Alert
  resetalertdataobjectchange() {
    this.AppSehen = 'none';
    this.DataObjectSehen = 'none';
    this.DataObjectCustomize = 'block';
    this.DataObjectCreate = "none";
    this.AlertSehenDataChange = 'none';
  }

  //Alert for when Data Object created
  setalertcreatedata() {
    this.AppSehen = 'none';
    this.DataObjectSehen = 'none';
    this.DataObjectCustomize = 'none';
    this.DataObjectCreate = "none";
    this.AlertSehenCreateData = 'block';
  }

  //Resets / Closes the Alert
  resetalertcreatedata() {
    this.AppSehen = 'none';
    this.DataObjectSehen = 'none';
    this.DataObjectCustomize = 'none';
    this.DataObjectCreate = "none";
    this.AlertSehenCreateData = 'none';
  }

  //Alert for when Node updated
  setalertappupdated() {
    this.AppSehen = 'none';
    this.DataObjectSehen = 'none';
    this.DataObjectCustomize = 'none';
    this.DataObjectCreate = "none";
    this.AlertSehenAppUpdated = 'block';
  }

  //Resets / Closes the Alert
  resetalertappupdated() {
    this.AppSehen = 'block';
    this.DataObjectSehen = 'none';
    this.DataObjectCustomize = 'none';
    this.DataObjectCreate = "none";
    this.AlertSehenAppUpdated = 'none';
  }


  //Alert for when Data Object is deleted
  setalertdataobjectdelete() {
    this.AppSehen = 'none';
    this.DataObjectSehen = 'none';
    this.DataObjectCustomize = 'none';
    this.DataObjectCreate = "none";
    this.AlertSehenDataDelete = 'block';
  }

  //Resets / Closes the Alert
  resetalertdataobjectdelete() {
    this.AppSehen = 'none';
    this.DataObjectSehen = 'none';
    this.DataObjectCustomize = 'none';
    this.DataObjectCreate = "none";
    this.AlertSehenDataDelete = 'none';
  }

  //Method to making the GettingStarted PDF Doc downloadable
  downloadFile() {
    let link = document.createElement("a");
    link.download = "GettingStarted";
    link.href = "assets/GettingStarted.pdf";
    link.click();
  }

  //Method to making the Excel Template downloadable
  downloadXLS() {
    let link = document.createElement("a");
    link.download = "Excel Template";
    link.href = "assets/ExcelTemplate.xlsx";
    link.click();
  }

  //Method for the Reset Button for Data Objects
  public cancelChangesData() {
    this.editData.setValue(
      {
        dataobject: this.selectedLink.data.dataobject,
        personalData: this.selectedLink.data.personalData,
        description: this.selectedLink.data.description
      }
    )
  }

  //Method for the Reset Button for Nodes
  public cancelChanges() {
    this.editForm.setValue(
      {
        key: this.selectedNode.data.key,
        name: this.selectedNode.data.name,
        version: this.selectedNode.data.version,
        desc: this.selectedNode.data.desc,
        cots: this.selectedNode.data.cots,
        releaseDate: this.selectedNode.data.releaseDate,
        shutdownDate: this.selectedNode.data.shutdownDate
      }
    )
  }

  public onCommitForm2() {

    this.model.startTransaction();
    this.model.set(this.selectedLink.data, 'dataobject', this.LinkData.dataobject);
    this.model.set(this.selectedLink.data, 'personalData', this.LinkData.personalData);
    this.model.set(this.selectedLink.data, 'description', this.LinkData.description);
    this.model.set(this.selectedLink.data, 'text', this.LinkData.dataobject);

    this.model.commitTransaction();

    var newDataObject =
      { text: this.LinkData.dataobject, description: this.LinkData.description, personalData: this.LinkData.personalData, dataobject: this.LinkData.dataobject, from: this.LinkData.from, to: this.LinkData.to };
    var DataObjectCounter = this.LinkData.from.toString() + this.LinkData.to.toString();

    if (this.model instanceof go.GraphLinksModel) {
      { DataObjectCounter = this.model.linkDataArray.length + 1; }
    }

    this.crudservice.create_LinkConnection(newDataObject);


  }

  public changeDataObject() {
    var modelAsText = this.model.toJson();
    var jsonDataObjects = JSON.parse(modelAsText);

    if (this.model instanceof go.GraphLinksModel) {
      for (var z = 0; z < this.model.linkDataArray.length + 5; z++) { //Falls doppelte DataObjects kommen +5 erhöhen !
        this.model.removeLinkDataCollection(this.model.linkDataArray);
      }
      this.DataObjectCreate = "none";
      this.DataObjectSehen = 'none';
      for (var i = 0; i < jsonDataObjects.linkDataArray.length; i++) {
        if (jsonDataObjects.linkDataArray[i].dataobject == this.LinkData.dataobject) {
          jsonDataObjects.linkDataArray[i].personalData = this.LinkData.personalData;
          jsonDataObjects.linkDataArray[i].description = this.LinkData.description;
          jsonDataObjects.linkDataArray[i].text = this.LinkData.dataobject;
        }
        console.log("test:" + i + jsonDataObjects.linkDataArray[i].dataobject);
      }
      this.model.addLinkDataCollection(jsonDataObjects.linkDataArray);
    }


    let DataObject = {};

    DataObject['dataobject'] = this.LinkData.dataobject;
    DataObject['description'] = this.LinkData.description;
    DataObject['personalData'] = this.LinkData.personalData;
    DataObject['text'] = this.LinkData.text;


    this.crudservice.updateDataObject(this.LinkData.dataobject, DataObject);
  }

  //Assign the Values from the Application Editor to the Nodes
  public onCommitForm() {
    var check = false;
    this.model.startTransaction();
    if (this.selectedNode.data.key != this.data.key) {
      var keepGoing = true;
      this.model.nodeDataArray.forEach(element => {
        if (keepGoing) {
          if (element.key == this.data.key) {
            keepGoing = false;
            this.setalert();
            this.cancelChanges();
          }
        }
      }
      )
      if (keepGoing == true) {
        check = true;
      }
      this.model.set(this.selectedNode.data, 'key', this.data.key);
    }
    if (this.selectedNode.data.name != this.data.name) {
      this.model.set(this.selectedNode.data, 'name', this.data.name);
      check = true;
    }
    if (this.selectedNode.data.version != this.data.version) {
      this.model.set(this.selectedNode.data, 'version', this.data.version);
      check = true;
    }
    if (this.selectedNode.data.desc != this.data.desc) {
      this.model.set(this.selectedNode.data, 'desc', this.data.desc);
      check = true;
    }
    if (this.selectedNode.data.cots != this.data.cots) {
      this.model.set(this.selectedNode.data, 'cots', this.data.cots);
      check = true;
    }
    if (this.selectedNode.data.releaseDate != this.data.releaseDate) {
      const str = this.data.releaseDate;
      const words = str.split(".");
      const strShut = this.data.shutdownDate;
      const wordsShut = strShut.split(".");
      const strTest = this.today.toLocaleDateString();
      const Test = strTest.split(".");

      if (parseInt(Test[0]) < 10) {
        Test[0] = "0" + Test[0];
      }
      if (parseInt(Test[1]) < 10) {
        Test[1] = "0" + Test[1];
      }
      const temp = Test[0] + "." + Test[1] + "." + Test[2];
      const wordsTest = temp.split(".");

      //Checking if Release Date is in Past, Future or Current and assigning Color to the nodes wheter its in future or not...
      if (words[2] < wordsShut[2] || words[2] == wordsShut[2] && words[1] < wordsShut[1]
        || words[2] == wordsShut[2] && words[1] == wordsShut[1] && words[0] <= wordsShut[0]) {
        this.model.set(this.selectedNode.data, 'releaseDate', this.data.releaseDate);
        check = true;
        if (wordsTest[2] > wordsShut[2] || wordsTest[2] == wordsShut[2] && wordsTest[1] > wordsShut[1]
          || wordsTest[2] == wordsShut[2] && wordsTest[1] == wordsShut[1] && wordsTest[0] > wordsShut[0]) {
          this.data.color = "red";
          this.model.set(this.selectedNode.data, 'color', this.data.color);
        } else {
          if (wordsTest[2] < words[2] || wordsTest[2] == words[2] && wordsTest[1] < words[1]
            || wordsTest[2] == words[2] && wordsTest[1] == words[1] && wordsTest[0] < words[0]) {
            this.data.color = "yellow";
            this.model.set(this.selectedNode.data, 'color', this.data.color);
          } else {
            this.data.color = "lightblue";
            this.model.set(this.selectedNode.data, 'color', this.data.color);
          }
        }
      }
      else {
        this.setalertdate1();
        check = false;
        //Reset Values if Release Date is later than Shutdown Date
        this.editForm.setValue({
          releaseDate: this.selectedNode.data.releaseDate,
          shutdownDate: this.selectedNode.data.shutdownDate
        }
        )
      }
    }
    if (this.selectedNode.data.shutdownDate != this.data.shutdownDate) {
      const str = this.data.releaseDate;
      const words = str.split(".");
      const strShut = this.data.shutdownDate;
      const wordsShut = strShut.split(".");
      const strTest = this.today.toLocaleDateString();
      const Test = strTest.split(".");


      if (parseInt(Test[0]) < 10) {
        Test[0] = "0" + Test[0];
      }
      if (parseInt(Test[1]) < 10) {
        Test[1] = "0" + Test[1];
      }
      const temp = Test[0] + "." + Test[1] + "." + Test[2];
      const wordsTest = temp.split(".");

      //Checking if Shutdown Date is in Past, Future or Current and assigning Color to the nodes wheter its in future or not...
      if (words[2] < wordsShut[2] || words[2] == wordsShut[2] && words[1] < wordsShut[1]
        || words[2] == wordsShut[2] && words[1] == wordsShut[1] && words[0] <= wordsShut[0]) {
        this.model.set(this.selectedNode.data, 'shutdownDate', this.data.shutdownDate);
        check = true;
        if (wordsTest[2] > wordsShut[2] || wordsTest[2] == wordsShut[2] && wordsTest[1] > wordsShut[1]
          || wordsTest[2] == wordsShut[2] && wordsTest[1] == wordsShut[1] && wordsTest[0] > wordsShut[0]) {
          this.data.color = "red";
          this.model.set(this.selectedNode.data, 'color', this.data.color);
        } else {
          if (wordsTest[2] < words[2] || wordsTest[2] == words[2] && wordsTest[1] < words[1]
            || wordsTest[2] == words[2] && wordsTest[1] == words[1] && wordsTest[0] < words[0]) {
            this.data.color = "yellow";
            this.model.set(this.selectedNode.data, 'color', this.data.color);
          } else {
            this.data.color = "lightblue";
            this.model.set(this.selectedNode.data, 'color', this.data.color);
          }
        }
      }
      else {
        //Reset Values if Shutdown Date is earlier than Release Date
        this.setalertdate2();
        check = false;
        this.editForm.setValue({
          releaseDate: this.selectedNode.data.releaseDate,
          shutdownDate: this.selectedNode.data.shutdownDate
        }
        )
      }
    }
    if (check == true) {
      this.setalertappupdated();
    }
    this.model.commitTransaction();

  }

  //Creating a Formgroup for the Node and Data Object and setting required Input or if Input is required
  //Like you can see that for the nodes each property needs an input except the version
  editData: FormGroup;
  editForm: FormGroup;
  constructor(private formBuilder: FormBuilder, public crudservice: CrudService) {
    this.editForm = formBuilder.group(
      {
        key: ['', Validators.required],
        name: ['', Validators.required],
        version: [''],
        cots: ['', Validators.required],
        desc: ['', Validators.required],
        //Setting the required Input for Release and Shutdown Date
        releaseDate: ['', [Validators.required, Validators.pattern('(0[1-9]|1[0-9]|2[0-9]|3[01]).(0[1-9]|1[012]).[0-9]{4}')]],
        shutdownDate: ['', [Validators.required, Validators.pattern('(0[1-9]|1[0-9]|2[0-9]|3[01]).(0[1-9]|1[012]).[0-9]{4}')]]
      }
    )
    this.editData = formBuilder.group(
      {
        dataobject: ['', Validators.required],
        personalData: [''],
        description: ['']
      }
    )

    document.addEventListener('click', function () {
      console.log('keys pressed');
    });
  }

  @Input()
  get selectedDataObject() { return this._selectedDataObject; }
  set selectedDataObject(dataobject: string) {
    this.dataobject = dataobject;
  }

  public myFunction() {
    this.DataObjectListe = "block";
    this.ChooseDataObject = "none";
    var modelAsText2 = this.model.toJson();
    var jsonDataObjects2 = JSON.parse(modelAsText2);

    var DropdownList = (document.getElementById("mySelect")) as HTMLSelectElement;
    if (DropdownList != null) {
      while (DropdownList.options.length > 0) {
        DropdownList.remove(0); //To let the Dropdown Menu disappear
      }
    }
    for (var i = 0; i < jsonDataObjects2.linkDataArray.length; i++) {

      for (var y = 1; y < jsonDataObjects2.linkDataArray.length; y++) {
        if (i != y) {

          if (jsonDataObjects2.linkDataArray[i].dataobject != jsonDataObjects2.linkDataArray[y].dataobject) {
            console.log(i + "+" + y)
            break;
          }
        }
      }
    }
    var el = document.createElement("option");
    el.disabled = true;
    el.text = "Select Data Object";
    el.selected = true;
    DropdownList.add(el);
    if (jsonDataObjects2.linkDataArray[0].dataobject != null) {
      for (var i = 0; i < jsonDataObjects2.linkDataArray.length; i++) {
        var opt = jsonDataObjects2.linkDataArray[i].dataobject;
        var el = document.createElement("option");
        el.text = opt;
        el.value = opt;
        DropdownList.add(el);
        DropdownList[0].remove;
        console.log(DropdownList[0]);
      }
    }
    //Doppelte Data Objects werden im Dropwdown damit nicht angezeigt / entfernt
    
    //Redundant Data Objects are removed from the Dropdown Menu
    var fruits = DropdownList;
    [].slice.call(fruits.options)
      .map(function (a) {
        if (this[a.value]) {
          fruits.removeChild(a);
        } else {
          this[a.value] = 1;
        }
      }, {});

  }

  public onChange($event, deviceValue) {
    var modelAsText = this.model.toJson();
    var jsonDataObjects = JSON.parse(modelAsText);
    for (var i = 0; i < jsonDataObjects.linkDataArray.length; i++) {
      if (jsonDataObjects.linkDataArray[i].dataobject == deviceValue) {
        this.LinkData.dataobject = jsonDataObjects.linkDataArray[i].dataobject;
        this.LinkData.description = jsonDataObjects.linkDataArray[i].description;
        this.LinkData.personalData = jsonDataObjects.linkDataArray[i].personalData;
        this.LinkData.text = jsonDataObjects.linkDataArray[i].dataobject;
      }
    }
  }
  public resetDropdown() {
    var DropdownList = (document.getElementById("mySelect")) as HTMLSelectElement;
    while (DropdownList.options.length > 0) {
      DropdownList.remove(0);

    }
  }

  //EXPORT DATAOBJECTS
  public exportDataObjects() {
    var modelAsText = this.model.toJson();
    var jsonDataObjects = JSON.parse(modelAsText);
    var DataObjectsAScsv = [{ dataobject: jsonDataObjects.linkDataArray[0].dataobject, description: jsonDataObjects.linkDataArray[0].description, personalData: jsonDataObjects.linkDataArray[0].personalData }];
    for (var i = 1; i < jsonDataObjects.linkDataArray.length; i++) {
      function addItem(item) { //No duplicates are exported
        var index = DataObjectsAScsv.findIndex(x => x.dataobject == item.dataobject)
        if (index === -1) {
          DataObjectsAScsv.push(item);
        } else {
          console.log("object already exists")
        }
      }
      var item = { dataobject: jsonDataObjects.linkDataArray[i].dataobject, description: jsonDataObjects.linkDataArray[i].description, personalData: jsonDataObjects.linkDataArray[i].personalData };
      addItem(item);
    }
    CsvDataService.exportToCsv('DataObjects.csv', DataObjectsAScsv);
  };
  //EXPORT DATAOBJECTS
  //EXPORT APPLICATIONS
  public exportApplications() {
    var modelAsText = this.model.toJson();
    var jsonDataObjects = JSON.parse(modelAsText);

    var ApplicationsAScsv = [{ name: jsonDataObjects.nodeDataArray[0].name, version: jsonDataObjects.nodeDataArray[0].version, key: jsonDataObjects.nodeDataArray[0].key, desc: jsonDataObjects.nodeDataArray[0].desc, cots: jsonDataObjects.nodeDataArray[0].cots, releaseDate: jsonDataObjects.nodeDataArray[0].releaseDate, shutdownDate: jsonDataObjects.nodeDataArray[0].shutdownDate }];
    for (var i = 1; i < jsonDataObjects.nodeDataArray.length; i++) {
      ApplicationsAScsv.push({ name: jsonDataObjects.nodeDataArray[i].name, version: jsonDataObjects.nodeDataArray[i].version, key: jsonDataObjects.nodeDataArray[i].key, desc: jsonDataObjects.nodeDataArray[i].desc, cots: jsonDataObjects.nodeDataArray[i].cots, releaseDate: jsonDataObjects.nodeDataArray[i].releaseDate, shutdownDate: jsonDataObjects.nodeDataArray[i].shutdownDate });
    }
    CsvDataService.exportToCsv('Applications.csv', ApplicationsAScsv);
  };
  //EXPORT APPLICATIONS
  public customizeDataObject() {
    this.DataObjectSehen = "none";
    this.AppSehen = "none";
    this.DataObjectCustomize = 'block';
    this.DataObjectCreate = "none";

    var modelAsText2 = this.model.toJson();
    var jsonDataObjects2 = JSON.parse(modelAsText2);
    var DropdownList = (document.getElementById("mySelect2")) as HTMLSelectElement;
    while (DropdownList.options.length > 0) {

      DropdownList.remove(0);
    }

    for (var i = 0; i < jsonDataObjects2.linkDataArray.length; i++) {

      for (var y = 1; y < jsonDataObjects2.linkDataArray.length; y++) {
        if (i != y) {


          if (jsonDataObjects2.linkDataArray[i].dataobject != jsonDataObjects2.linkDataArray[y].dataobject) {
            console.log(i + "+" + y)
            break;
          }
        }
      }
    }
    var el = document.createElement("option");
    el.disabled = true;
    el.text = "Select Data Object";
    el.selected = true;
    DropdownList.add(el);
    for (var i = 0; i < jsonDataObjects2.linkDataArray.length; i++) {
      var opt = jsonDataObjects2.linkDataArray[i].dataobject;
      var el = document.createElement("option");
      el.text = opt;
      el.value = opt;
      DropdownList.add(el);
      DropdownList[0].remove;
      console.log(DropdownList[0]);
    }
    //Doppelte Data Objects werden im Dropwdown damit nicht angezeigt / entfernt

    //Redundant Data Objects are removed from Drop Down Menu
    var fruits = DropdownList;
    [].slice.call(fruits.options)
      .map(function (a) {
        if (this[a.value]) {
          fruits.removeChild(a);
        } else {
          this[a.value] = 1;
        }
      }, {});

  }
  //Method to show the the Created Data Object
  public showCreateDataObject() {
    this.DataObjectCreate = "block";
    this.DataObjectSehen = "none";
    this.AppSehen = "none";
    this.DataObjectCustomize = 'none';

    this.LinkData.dataobject = null;
    this.LinkData.personalData = null;
    this.LinkData.description = null;
    this.LinkData.from = null;
    this.LinkData.to = null;
    this.LinkData.text = null;
  }
  //Method to Create the Data Object
  public createDataObject() {

    if (this.LinkData.personalData == null) {
      this.LinkData.personalData = false; 
    }
    var newDataObject =
      { text: this.LinkData.dataobject, description: this.LinkData.description, personalData: this.LinkData.personalData, dataobject: this.LinkData.dataobject };

    if (this.model instanceof go.GraphLinksModel) {
      this.model.addLinkData(newDataObject);
    }

    if (this.LinkData.dataobject != null) {
    }


    this.crudservice.create_NewDataObject(newDataObject);
  }

  //Method to remove Link Conncetions
  public removeLinkConnection() {
    var modelAsText = this.model.toJson();
    var jsonDataObjects = JSON.parse(modelAsText);

    if (this.model instanceof go.GraphLinksModel) {
      for (var z = 0; z < this.model.linkDataArray.length + 5; z++) { //Falls doppelte DataObjects kommen +5 erhöhen !
        this.model.removeLinkDataCollection(this.model.linkDataArray);

      }
      this.DataObjectCreate = "none";
      this.DataObjectSehen = 'none';

      for (var i = 0; i < jsonDataObjects.linkDataArray.length; i++) {

        if (jsonDataObjects.linkDataArray[i].dataobject == this.LinkData.dataobject && jsonDataObjects.linkDataArray[i].from == this.LinkData.from && jsonDataObjects.linkDataArray[i].to == this.LinkData.to) {
          jsonDataObjects.linkDataArray[i] = null;
        }
      }

      this.DataObjectSehen = 'none';
      this.DataObjectCustomize = 'none';
      this.model.addLinkDataCollection(jsonDataObjects.linkDataArray);
    }
    this.crudservice.delete_LinkConnection(this.LinkData);
  }
  public removeDataObject() {

    var modelAsText = this.model.toJson();
    var jsonDataObjects = JSON.parse(modelAsText);

    if (this.model instanceof go.GraphLinksModel) {
      for (var z = 0; z < this.model.linkDataArray.length + 5; z++) { //Falls doppelte DataObjects kommen +5 erhöhen !
        this.model.removeLinkDataCollection(this.model.linkDataArray);

      }
      this.DataObjectCreate = "none";
      this.DataObjectSehen = 'none';
      for (var i = 0; i < jsonDataObjects.linkDataArray.length; i++) {
        if (jsonDataObjects.linkDataArray[i].dataobject == this.LinkData.dataobject) {
          jsonDataObjects.linkDataArray[i] = null;
        }
      }
      this.DataObjectSehen = 'none';
      this.DataObjectCustomize = 'none';
      this.model.addLinkDataCollection(jsonDataObjects.linkDataArray);
    }

    this.crudservice.delete_DataObject(this.LinkData.dataobject);
  }

  //Method for Close Button
  public closeWindows() {
    this.AppSehen = 'none';
    this.DataObjectSehen = 'none';
    this.DataObjectCustomize = 'none';
    this.DataObjectListe = "none";
    this.ChooseDataObject = "none";
    this.DataObjectCreate = "none";
  }
}

// Close the dropdown if the user clicks outside of it
window.onclick = function (event) {
  if (!event.target.matches('.dropbtn')) {
    var dropdowns = document.getElementsByClassName("dropdown-content");
    var i;
    for (i = 0; i < dropdowns.length; i++) {
      var openDropdown = dropdowns[i];
      if (openDropdown.classList.contains('show')) {
        openDropdown.classList.remove('show');
      }
    }
  }
}

