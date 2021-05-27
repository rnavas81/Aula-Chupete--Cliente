import { TestBed } from '@angular/core/testing';

import { HasAulasService } from './has-aulas.service';

describe('HasAulasService', () => {
  let service: HasAulasService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HasAulasService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
