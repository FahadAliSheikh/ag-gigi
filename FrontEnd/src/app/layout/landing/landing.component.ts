import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss']
})
export class LandingComponent implements OnInit {

  constructor() { }
  links = ['All Packages', 'Add Package'];
  activeLink = this.links[0];
  ngOnInit() {
  }

}
