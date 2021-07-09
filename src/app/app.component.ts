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
  public selectedLocation = null;

  message:string;

  receiveMessage($event) {
    this.message = $event
    
  
  };


  public NodeDataArray: Object[] = [ 
  // { key: "1", name: "Access", version: "1.0", desc: "Access is a software program from Microsoft. Like Word, Excel and PowerPoint, Access can be purchased separately or as part of Microsoft's complete Office packageWith Access you can mainly create and manage database applications. Great programming skills are not required. Even laymen can use the software after a briefing.The databases can be created both as apps for the PC and as applications for the browser. After creation, you can make databases accessible to all desired colleagues",
  //  cots: "COTS", releaseDate: "17.06.2019", shutdownDate: "06.05.2022", color: "lightblue" },
  // { key: "2", name: "Hemingway Editor", version: "2.0", desc: "The app highlights lengthy, complex sentences and common errors; if you see a yellow sentence, shorten or split it. If you see a red highlight, your sentence is so dense and complicated that your readers will get lost trying to follow its meandering, splitting logic — try editing this sentence to remove the red. You can utilize a shorter word in place of a purple one. Mouse over them for hints. Adverbs and weakening phrases are helpfully shown in blue. Get rid of them and pick words with force, perhaps. Phrases in green have been marked to show passive voice. You can format your text with the toolbar. Paste in something you're working on and edit away. Or, click the Write button and compose something new.  ", 
  // cots: "COTS", releaseDate: "08.03.2021", shutdownDate: "05.09.2022", color: "lightblue" },
  // { key: "3", name: "Adobe InDesign", version: "3.0", desc: "Adobe InDesign is a professional layout and typesetting program for desktop publishing, initially developed by Aldus under the project name K2. After the acquisition of Aldus by Adobe, it was built as a competitor to QuarkXPress. InDesign is the successor to Adobe PageMaker, which was also originally developed by Aldus and purchased by Adobe, but was discontinued in its form. From version 3.0 onwards, the program was part of the Creative Suite and bore its version numbering as a name suffix until CS6  ", 
  // cots: "COTS", releaseDate: "25.01.2020", shutdownDate: "30.06.2022", color: "lightblue" },
]

  
    

public LinkDataArray: Object[] = [
  // { text: "Data Object 1", from: "1", to: "2", description: "Description", personalData: true, dataobject: "Data Object 1" },
  // { text: "Data Object 2",from: "2", to: "3" , description: "Description!", personalData: false, dataobject: "Data Object 2" },
  // { text: "Data Object 3", from: "3", to: "1" , description: "Description", personalData: false, dataobject: "Data Object 3" }
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

  public setLocation(location)
  {
    this.selectedLocation = location;
  }

}
