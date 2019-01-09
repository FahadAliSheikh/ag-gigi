import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewAllBuyersComponent } from './view-all-buyers.component';

describe('ViewAllBuyersComponent', () => {
  let component: ViewAllBuyersComponent;
  let fixture: ComponentFixture<ViewAllBuyersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewAllBuyersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewAllBuyersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
