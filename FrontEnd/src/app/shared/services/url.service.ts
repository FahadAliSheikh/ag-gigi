import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UrlService {
  public basicUrl = 'http://localhost:5000/';

  constructor() { }
}
