import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewAllConcernedPersonsComponent } from './view-all-concerned-persons.component';

describe('ViewAllConcernedPersonsComponent', () => {
  let component: ViewAllConcernedPersonsComponent;
  let fixture: ComponentFixture<ViewAllConcernedPersonsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewAllConcernedPersonsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewAllConcernedPersonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
