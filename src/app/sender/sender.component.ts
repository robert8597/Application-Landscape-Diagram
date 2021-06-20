import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-sender',
  template: `
      
  `,
  styleUrls: ['./sender.component.css']
})
export class SenderComponent {

  message: Object = { key: "ApplicationSENDER", color: "lightblue" }

  @Output() messageEvent = new EventEmitter<Object>();

  constructor() { }

  sendMessage() {
    this.messageEvent.emit(this.message)
  }
}