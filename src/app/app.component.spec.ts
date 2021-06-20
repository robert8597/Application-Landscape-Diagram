import { Component, EventEmitter, Input, Output } from '@angular/core';
import * as go from 'gojs';


const $ = go.GraphObject.make;
//var $ = go.GraphObject.make;


@Component({
  selector: 'app-diagram',
  templateUrl: './diagram.component.html',
  styleUrls: ['./diagram.component.css']
})
export class DiagramComponent {
  
  
  constructor() {
  }

  ngOnInit(): void {
    
  }

}
