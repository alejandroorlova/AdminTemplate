import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IebemUiComponent } from './iebem-ui.component';

describe('IebemUiComponent', () => {
  let component: IebemUiComponent;
  let fixture: ComponentFixture<IebemUiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IebemUiComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IebemUiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
