import { TestBed } from '@angular/core/testing';

import { IebemUiService } from './iebem-ui.service';

describe('IebemUiService', () => {
  let service: IebemUiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IebemUiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
