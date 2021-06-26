import { Component, EventEmitter, Input, Output } from '@angular/core';
import * as go from 'gojs';
import * as x from 'convert-excel-to-json';
import { Application } from '../application';
import { CsvDataService } from '../csv/csv-data.service';

const $ = go.GraphObject.make;

@Component({
  selector: 'app-diagram',
  
  templateUrl: './diagram.component.html',
  styleUrls: ['./diagram.component.css']
})
export class DiagramComponent {

  public diagram: go.Diagram = null;


  @Input()
  public model: go.Model;

  @Output()
  public nodeClicked = new EventEmitter();

  @Output()
  public linkClicked = new EventEmitter();

  @Output()
  public dataobjectShow = new EventEmitter()

  public selectedNode = null;
  public selectedLink = null;

  constructor() {
  }

  message:Object[] = [ ];
   receiveMessage($event) {

    this.message = $event
   //this.model.addNodeData(this.message);
    this.model.addNodeDataCollection(this.message);
    
    console.log("TEST"+this.message[0].toString())
  }


 

  public ngAfterViewInit() {
    
    
    var $ = go.GraphObject.make;
    var myDiagram = 
      $(go.Diagram, "myDiagramDiv",
        { // allow double-click in background to create a new node
          //"clickCreatingTool.archetypeNodeData": { name: "Application", color: "lightblue" },
          // allow Ctrl-G to group
          "commandHandler.archetypeGroupData": { text: "Group", isGroup: true, },
          // have mouse wheel events zoom in and out instead of scroll up and down
          "toolManager.mouseWheelBehavior": go.ToolManager.WheelZoom,
          "undoManager.isEnabled": true // enable undo & redo
        }
      );
      
      myDiagram.model = this.model;
//Creating Rectangle with lines on left and right side
      go.Shape.defineFigureGenerator("Procedure", function(shape, w, h) {
        var geo = new go.Geometry();
        var param1 = shape ? shape.parameter1 : NaN;
        // Distance of left  and right lines from edge
        if (isNaN(param1)) param1 = .1;
        var fig = new go.PathFigure(0, 0, true);
        geo.add(fig);
      
        fig.add(new go.PathSegment(go.PathSegment.Line, w, 0));
        fig.add(new go.PathSegment(go.PathSegment.Line, w, h));
        fig.add(new go.PathSegment(go.PathSegment.Line, 0, h).close());
        var fig2 = new go.PathFigure((1 - param1) * w, 0, false);
        geo.add(fig2);
        fig2.add(new go.PathSegment(go.PathSegment.Line, (1 - param1) * w, h));
        fig2.add(new go.PathSegment(go.PathSegment.Move, param1 * w, 0));
        fig2.add(new go.PathSegment(go.PathSegment.Line, param1 * w, h));
        //??? geo.spot1 = new go.Spot(param1, 0);
        //??? geo.spot2 = new go.Spot(1 - param1, 1);
        return geo;
      });
     

    myDiagram.nodeTemplate =
      $(go.Node, "Auto", // set the context menu
        {// linkValidation: function(fromnode, fromport, tonode, toport) {
          // total number of links connecting with a node is limited to 1:
          //return fromnode.linksConnected.count + tonode.linksConnected.count < 1;
        //},
          resizable: false },
        $(go.Shape, "Procedure",
          { 
            width: 150, height: 60, //Standard size
            //stroke: null,
            portId: "",
            cursor: "pointer",
            fromLinkable: true, fromLinkableDuplicates: false,
            toLinkable: true, toLinkableDuplicates: false,
            
          },
          new go.Binding("fill", "color")),
        $(go.Panel, "Table",
          { defaultAlignment: go.Spot.Left },
          $(go.TextBlock, { row: 0, column: 0, columnSpan: 2, font: "bold 12pt sans-serif", editable: false, isMultiline: false },
            new go.Binding("text", "name")),
          /*
         $(go.TextBlock, { row: 1, column: 0 }, "Name:"),
         $(go.TextBlock, { row: 1, column: 1, editable: true }, new go.Binding("text", "name")),
         $(go.TextBlock, { row: 2, column: 0 }, "Version:"),
         $(go.TextBlock, { row: 2, column: 1, editable: true }, new go.Binding("text", "version")),
         $(go.TextBlock, { row: 3, column: 0 }, "Description:"),
         $(go.TextBlock, { row: 3, column: 1, editable: true }, new go.Binding("text", "desc")),
         $(go.TextBlock, { row: 4, column: 0 }, "COTS:"),
         $(go.TextBlock, { row: 4, column: 1, editable: true }, new go.Binding("text", "cots")),
         $(go.TextBlock, { row: 5, column: 0 }, "Release Date:"),
         $(go.TextBlock, { row: 5, column: 1, editable: true }, new go.Binding("text", "releaseDate")),
         $(go.TextBlock, { row: 6, column: 0 }, "Shutdown Date:"),
         $(go.TextBlock, { row: 6, column: 1, editable: true }, new go.Binding("text", "shutdownDate")),
       */
        ),
        {
          contextMenu:     // define a context menu for each node
            $("ContextMenu",  // that has one button
              $("ContextMenuButton",
                {
                  "ButtonBorder.fill": "white",
                  "_buttonFillOver": "skyblue"
                },
                $(go.TextBlock, "Show Information"),
                //new go.Binding("text", "key", function(s) { return "key: " + s; })),
                //alert(myDiagram.nodes.key)
                { click: showInfo }),
              // more ContextMenuButtons would go here
            )  // end Adornment
        }
      );

    function showInfo(e, obj) {
      var node = obj.part.adornedPart;
      alert("Name: " + node.data.name +
        "\nVersion: " + node.data.version +
        "\nDescription: " + node.data.desc +
        "\nCOTS: " + node.data.cots +
        "\nRelease Date: " + node.data.releaseDate +
        "\nShutdown Date: " + node.data.shutdownDate);
    }


    // this function alerts the current number of nodes in the Diagram
    function countNodes(e, obj) {
      alert('There are ' + e.diagram.nodes.count + ' applications');
    }

    // this function creates a new node and inserts it at the last event's point
    function addNode(e, obj) {
      var data = { name: "Application " + parseInt(e.diagram.nodes.count + 1), color: "lightblue", key: e.diagram.nodes.count + 1,
      version: "Default", releaseDate: "01.01.0001", shutdownDate: "31.12.9999"}; 
      e.diagram.model.addNodeData(data);
      var node = e.diagram.findPartForData(data);
      node.location = e.diagram.lastInput.documentPoint;
    }

    

    myDiagram.contextMenu =
      $(go.Adornment, "Vertical",
        $("ContextMenuButton",
          $(go.TextBlock, "Count Applications"),
          { click: countNodes }),
        $("ContextMenuButton",
          $(go.TextBlock, "Add Application"),
          { click: addNode }),
        // more ContextMenuButtons would go here
      );

    myDiagram.groupTemplate =
      $(go.Group, "Auto",
        $(go.Shape, "Rectangle",
          { fill: "white" }),
        $(go.Panel, "Vertical",
          {
            margin: 5,
            defaultAlignment: go.Spot.Left
          },
          $(go.Panel, "Horizontal",
            $("SubGraphExpanderButton",
              { margin: new go.Margin(0, 3, 5, 0) }),
            $(go.TextBlock, "Group", { editable: true })
          ),
          $(go.Placeholder)
        )
      );

    myDiagram.linkTemplate =
      $(go.Link,
        {
          // allow the user to relink existing links:
          relinkableFrom: true, relinkableTo: true,
          // draw the link path shorter than normal,
          // so that it does not interfere with the appearance of the arrowhead
          toShortLength: 2
          
        },
        $(go.Shape,
          { strokeWidth: 2 }),
        $(go.Shape,
          { toArrow: "Standard", stroke: null }),
          $(go.TextBlock, "DataObject", { segmentOffset: new go.Point(0, 10) , margin: 3 },
            new go.Binding("text", "text"))
       // $(go.TextBlock, "Text", { editable: true, segmentOffset: new go.Point(0, -10) }),
        //$(go.TextBlock, "Text", { editable: true, segmentOffset: new go.Point(0, 10) })
      );

     
    /*
    for (var i = 0; i < nodeDataArray.length; i++) {
      Difference_In_Time = nodeDataArray[i].shutdate2.getTime() - heute.getTime();
      Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);
      if (Difference_In_Days > 730) {
        nodeDataArray[i].color = "green";
      } else if (Difference_In_Days > 364) {
        nodeDataArray[i].color = "yellow";
      } else {
        nodeDataArray[i].color = "red";
      }
    }

    */
    const btnDataOb: HTMLElement = document.getElementById('exportDataObjects');
    btnDataOb.addEventListener('click', () => {
      var modelAsText = myDiagram.model.toJson();
    var jsonDataObjects = JSON.parse(modelAsText);
  var DataObjectsAScsv = [{dataobject: jsonDataObjects.linkDataArray[0].dataobject, description: jsonDataObjects.linkDataArray[0].description, personalData: jsonDataObjects.linkDataArray[0].personalData  }];
  for(var i = 1;i<jsonDataObjects.linkDataArray.length;i++){
DataObjectsAScsv.push({dataobject: jsonDataObjects.linkDataArray[i].dataobject, description: jsonDataObjects.linkDataArray[i].description, personalData: jsonDataObjects.linkDataArray[i].personalData  });
  }

      CsvDataService.exportToCsv('DataObjects.csv', DataObjectsAScsv);
    });

    const btnApps: HTMLElement = document.getElementById('exportApplications');
    btnApps.addEventListener('click', () => {
      var modelAsText = myDiagram.model.toJson();
    var jsonDataObjects = JSON.parse(modelAsText);
   
  var ApplicationsAScsv = [{name: jsonDataObjects.nodeDataArray[0].name, version: jsonDataObjects.nodeDataArray[0].version, key: jsonDataObjects.nodeDataArray[0].key,  desc: jsonDataObjects.nodeDataArray[0].desc, cots: jsonDataObjects.nodeDataArray[0].cots,  releaseDate: jsonDataObjects.nodeDataArray[0].releaseDate, shutdownDate: jsonDataObjects.nodeDataArray[0].shutdownDate }];
  for(var i = 1;i<jsonDataObjects.nodeDataArray.length;i++){
    ApplicationsAScsv.push({name: jsonDataObjects.nodeDataArray[i].name, version: jsonDataObjects.nodeDataArray[i].version, key: jsonDataObjects.nodeDataArray[i].key,  desc: jsonDataObjects.nodeDataArray[i].desc, cots: jsonDataObjects.nodeDataArray[i].cots,  releaseDate: jsonDataObjects.nodeDataArray[i].releaseDate, shutdownDate: jsonDataObjects.nodeDataArray[i].shutdownDate });
  }
      CsvDataService.exportToCsv('Applications.csv', ApplicationsAScsv);
    });
    

    myDiagram.groupTemplate.ungroupable = true;

    myDiagram.addDiagramListener('ChangedSelection', (e) => {

      var node = myDiagram.selection.first();
      var link = myDiagram.selection.first();

     

      if (link instanceof go.Link) {
       // myDiagram.remove(linki);
   //    this.model.startTransaction('remove nodes and links');
    

 //this.model.commitTransaction('remove nodes and links');
        // var dataobjectz = myDiagram.model.nodeDataArray;
         var modelAsText = myDiagram.model.toJson();
 
         var jsonDataObjects = JSON.parse(modelAsText);
        // const myArr = JSON.parse(dataobjectz);
 
         console.log("linkz="+jsonDataObjects.linkDataArray[0].dataobject);
         this.dataobjectShow.emit(modelAsText)
         this.linkClicked.emit(link);
         console.log("link", link.data);
     } //vielleicht ein ELSE lieber
     //if (node instanceof go.Node) {
       this.nodeClicked.emit(node);
       //console.log("node", node.data);
   //}

    
     }
    );
  }
  
}

