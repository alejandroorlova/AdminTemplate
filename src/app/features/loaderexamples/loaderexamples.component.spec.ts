import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoaderexamplesComponent } from './loaderexamples.component';

describe('LoaderexamplesComponent', () => {
  let component: LoaderexamplesComponent;
  let fixture: ComponentFixture<LoaderexamplesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoaderexamplesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoaderexamplesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
