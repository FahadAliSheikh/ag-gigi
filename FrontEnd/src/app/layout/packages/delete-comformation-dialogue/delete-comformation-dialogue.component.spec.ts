import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteComformationDialogueComponent } from './delete-comformation-dialogue.component';

describe('DeleteComformationDialogueComponent', () => {
  let component: DeleteComformationDialogueComponent;
  let fixture: ComponentFixture<DeleteComformationDialogueComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeleteComformationDialogueComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteComformationDialogueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
