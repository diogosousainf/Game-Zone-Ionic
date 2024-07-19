import { TestBed } from '@angular/core/testing';

import { PersonalizedListService } from './personalized-list.service';

describe('PersonalizedListService', () => {
  let service: PersonalizedListService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PersonalizedListService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
