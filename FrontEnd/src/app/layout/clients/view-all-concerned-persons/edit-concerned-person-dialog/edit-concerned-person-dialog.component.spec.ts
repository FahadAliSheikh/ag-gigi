import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditConcernedPersonDialogComponent } from './edit-concerned-person-dialog.component';

describe('EditConcernedPersonDialogComponent', () => {
  let component: EditConcernedPersonDialogComponent;
  let fixture: ComponentFixture<EditConcernedPersonDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditConcernedPersonDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditConcernedPersonDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
