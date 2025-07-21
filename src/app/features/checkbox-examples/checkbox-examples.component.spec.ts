import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckboxExamplesComponent } from './checkbox-examples.component';

describe('CheckboxExamplesComponent', () => {
  let component: CheckboxExamplesComponent;
  let fixture: ComponentFixture<CheckboxExamplesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CheckboxExamplesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CheckboxExamplesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
