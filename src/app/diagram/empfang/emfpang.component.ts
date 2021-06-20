import { Component } from '@angular/core';

@Component({
  selector: 'app-empfang',
  template: `
    Message: {{message}}
    <app-sender (messageEvent)="receiveMessage($event)"></app-sender>
  `,
  styleUrls: ['./empfang.component.css']
})
export class EmpfangComponent {

  constructor() { }

  message:string;

  receiveMessage($event) {
    this.message = $event
    
    console.log("Schnecke")
  }
}