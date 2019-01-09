import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddConcernedPersonDialogComponent } from './add-concerned-person-dialog.component';

describe('AddConcernedPersonDialogComponent', () => {
  let component: AddConcernedPersonDialogComponent;
  let fixture: ComponentFixture<AddConcernedPersonDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddConcernedPersonDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddConcernedPersonDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
