import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ZrcReportsComponent } from './zrc-reports.component';

describe('ZrcReportsComponent', () => {
  let component: ZrcReportsComponent;
  let fixture: ComponentFixture<ZrcReportsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ZrcReportsComponent]
    });
    fixture = TestBed.createComponent(ZrcReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
