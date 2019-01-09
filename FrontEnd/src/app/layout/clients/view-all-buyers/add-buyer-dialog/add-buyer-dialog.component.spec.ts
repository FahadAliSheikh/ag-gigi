import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddBuyerDialogComponent } from './add-buyer-dialog.component';

describe('AddBuyerDialogComponent', () => {
  let component: AddBuyerDialogComponent;
  let fixture: ComponentFixture<AddBuyerDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddBuyerDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddBuyerDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
