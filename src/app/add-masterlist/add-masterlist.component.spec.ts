import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddMasterlistComponent } from './add-masterlist.component';

describe('AddMasterlistComponent', () => {
  let component: AddMasterlistComponent;
  let fixture: ComponentFixture<AddMasterlistComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddMasterlistComponent]
    });
    fixture = TestBed.createComponent(AddMasterlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
