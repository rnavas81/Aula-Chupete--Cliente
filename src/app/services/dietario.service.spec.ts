import { TestBed } from '@angular/core/testing';

import { DietarioService } from './dietario.service';

describe('DietarioService', () => {
  let service: DietarioService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DietarioService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
