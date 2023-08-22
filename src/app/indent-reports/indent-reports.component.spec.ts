import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IndentReportsComponent } from './indent-reports.component';

describe('IndentReportsComponent', () => {
  let component: IndentReportsComponent;
  let fixture: ComponentFixture<IndentReportsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [IndentReportsComponent]
    });
    fixture = TestBed.createComponent(IndentReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
