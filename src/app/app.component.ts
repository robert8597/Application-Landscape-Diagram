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

  public NodeDataArray: Object[] = [];  //Empty array for applications at startup -> it gets filled by database data
  public LinkDataArray: Object[] = []; //Empty array for data objects & link connections at startup -> it gets filled by database data

  public model: go.GraphLinksModel = new go.GraphLinksModel(this.NodeDataArray,this.LinkDataArray); //Empty arrays used to build diagram. Needed to use "model" to fill it with database data

  //Methods for transmitting selections(values) to other components
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
