import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ZrccrudComponent } from './zrccrud.component';

describe('ZrccrudComponent', () => {
  let component: ZrccrudComponent;
  let fixture: ComponentFixture<ZrccrudComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ZrccrudComponent]
    });
    fixture = TestBed.createComponent(ZrccrudComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
