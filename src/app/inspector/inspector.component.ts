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

  public LinkData = {
    dataobject: null,
    personalData: false,
    description: null,
    from: null,
    to: null,
    text: null
  }

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
    Application['desc'] = "";
    Application['color'] = "lightblue";
    Application['cots'] = "cots";
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

  resetalert() {
    this.AppSehen = 'block';
    this.DataObjectSehen = 'none';
    this.DataObjectCustomize = 'none';
    this.DataObjectCreate = "none";
    this.AlertSehen = "none";
    this.AlertSehenDate1 = 'none';
    this.AlertSehenDate2 = 'none';
  }

  setalert() {
    this.AppSehen = 'none';
    this.DataObjectSehen = 'none';
    this.DataObjectCustomize = 'none';
    this.DataObjectCreate = "none";
    this.AlertSehen = "block";
  }
  setalertdate1() {
    this.AppSehen = 'none';
    this.DataObjectSehen = 'none';
    this.DataObjectCustomize = 'none';
    this.DataObjectCreate = "none";
    this.AlertSehenDate1 = "block";
  }
  setalertdate2() {
    this.AppSehen = 'none';
    this.DataObjectSehen = 'none';
    this.DataObjectCustomize = 'none';
    this.DataObjectCreate = "none";
    this.AlertSehenDate2 = "block";
  }
  setalertcreate() {
    this.AppSehen = 'none';
    this.DataObjectSehen = 'none';
    this.DataObjectCustomize = 'none';
    this.DataObjectCreate = "none";
    this.AlertSehenCreate = 'block';
  }
  resetalertcreate() {
    this.AppSehen = 'none';
    this.DataObjectSehen = 'none';
    this.DataObjectCustomize = 'none';
    this.DataObjectCreate = "none";
    this.AlertSehenCreate = 'none';
  }
  setalertappdelete() {
    this.AppSehen = 'none';
    this.DataObjectSehen = 'none';
    this.DataObjectCustomize = 'none';
    this.DataObjectCreate = "none";
    this.AlertSehenAppDelete = 'block';
  }
  resetalertappdelete() {
    this.AppSehen = 'none';
    this.DataObjectSehen = 'none';
    this.DataObjectCustomize = 'none';
    this.DataObjectCreate = "none";
    this.AlertSehenAppDelete = 'none';
  }
  setalertdataobjectchange() {
    this.AppSehen = 'none';
    this.DataObjectSehen = 'none';
    this.DataObjectCustomize = 'none';
    this.DataObjectCreate = "none";
    this.AlertSehenDataChange = 'block';
  }
  resetalertdataobjectchange() {
    this.AppSehen = 'none';
    this.DataObjectSehen = 'none';
    this.DataObjectCustomize = 'block';
    this.DataObjectCreate = "none";
    this.AlertSehenDataChange = 'none';
  }
  setalertcreatedata() {
    this.AppSehen = 'none';
    this.DataObjectSehen = 'none';
    this.DataObjectCustomize = 'none';
    this.DataObjectCreate = "none";
    this.AlertSehenCreateData = 'block';
  }
  resetalertcreatedata() {
    this.AppSehen = 'none';
    this.DataObjectSehen = 'none';
    this.DataObjectCustomize = 'none';
    this.DataObjectCreate = "none";
    this.AlertSehenCreateData = 'none';
  }
  setalertappupdated() {
    this.AppSehen = 'none';
    this.DataObjectSehen = 'none';
    this.DataObjectCustomize = 'none';
    this.DataObjectCreate = "none";
    this.AlertSehenAppUpdated = 'block';
  }
  resetalertappupdated() {
    this.AppSehen = 'block';
    this.DataObjectSehen = 'none';
    this.DataObjectCustomize = 'none';
    this.DataObjectCreate = "none";
    this.AlertSehenAppUpdated = 'none';
  }

  setalertdataobjectdelete() {
    this.AppSehen = 'none';
    this.DataObjectSehen = 'none';
    this.DataObjectCustomize = 'none';
    this.DataObjectCreate = "none";
    this.AlertSehenDataDelete = 'block';
  }
  resetalertdataobjectdelete() {
    this.AppSehen = 'none';
    this.DataObjectSehen = 'none';
    this.DataObjectCustomize = 'none';
    this.DataObjectCreate = "none";
    this.AlertSehenDataDelete = 'none';
  }

  downloadFile() {
    let link = document.createElement("a");
    link.download = "GettingStarted";
    link.href = "assets/GettingStarted.pdf";
    link.click();
  }

  downloadXLS() {
    let link = document.createElement("a");
    link.download = "Excel Template";
    link.href = "assets/ExcelTemplate.xlsx";
    link.click();
  }

  public cancelChangesData() {
    this.editData.setValue(
      {
        dataobject: this.selectedLink.data.dataobject,
        personalData: this.selectedLink.data.personalData,
        description: this.selectedLink.data.description
      }
    )
  }

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
            this.editForm.setValue({ //wenn key net upgedated werden kann wird auf stanni zurückgesetzt
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
        }
      }
      )
      if (keepGoing == true) {
        check = true;
      }
      this.model.set(this.selectedNode.data, 'key', this.data.key);
      console.log(check);
    }
    if (this.selectedNode.data.name != this.data.name) {
      this.model.set(this.selectedNode.data, 'name', this.data.name);
      check = true;
      console.log(check);
    }
    if (this.selectedNode.data.version != this.data.version) {
      this.model.set(this.selectedNode.data, 'version', this.data.version);
      check = true;
      console.log(check);
    }
    if (this.selectedNode.data.desc != this.data.desc) {
      this.model.set(this.selectedNode.data, 'desc', this.data.desc);
      check = true;
      console.log(check);
    }
    if (this.selectedNode.data.cots != this.data.cots) {
      this.model.set(this.selectedNode.data, 'cots', this.data.cots);
      check = true;
      console.log(check);
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
        this.editForm.setValue({
          key: this.data.key,
          name: this.data.name,
          version: this.data.version,
          desc: this.data.desc,
          cots: this.data.cots,
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
        this.setalertdate2();
        this.editForm.setValue({
          key: this.data.key,
          name: this.data.name,
          version: this.data.version,
          desc: this.data.desc,
          cots: this.data.cots,
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
        DropdownList.remove(0); //Damit Dropdown verschwindet mäßig
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
      function addItem(item) { //durch das ganze hier werden keine duplikate exportiert (CSV)
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
    // <option disabled selected value> -- select an option -- </option>
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
  public createDataObject() {

    if (this.LinkData.personalData == null) {
      this.LinkData.personalData = false; //sonst ist personalData = null (wenn nicht gechecked)
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

