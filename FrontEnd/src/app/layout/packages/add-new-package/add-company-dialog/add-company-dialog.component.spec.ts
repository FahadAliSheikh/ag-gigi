import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCompanyDialogComponent } from './add-company-dialog.component';

describe('AddCompanyDialogComponent', () => {
  let component: AddCompanyDialogComponent;
  let fixture: ComponentFixture<AddCompanyDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddCompanyDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddCompanyDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
