import { TestBed } from '@angular/core/testing';

import { BudgetApi } from './budget-api';

describe('BudgetApi', () => {
  let service: BudgetApi;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BudgetApi);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
