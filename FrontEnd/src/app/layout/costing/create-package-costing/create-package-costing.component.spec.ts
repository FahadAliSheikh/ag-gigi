import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatePackageCostingComponent } from './create-package-costing.component';

describe('CreatePackageCostingComponent', () => {
  let component: CreatePackageCostingComponent;
  let fixture: ComponentFixture<CreatePackageCostingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreatePackageCostingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreatePackageCostingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
