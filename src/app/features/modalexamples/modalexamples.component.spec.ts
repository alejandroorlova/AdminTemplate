import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalexamplesComponent } from './modalexamples.component';

describe('ModalexamplesComponent', () => {
  let component: ModalexamplesComponent;
  let fixture: ComponentFixture<ModalexamplesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalexamplesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalexamplesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
