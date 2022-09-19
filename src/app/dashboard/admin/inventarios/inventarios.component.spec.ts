import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InventariosAdminComponent } from './inventarios.component';

describe('InventariosAdminComponent', () => {
  let component: InventariosAdminComponent;
  let fixture: ComponentFixture<InventariosAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InventariosAdminComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InventariosAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
