import { TestBed } from '@angular/core/testing';

import { VelaService } from './vela.service';

describe('VelaService', () => {
  let service: VelaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VelaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
