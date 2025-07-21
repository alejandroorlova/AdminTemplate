import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ButtonexamplesComponent } from './buttonexamples.component';

describe('ButtonexamplesComponent', () => {
  let component: ButtonexamplesComponent;
  let fixture: ComponentFixture<ButtonexamplesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ButtonexamplesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ButtonexamplesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
