import { TestBed } from '@angular/core/testing';

import { JwtTokenCheckInterceptorInterceptor } from './jwt-token-check-interceptor.interceptor';

describe('JwtTokenCheckInterceptorInterceptor', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      JwtTokenCheckInterceptorInterceptor
      ]
  }));

  it('should be created', () => {
    const interceptor: JwtTokenCheckInterceptorInterceptor = TestBed.inject(JwtTokenCheckInterceptorInterceptor);
    expect(interceptor).toBeTruthy();
  });
});
