import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';
import * as XLSX from 'xlsx';
import { Application } from '../application';
import * as go from 'gojs';
import { CrudService } from '../service/crud.service';

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

  @Output() messageEvent = new EventEmitter<Object>();

  constructor(public crudservice: CrudService) { }


  data: [][];
  //NodeData: Object;
  //NodeDataArray: Object[] = [];

  onFileChange(evt: any) {

    const target: DataTransfer = <DataTransfer>(evt.target);

    if (target.files.length !== 1) throw new Error('Cannot use multiple files');

    const reader: FileReader = new FileReader();

    reader.onload = (e: any) => {
      const bstr: string = e.target.result;

      const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });
      var wsname: string = wb.SheetNames[0];
      for (var i = 0; i < wb.SheetNames.length; i++) {
        if (wb.SheetNames[i].includes("Application" || "Apps" || "App")) {//CHOOSE SHEET
          wsname = wb.SheetNames[i]
          break;
        }

      }
      const ws: XLSX.WorkSheet = wb.Sheets[wsname];
      this.data = (XLSX.utils.sheet_to_json(ws, { header: 1 }));
      let x = this.data.slice(1);

      //var testWort = this.data.toString();

      var ExcelImportData = new Application(this.data);

      var AppCounter = this.model.nodeDataArray.length;
  
      this.model.addNodeDataCollection(ExcelImportData.NodeDataArray);
     
      for(var i =AppCounter;i<this.model.nodeDataArray.length;i++){
        this.crudservice.create_NewApplication(this.model.nodeDataArray[i],this.model.nodeDataArray[i].key)
      }
      alert(ExcelImportData.NodeDataArray.length+" Applications imported")
    };

    //SENDS MESSAGE TO DIAGRAM COMPONENT / OBJECT EXCEL IMPORT
    reader.readAsBinaryString(target.files[0]);

  }





}
