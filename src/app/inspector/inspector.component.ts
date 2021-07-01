import { DOCUMENT } from '@angular/common';
import { ThisReceiver } from '@angular/compiler';
import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, NgForm, Validators } from '@angular/forms';
import { CsvDataService } from '../csv/csv-data.service';
import * as go from 'gojs';



@Component({
  selector: 'app-inspector',
  templateUrl: './inspector.component.html',
  styleUrls: ['./inspector.component.css']
})
export class InspectorComponent implements OnInit {

  public _selectedNode: go.Node;
  public _selectedLink: go.Link;
  public _selectedDataObject: string;


  public dataobject: string;

  public options = {
    text: "testi",
  }

  public LinkDataArray: Object[] = [
    { from: "1", to: "2", description: "hello!", personalData: true, dataobject: "Data Object 4" },
    { from: "2", to: "3", description: "hello2!", personalData: false, dataobject: "Data Object 5" },
    { from: "3", to: "1", description: "hello3!, blablablablalblalsffsal", personalData: false, dataobject: "Data Object 6" }
  ];

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

  AppSehen = 'none';
  DataObjectSehen = 'none';
  DataObjectCustomize = 'none';
  DataObjectListe = "none";
  ChooseDataObject = "";

  @Input()
  public model: go.Model;

  @Input()
  get selectedLink() { return this._selectedLink; }
  set selectedLink(link: go.Link) {
    if (link) {

      this.DataObjectSehen = 'block';
      this.AppSehen = 'none';
      this.DataObjectCustomize = 'none';
      this.DataObjectListe = "none";
      this.ChooseDataObject = "";

      this._selectedLink = link;
      console.log("LINKizzzDA")
      ////////////  this.myFunction();///////////////////////////////////
      //this.data.fromi = this._selectedLink.data.fromi;
      this.LinkData.dataobject = this._selectedLink.data.dataobject;
      this.LinkData.personalData = this._selectedLink.data.personalData;
      this.LinkData.description = this._selectedLink.data.description;
      this.LinkData.from = this._selectedLink.data.from;
      this.LinkData.to = this._selectedLink.data.to;
      this.LinkData.text = this._selectedLink.data.text;

      var DropdownList = (document.getElementById("mySelect")) as HTMLSelectElement;
      while (DropdownList.options.length > 0) {
        DropdownList.remove(0); //Damit Dropdown verschwindet mäßig
      }
    }
    else {
      this.DataObjectSehen = 'none'; //Damit wenn man leer klickt beide verschwinden
      this.AppSehen = 'none'; //Damit wenn man leer klickt beide verschwinden
      this.DataObjectCustomize = 'none';
    }
  }

  today = new Date();
  @Input()
  get selectedNode() { return this._selectedNode; }
  set selectedNode(node: go.Node) {
    if (node) {

      this.AppSehen = 'block';
      this.DataObjectSehen = 'none';
      this.DataObjectCustomize = 'none';

      this._selectedNode = node;
      this.data.key = this._selectedNode.data.key;
      this.data.name = this._selectedNode.data.name;
      this.data.version = this._selectedNode.data.version;
      this.data.desc = this._selectedNode.data.desc;
      this.data.cots = this._selectedNode.data.cots;
      this.data.releaseDate = this._selectedNode.data.releaseDate;
      this.data.shutdownDate = this._selectedNode.data.shutdownDate;
      this.data.color = this._selectedNode.data.color;
      console.log("NODEizDA");
    } else {
      this.AppSehen = 'none';//Damit wenn man leer klickt beide verschwinden
      this.DataObjectSehen = 'none'; //Damit wenn man leer klickt beide verschwinden
      this.DataObjectCustomize = 'none';
    }
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



  }

  public changeDataObject() {


    var modelAsText = this.model.toJson();
    var jsonDataObjects = JSON.parse(modelAsText);

    //var jsonDataObjects = JSON.parse(this.dataobject);
    console.log("txt:" + this.dataobject);
    if (this.model instanceof go.GraphLinksModel) {
      for (var z = 0; z < this.model.linkDataArray.length + 5; z++) { //Falls doppelte DataObjects kommen +5 erhöhen !
        this.model.removeLinkDataCollection(this.model.linkDataArray);

      }

      this.DataObjectSehen = 'none';

      // this.model.addLinkDataCollection(this.LinkDataArray); 
      for (var i = 0; i < jsonDataObjects.linkDataArray.length; i++) {

        if (jsonDataObjects.linkDataArray[i].dataobject == this.LinkData.dataobject) {
          //jsonDataObjects.linkDataArray[i].dataobject=this.LinkData.dataobject;
          jsonDataObjects.linkDataArray[i].personalData = this.LinkData.personalData;
          jsonDataObjects.linkDataArray[i].description = this.LinkData.description;
          jsonDataObjects.linkDataArray[i].text = this.LinkData.text;
        }
        console.log("test:" + i + jsonDataObjects.linkDataArray[i].dataobject);
      }


      //jsonDataObjects['linkDataArray'].push({"from":this.LinkData.from,"to":this.LinkData.to,"dataobject":this.LinkData.dataobject,"personalData":this.LinkData.personalData,"description":this.LinkData.description});


      this.model.addLinkDataCollection(jsonDataObjects.linkDataArray);
    }
  }



  public onCommitForm() {
    this.model.startTransaction();
    if (this.selectedNode.data.key != this.data.key) {
      var keepGoing = true;
      this.model.nodeDataArray.forEach(element => {
        if (keepGoing) {
          if (element.key == this.data.key) {
            keepGoing = false;
            alert("Update not possible there is already an existing Object with that key!");
            this.editForm.setValue({
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
      this.model.set(this.selectedNode.data, 'key', this.data.key);
    }
    if (this.selectedNode.data.name != this.data.name) {
      this.model.set(this.selectedNode.data, 'name', this.data.name);
    }
    if (this.selectedNode.data.version != this.data.version) {
      this.model.set(this.selectedNode.data, 'version', this.data.version);
    }
    if (this.selectedNode.data.desc != this.data.desc) {
      this.model.set(this.selectedNode.data, 'desc', this.data.desc);
    }
    if (this.selectedNode.data.cots != this.data.cots) {
      this.model.set(this.selectedNode.data, 'cots', this.data.cots);
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
        alert("Release Date can´t be later than Shutdown Date!");
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
        alert("Shutdown Date can´t be earlier than Release Date!");
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
    this.model.commitTransaction();
  }

  editData: FormGroup;
  editForm: FormGroup;
  constructor(private formBuilder: FormBuilder) {
    this.editForm = formBuilder.group(
      {
        key: ['', Validators.required],
        name: ['', Validators.required],
        version: [''],
        cots: [''],
        desc: ['', Validators.required],
        releaseDate: ['', [Validators.required, Validators.pattern('(0[1-9]|1[0-9]|2[0-9]|3[01]).(0[1-9]|1[012]).[0-9]{4}')]],
        shutdownDate: ['', [Validators.required, Validators.pattern('(0[1-9]|1[0-9]|2[0-9]|3[01]).(0[1-9]|1[012]).[0-9]{4}')]]
      }
    )
    this.editData = formBuilder.group(
      {
        dataobject: [''],
        personalData: [''],
        description: ['']
      }
    )
  }




  @Input()
  get selectedDataObject() { return this._selectedDataObject; }
  set selectedDataObject(dataobject: string) {


    this.dataobject = dataobject;
  }

  public myFunction() {
    this.DataObjectListe = "block";
    this.ChooseDataObject = "none";
    // console.log("DUKLEINERhs"+test)
    var modelAsText2 = this.model.toJson();
    var jsonDataObjects2 = JSON.parse(modelAsText2);
    console.log("superwichtigerTest" + jsonDataObjects2.linkDataArray[0].dataobject)


    //var jsonDataObjects = JSON.parse(this.dataobject);

    // console.log("dataooooobject="+jsonDataObjects.linkDataArray[0].dataobject)
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
            //delete jsonDataObjects.linkDataArray[i]
          }
        }
      }




    }
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
    //console.log(deviceValue); //device Value zb Data Object 1
    var modelAsText = this.model.toJson();
    var jsonDataObjects = JSON.parse(modelAsText);
    //var jsonDataObjects = JSON.parse(this.dataobject);
    //console.log("supertest"+jsonDataObjects.linkDataArray[0].dataobject);
    for (var i = 0; i < jsonDataObjects.linkDataArray.length; i++) {
      if (jsonDataObjects.linkDataArray[i].dataobject == deviceValue) {
        this.LinkData.dataobject = jsonDataObjects.linkDataArray[i].dataobject;
        this.LinkData.description = jsonDataObjects.linkDataArray[i].description;
        this.LinkData.personalData = jsonDataObjects.linkDataArray[i].personalData;
        this.LinkData.text = jsonDataObjects.linkDataArray[i].text;
        //break; ohne break nimmt er immer den neusten dataobject ausm array
      }

    }
  }
  public resetDropdown() {
    var DropdownList = (document.getElementById("mySelect")) as HTMLSelectElement;
    while (DropdownList.options.length > 0) {
      DropdownList.remove(0);

    }
  }

  //EXPORT
  //const btnDataOb: HTMLElement = document.getElementById('exportDataObjects');
  public exportDataObjectz() {
    var modelAsText = this.model.toJson();
    var jsonDataObjects = JSON.parse(modelAsText);
    var DataObjectsAScsv = [{ dataobject: jsonDataObjects.linkDataArray[0].dataobject, description: jsonDataObjects.linkDataArray[0].description, personalData: jsonDataObjects.linkDataArray[0].personalData }];
    for (var i = 1; i < jsonDataObjects.linkDataArray.length; i++) {
      DataObjectsAScsv.push({ dataobject: jsonDataObjects.linkDataArray[i].dataobject, description: jsonDataObjects.linkDataArray[i].description, personalData: jsonDataObjects.linkDataArray[i].personalData });
    }

    CsvDataService.exportToCsv('DataObjects.csv', DataObjectsAScsv);
  };
  //EXPORT

  public customizeDataObject() {
    this.DataObjectSehen = "none";
    this.AppSehen = "none";
    this.DataObjectCustomize = 'block';





    console.log("duHS")

    var modelAsText2 = this.model.toJson();
    var jsonDataObjects2 = JSON.parse(modelAsText2);
    console.log("superwichtigerTest" + jsonDataObjects2.linkDataArray[0].dataobject)


    //var jsonDataObjects = JSON.parse(this.dataobject);

    // console.log("dataooooobject="+jsonDataObjects.linkDataArray[0].dataobject)
    var DropdownList = (document.getElementById("mySelect2")) as HTMLSelectElement;
    while (DropdownList.options.length > 0) {
      DropdownList.remove(0); //Damit Dropdown verschwindet mäßig
    }

    for (var i = 0; i < jsonDataObjects2.linkDataArray.length; i++) {

      for (var y = 1; y < jsonDataObjects2.linkDataArray.length; y++) {
        if (i != y) {


          if (jsonDataObjects2.linkDataArray[i].dataobject != jsonDataObjects2.linkDataArray[y].dataobject) {
            console.log(i + "+" + y)
            break;
            //delete jsonDataObjects.linkDataArray[i]
          }
        }
      }
    }
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



  ngOnInit(): void {
  }

}