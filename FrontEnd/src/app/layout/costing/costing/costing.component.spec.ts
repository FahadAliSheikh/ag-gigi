import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CostingComponent } from './costing.component';

describe('CostingComponent', () => {
  let component: CostingComponent;
  let fixture: ComponentFixture<CostingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CostingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CostingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
