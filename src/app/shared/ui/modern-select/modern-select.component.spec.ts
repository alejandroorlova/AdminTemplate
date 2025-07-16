import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModernSelectComponent } from './modern-select.component';

describe('ModernSelectComponent', () => {
  let component: ModernSelectComponent;
  let fixture: ComponentFixture<ModernSelectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModernSelectComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModernSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
