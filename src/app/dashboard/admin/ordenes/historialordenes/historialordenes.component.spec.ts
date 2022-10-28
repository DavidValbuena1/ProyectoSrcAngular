import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistorialordenesComponent } from './historialordenes.component';

describe('HistorialordenesComponent', () => {
  let component: HistorialordenesComponent;
  let fixture: ComponentFixture<HistorialordenesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HistorialordenesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HistorialordenesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
