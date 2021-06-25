import { Component, Output, EventEmitter } from '@angular/core';
import * as go from 'gojs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  //title = 'Landscape-App';

  public selectedNode = null;
  public selectedLink = null;
  public selectedDataObject = null;

  message:string;

  receiveMessage($event) {
    this.message = $event
    
    console.log("Schnecke")
  };


  public NodeDataArray: Object[] = [ { key: "1", name: "Application 1", version: "1.0", desc: "Test Beschreibung", cots: "COTS", releaseDate: "08.05.2021", shutdownDate: "06.05.2023", color: "lightblue", shutdate2: new Date("07/30/2026") },
  { key: "2", name: "Application 2", version: "2.0", desc: "Test Beschreibung", cots: "COTS", releaseDate: "08.05.2021", shutdownDate: "05.09.2022", color: "lightblue", shutdate2: new Date("05/29/2022") },
  { key: "3", name: "Application 3", version: "3.0", desc: "Test Beschreibung", cots: "COTS", releaseDate: "08.05.2021", shutdownDate: "30.06.2021", color: "lightblue", shutdate2: new Date("06/30/2021") },
]

  
    

public LinkDataArray: Object[] = [
  { from: "1", to: "2", description: "hello!", personalData: true, dataobject: "Data Object 1" },
  { from: "2", to: "3" , description: "hello2!", personalData: false, dataobject: "Data Object 2" },
  { from: "3", to: "1" , description: "hello3!, blablablablalblalsffsal", personalData: false, dataobject: "Data Object 3" }
];

  public model: go.GraphLinksModel = new go.GraphLinksModel(this.NodeDataArray,this.LinkDataArray);

 
  

public setDataObject(dataobject){
  this.selectedDataObject = dataobject;
  //console.log("test"+dataobject);
}
  
  public setSelectedLink(link)
  {
    this.selectedLink = link;
  }

  public setSelectedNode(node)
  {
    this.selectedNode = node;
  }

}
