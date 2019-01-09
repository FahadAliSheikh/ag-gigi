import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewAllCostingComponent } from './view-all-costing.component';

describe('ViewAllCostingComponent', () => {
  let component: ViewAllCostingComponent;
  let fixture: ComponentFixture<ViewAllCostingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewAllCostingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewAllCostingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
