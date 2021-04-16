import { TestBed } from '@angular/core/testing';

import { TestLoginService } from './test-login.service';

describe('TestLoginService', () => {
  let service: TestLoginService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TestLoginService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
