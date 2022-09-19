import { TestBed } from '@angular/core/testing';

import { DetalleordencompraService } from './detalleordencompra.service';

describe('DetalleordencompraService', () => {
  let service: DetalleordencompraService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DetalleordencompraService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
