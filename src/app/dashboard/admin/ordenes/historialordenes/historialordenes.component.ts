import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormArray, Validators } from '@angular/forms';
import { DetalleordencompraService } from 'src/app/servicios/detalleordencompra.service';
import { InventarioService } from 'src/app/servicios/inventario.service';
import { OrdencompraService } from 'src/app/servicios/ordencompra.service';
import { ProveedorService } from 'src/app/servicios/proveedor.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-historialordenes',
  templateUrl: './historialordenes.component.html',
  styleUrls: ['./historialordenes.component.css'],
})
export class HistorialordenesComponent implements OnInit {
  constructor(
    private inventarioService: InventarioService,
    private ordenService: OrdencompraService,
    private detalleordenService: DetalleordencompraService,
    private proveedorService: ProveedorService
  ) {}


  ngOnInit(): void {
    this.buscarOrdenes();
    this.obtenerProductos();
    this.buscarProveedores();
    this.initFormParent();
  }

  formOrden: FormGroup = new FormGroup([]);
  formParent: FormGroup = new FormGroup({});

  //Variables para manejo de modales
  modalDetalles: boolean = false;
  modalEdicionDetalles: boolean = false;
  modalEdicionEstado: boolean = false;

  //Variables para manejo CRUD
  listaOrdenes: any[];
  listaDetalles: any[];
  listaProductos: any[];
  listaProveedor: any[];
  producto: any;
  cantidad: any;
  preciounidad: any;
  preciototal: any;
  descuento: any = 0;
  observaciones: any = 'Ninguna';
  ordencompra: any;
  idDetalle: any;
  estado: any;
  proveedor: any;

  //Variables para manejo de filtros
  filtroProducto: any;
  filtroproveedor: any;

  //Metodos para manejo CRUD

  buscarOrdenes() {
    this.ordenService.obtenerOrdenes().subscribe((x: any) => {
      this.listaOrdenes = x;
      for (let f of this.listaOrdenes) {
        if (f.estado == 0) {
          f.estado = 'En proceso';
        } else {
          f.estado = 'Completada';
        }
      }
    });
  }

  buscarProveedores() {
    this.proveedorService.obtenerProveedores().subscribe((x: any) => {
      this.listaProveedor = x;
      console.log(x);
    });
  }
  obtenerProductos() {
    this.inventarioService.obtenerProductos().subscribe((x: any) => {
      this.listaProductos = x;
    });
  }
  verDetalles(event: any) {
    this.detalleordenService
      .obtenerDetallesPorOrden(event)
      .subscribe((x: any) => {
        this.listaDetalles = x;
        if (this.modalDetalles == false) {
          this.modalDetalles = true;
        }
      });
  }

  editarEstado(event: any) {
    this.ordenService.obtenerOrdenPorId(event).subscribe((x: any) => {
      this.estado = x.estado;
      this.proveedor = x.proveedor;
      this.ordencompra = x;
      this.modalEdicionEstado = true;
    });
  }

  actualizarEstado() {
    if(this.formOrden.valid){
      this.ordencompra.proveedor = this.proveedor;
      this.ordencompra.estado = this.estado;
      this.ordenService.actualizarOrden(this.ordencompra).subscribe((x: any) => {
        this.buscarOrdenes();
        this.modalEdicionEstado = false;
      });
    }
  }

  editarDetalle(event: any) {
    this.detalleordenService.obtenerDetallePorId(event).subscribe((x: any) => {
      this.cantidad = x.cantidadproducto;
      this.preciototal = x.preciototal;
      this.preciounidad = x.preciounidad;
      this.producto = {
        nombre: x.nombreproducto,
      };
      this.ordencompra = x.ordenCompra;
      this.observaciones = x.observaciones;
      this.descuento = x.descuento;
      this.idDetalle = x.id;
      this.modalEdicionDetalles = true;
    });
  }

  actualizarDetalle() {
    if (this.formParent.valid) {
      let data: any = {
        nombreproducto: this.producto.nombre,
        cantidadproducto: this.cantidad,
        preciounidad: this.preciounidad,
        descuento: this.descuento,
        preciototal:
          this.cantidad * this.preciounidad -
          (this.cantidad * this.preciounidad * this.descuento) / 100,
        ordenCompra: this.ordencompra,
        observaciones: this.observaciones,
      };
      this.detalleordenService
        .actualizarDetalle(data, this.idDetalle)
        .subscribe((x: any) => {
          this.detalleordenService
            .obtenerDetallesPorOrden(x.ordenCompra.idorden)
            .subscribe((f: any) => {
              let valortotal = 0;
              let ordencompra: any;
              this.listaDetalles = f;
              for (let y of this.listaDetalles) {
                valortotal = y.preciototal + valortotal;
                ordencompra = y.ordenCompra;
              }

              ordencompra.valortotal = valortotal;
              this.ordenService
              .actualizarOrden(ordencompra)
              .subscribe((x: any) => {
                this.buscarOrdenes();
                this.modalEdicionDetalles = false;
                });
            });
        });
    }
  }
  //Metodos para manejo de modales
  cerrarModalDetalles() {
    this.modalDetalles = false;
    this.listaDetalles = [];
  }

  cerrarModalDetallesEdicion() {
    this.modalEdicionDetalles = false;
  }

  cerrarModalEstado() {
    this.modalEdicionEstado = false;
  }

  //Metodos para manejo de filtros

  filtrarProducto(event: any) {
    let filtro: any[] = [];
    let nombreCategoria = event.query;

    for (let x of this.listaProductos) {
      if (x.nombre.toLowerCase().indexOf(nombreCategoria.toLowerCase()) == 0) {
        filtro.push(x);
      }
    }
    this.filtroProducto = filtro;
  }

  filtrarProveedor(event: any) {
    let filtro: any[] = [];
    let nombreCategoria = event.query;

    for (let x of this.listaProveedor) {
      if (x.nombre.toLowerCase().indexOf(nombreCategoria.toLowerCase()) == 0) {
        filtro.push(x);
      }
    }
    console.log(filtro);

    this.filtroproveedor = filtro;
  }

  //Metodos para validar campos
  initFormParent(): void {
    this.formParent = new FormGroup({
      nombre: new FormControl('', [
        Validators.required,
        Validators.minLength(10),
      ]),
      cantidad: new FormControl('', [Validators.required]),
      preciounidad: new FormControl('', [Validators.required]),
      descuento: new FormControl('', [Validators.max(100)]),
    });

    this.formOrden = new FormGroup({
      estado: new FormControl("",[Validators.required,Validators.max(1)]),
      proveedor: new FormControl("",[Validators.required])
    })
  }
}
