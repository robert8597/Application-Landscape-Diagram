import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';
import { Model } from 'gojs';
import * as XLSX from 'xlsx';
import { Application } from '../application';
import * as go from 'gojs';

@Component({
  selector: 'app-excelsheet',
  templateUrl: './excelsheet.component.html',
  styleUrls: ['./excelsheet.component.css']
})
export class ExcelsheetComponent implements OnInit {

  @Input()
  public model: go.Model;

  ngOnInit(): void {
  }


  message: Object = { key: "ApplicationEXCEL", color: "lightblue" }

  @Output() messageEvent = new EventEmitter<Object>();

  constructor() { }

  sendMessage() {
    this.messageEvent.emit(this.message)
  }

  test: Object = { key: "ApplicationSENDErtest", color: "red" };
  data: [][];
  NodeData: Object;
  NodeDataArray: Object[] = [ ];

  onFileChange(evt: any) {
    console.log("NodeDATaaaaaaaaaaaA");
    const target : DataTransfer =  <DataTransfer>(evt.target);
    
    if (target.files.length !== 1) throw new Error('Cannot use multiple files');

    const reader: FileReader = new FileReader();

    reader.onload = (e: any) => {
      const bstr: string = e.target.result;

      const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });
      var wsname : string = wb.SheetNames[0];
for(var i=0;i<wb.SheetNames.length;i++){
      if(wb.SheetNames[i].includes("Application"||"Apps"||"App")){//CHOOSE SHEET
        wsname = wb.SheetNames[i]
        break;
      }
      
    }
      

      const ws: XLSX.WorkSheet = wb.Sheets[wsname];

      //console.log(ws);

      this.data = (XLSX.utils.sheet_to_json(ws, { header: 1 }));

      //console.log(this.data);

     let x = this.data.slice(1);
      //console.log(x);
      var testWort = this.data.toString();
      //console.log("Test= "+testWort);

      var ExcelImportData = new Application(this.data);
     
     this.model.addNodeDataCollection(ExcelImportData.NodeDataArray);


 
    
    //this.messageEvent.emit(TestKey.NodeDataArray); Früher an diagram.component.ts geschickt!


    };
   
    //SENDS MESSAGE TO DIAGRAM COMPONENT / OBJECT EXCEL IMPORT
    reader.readAsBinaryString(target.files[0]);

  }





}
