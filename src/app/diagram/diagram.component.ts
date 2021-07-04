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
    console.log("TESTdings");
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
          $(go.TextBlock, { row: 0, column: 0, columnSpan: 4, font: "bold 10pt sans-serif", editable: false, isMultiline: true },
            new go.Binding("text", "name")),
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
          $(go.TextBlock, { segmentOffset: new go.Point(0, 10) , margin: 3 },
            new go.Binding("text", "text"))
       // $(go.TextBlock, "Text", { editable: true, segmentOffset: new go.Point(0, -10) }),
        //$(go.TextBlock, "Text", { editable: true, segmentOffset: new go.Point(0, 10) })
      );

  myDiagram.addDiagramListener('ChangedSelection', (e) => {
    var node = myDiagram.selection.first();
    var link = myDiagram.selection.first();

    if (link instanceof go.Link) {
      //var modelAsText = myDiagram.model.toJson();
      //var jsonDataObjects = JSON.parse(modelAsText);
      //this.dataobjectShow.emit(modelAsText)
      this.linkClicked.emit(link);
    } else 
    {
      this.linkClicked.emit(null);
      this.nodeClicked.emit(node);
    }
    if(node instanceof go.Node)
    {
      this.nodeClicked.emit(node);
    }else
    {
      this.nodeClicked.emit(null);
      this.linkClicked.emit(link);
    }
    
  }
  );

  }

}

