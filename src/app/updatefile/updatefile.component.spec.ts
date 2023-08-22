import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdatefileComponent } from './updatefile.component';

describe('UpdatefileComponent', () => {
  let component: UpdatefileComponent;
  let fixture: ComponentFixture<UpdatefileComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UpdatefileComponent]
    });
    fixture = TestBed.createComponent(UpdatefileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
