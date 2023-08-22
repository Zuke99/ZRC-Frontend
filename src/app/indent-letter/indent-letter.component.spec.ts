import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IndentLetterComponent } from './indent-letter.component';

describe('IndentLetterComponent', () => {
  let component: IndentLetterComponent;
  let fixture: ComponentFixture<IndentLetterComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [IndentLetterComponent]
    });
    fixture = TestBed.createComponent(IndentLetterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
