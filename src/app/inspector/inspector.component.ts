import { DOCUMENT } from '@angular/common';
import { ThisReceiver } from '@angular/compiler';
import { Component, Input, OnInit } from '@angular/core';
import { FormControl,FormGroup,FormBuilder, NgForm, Validators } from '@angular/forms';
import { version } from 'xlsx/types';


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
  description: null
 
}

AppSehen = 'none';
DataObjectSehen = 'none';

@Input()
public model: go.Model;

@Input()
get selectedLink(){return this._selectedLink; }
set selectedLink(link: go.Link) 

{
  if(link){
    
    this.DataObjectSehen = 'block';
    this.AppSehen = 'none';
    this._selectedLink = link;

    console.log("LINKizzzDA", link.data)

//this.data.fromi = this._selectedLink.data.fromi;
this.LinkData.dataobject = this._selectedLink.data.dataobject;
this.LinkData.personalData = this._selectedLink.data.personalData;
this.LinkData.description = this._selectedLink.data.description;
}
else{

  this.DataObjectSehen = 'none'; //Damit wenn man leer klickt beide verschwinden
  this.AppSehen = 'none'; //Damit wenn man leer klickt beide verschwinden
}
}


@Input()
get selectedNode(){return this._selectedNode; }
set selectedNode(node: go.Node) 

{ 
  if(node){
  
    this.AppSehen = 'block';
    this.DataObjectSehen = 'none';
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
} else{
  this.AppSehen = 'none';//Damit wenn man leer klickt beide verschwinden
  this.DataObjectSehen = 'none'; //Damit wenn man leer klickt beide verschwinden
   
}

}
 public cancelChanges()
 {
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
 
public onCommitForm2(){
  this.model.startTransaction();
    this.model.set(this.selectedLink.data, 'dataobject', this.LinkData.dataobject);
    this.model.set(this.selectedLink.data, 'personalData', this.LinkData.personalData);
    this.model.set(this.selectedLink.data, 'description', this.LinkData.description);
    this.model.commitTransaction();
}

public onCommitForm()
  {
    this.model.startTransaction();

    if(this.selectedNode.data.key != this.data.key)
    {
      var keepGoing = true;
      this.model.nodeDataArray.forEach(element => {
        if(keepGoing)
        { 
        if( element.key == this.data.key )
           {
             keepGoing = false;
            //alert("Update not possible there is already an existing Object with that key!");
            this.editForm.setValue({
              key: this.selectedNode.data.key,
              name: this.data.name,
              version: this.data.version,
              desc: this.data.desc,
              cots: this.data.cots,
              releaseDate: this.data.releaseDate,
              shutdownDate: this.data.shutdownDate
            }
            )
            alert("Update not possible there is already an existing Object with that key!");
           }
         }
        }
        )
    this.model.set(this.selectedNode.data, 'key', this.data.key);          
    }
    else if(this.selectedNode.data.name != this.data.name)
    {
      this.model.set(this.selectedNode.data, 'name', this.data.name);  
    }
    else if(this.selectedNode.data.version != this.data.version)
    {
      this.model.set(this.selectedNode.data, 'version', this.data.version);
    }
    else if(this.selectedNode.data.desc != this.data.desc)
    {
      this.model.set(this.selectedNode.data, 'desc', this.data.desc);  
    }
    else if(this.selectedNode.data.cots != this.data.cots)
    {
      this.model.set(this.selectedNode.data, 'cots', this.data.cots);
    }
    else if(this.selectedNode.data.releaseDate != this.data.releaseDate)
    {
      const str = this.data.releaseDate;
      const words = str.split(".");
      const strShut = this.data.shutdownDate;
      const wordsShut = strShut.split(".");
      var temp = parseInt(words[1]);
      temp = temp + 1;
      
      if(words[2] < wordsShut[2] || words[2]==wordsShut[2] && words[1] < wordsShut[1] 
        || words[2] == wordsShut[2] && words[1] == wordsShut[1] && words[0] <= wordsShut[0])
      {
        this.model.set(this.selectedNode.data, 'releaseDate', this.data.releaseDate);
        if(words[1] == wordsShut[1] || parseInt(words[1])+1 == parseInt(wordsShut[1]) &&  parseInt(wordsShut[0]) - parseInt(words[0]) < 0 )
      {
        this.data.color = "red";
        this.model.set(this.selectedNode.data, 'color', this.data.color);
      }
      else
      {
        this.data.color = "lightblue";
        this.model.set(this.selectedNode.data, 'color', this.data.color);
      } 
      }
      else
      {
        alert("Release Date can´t be later than Shutdown Date!");
      }
    }
    else if(this.selectedNode.data.shutdownDate != this.data.shutdownDate)
    {
      const str = this.data.releaseDate;
      const words = str.split(".");
      const strShut = this.data.shutdownDate;
      const wordsShut = strShut.split(".");
      if(words[2] < wordsShut[2] || words[2]==wordsShut[2] && words[1] < wordsShut[1] 
        || words[2] == wordsShut[2] && words[1] == wordsShut[1] && words[0] <= wordsShut[0])
      {
        this.model.set(this.selectedNode.data, 'shutdownDate', this.data.shutdownDate);
        if(words[1] == wordsShut[1] || parseInt(words[1])+1 == parseInt(wordsShut[1]) &&  parseInt(wordsShut[0]) - parseInt(words[0]) < 0 )
      {
        this.data.color = "red";
        this.model.set(this.selectedNode.data, 'color', this.data.color);
      }
      else
      {
        this.data.color = "lightblue";
        this.model.set(this.selectedNode.data, 'color', this.data.color);
      } 
      }
      else
      {
        alert("Shutdown Date can´t be earlier than Release Date!");
      } 
    }
    this.model.commitTransaction();
  }


   editForm: FormGroup;
  constructor(private formBuilder: FormBuilder) { 
    this.editForm = formBuilder.group(
      {
        key: ['', Validators.required],
        name: ['', Validators.required],
        version: ['', Validators.required],
        cots: ['', Validators.required],
        desc: ['', Validators.required],
        releaseDate: ['',[Validators.required, Validators.pattern('(0[1-9]|1[0-9]|2[0-9]|3[01]).(0[1-9]|1[012]).[0-9]{4}')] ],
        shutdownDate: ['', [Validators.required, Validators.pattern('(0[1-9]|1[0-9]|2[0-9]|3[01]).(0[1-9]|1[012]).[0-9]{4}')]]
      }
    )
  }

  @Input()
get selectedDataObject(){return this._selectedDataObject; }
set selectedDataObject(dataobject: string) {
  
  this.dataobject = dataobject;
 


  }

  public myFunction() {
  
        var jsonDataObjects = JSON.parse(this.dataobject);

        console.log("dataooooobject="+jsonDataObjects.linkDataArray[0].dataobject)
    var DropdownList = (document.getElementById("mySelect")) as HTMLSelectElement;
    

  for(var i = 0; i < jsonDataObjects.linkDataArray.length; i++) {
    var y = 1;
    if(jsonDataObjects.linkDataArray[i].dataobject==jsonDataObjects.linkDataArray[y].dataobject){
      console.log(i+"+"+y)
    }
    if(y<jsonDataObjects.linkDataArray.length){
      y++;
    }
    
  }

    for(var i = 0; i < jsonDataObjects.linkDataArray.length; i++) {
      
      var opt = jsonDataObjects.linkDataArray[i].dataobject;
  
      var el = document.createElement("option");
      el.text = opt;
      el.value = opt;
  
      DropdownList.add(el);
      
  }​

  }

  public onChange($event, deviceValue) {
    console.log(deviceValue); //device Value zb Data Object 1

    var jsonDataObjects = JSON.parse(this.dataobject);
    console.log("supertest"+jsonDataObjects.linkDataArray[0].dataobject);
    for(var i = 0;i<jsonDataObjects.linkDataArray.length;i++){
      if(jsonDataObjects.linkDataArray[i].dataobject==deviceValue){
        this.LinkData.dataobject = jsonDataObjects.linkDataArray[i].dataobject;
        this.LinkData.description = jsonDataObjects.linkDataArray[i].description;
        this.LinkData.personalData = jsonDataObjects.linkDataArray[i].personalData;
        break;
      }
      
    }
  } 
  public resetDropdown(){
    var DropdownList = (document.getElementById("mySelect")) as HTMLSelectElement;
    while (DropdownList.options.length > 0) {                
      DropdownList.remove(0);
  
  }
  
}

  ngOnInit(): void {
  }

}