import { Component, Output, EventEmitter } from '@angular/core';
import * as go from 'gojs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {

  public selectedNode = null;
  public selectedLink = null;
  public selectedDataObject = null;
  public selectedLocation = null;

  message:string;

  receiveMessage($event) {
    this.message = $event
  };

  public NodeDataArray: Object[] = [];  

  public LinkDataArray: Object[] = [];

  public model: go.GraphLinksModel = new go.GraphLinksModel(this.NodeDataArray,this.LinkDataArray);

  public setDataObject(dataobject){
  this.selectedDataObject = dataobject;
}
  
  public setSelectedLink(link)
  {
    this.selectedLink = link;
  }

  public setSelectedNode(node)
  {
    this.selectedNode = node;
  }

  public setLocation(location)
  {
    this.selectedLocation = location;
  }
}
