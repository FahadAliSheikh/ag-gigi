import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewAllCompaniesComponent } from './view-all-companies.component';

describe('ViewAllCompaniesComponent', () => {
  let component: ViewAllCompaniesComponent;
  let fixture: ComponentFixture<ViewAllCompaniesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewAllCompaniesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewAllCompaniesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
