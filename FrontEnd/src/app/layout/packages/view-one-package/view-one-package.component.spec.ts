import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewOnePackageComponent } from './view-one-package.component';

describe('ViewOnePackageComponent', () => {
  let component: ViewOnePackageComponent;
  let fixture: ComponentFixture<ViewOnePackageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewOnePackageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewOnePackageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
