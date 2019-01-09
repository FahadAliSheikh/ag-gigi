import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  errorMessage: String;
  successMessage: String;
  constructor() { }
}
