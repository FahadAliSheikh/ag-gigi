import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditBuyerDialogComponent } from './edit-buyer-dialog.component';

describe('EditBuyerDialogComponent', () => {
  let component: EditBuyerDialogComponent;
  let fixture: ComponentFixture<EditBuyerDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditBuyerDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditBuyerDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
