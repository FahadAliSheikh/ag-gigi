//import { Injectable } from '@angular/core';
import { ErrorHandler, Injectable } from '@angular/core';
import { MessageService } from './message.service';
@Injectable({
  providedIn: 'root'
})
export class ErrorService implements ErrorHandler {
  error: String;
  status;

  constructor(public messageService: MessageService) { }
  handleError(error) {
    console.warn('Handler caught an error', error);
    
    alert(error);
  }
}
