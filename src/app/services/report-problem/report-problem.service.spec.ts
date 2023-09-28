import { TestBed } from '@angular/core/testing';

import { ReportProblemService } from './report-problem.service';

describe('ReportProblemService', () => {
  let service: ReportProblemService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReportProblemService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
