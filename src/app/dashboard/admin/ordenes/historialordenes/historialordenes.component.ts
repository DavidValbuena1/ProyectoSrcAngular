import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormArray, Validators } from '@angular/forms';
import { DetalleordencompraService } from 'src/app/servicios/detalleordencompra.service';
import { InventarioService } from 'src/app/servicios/inventario.service';
import { OrdencompraService } from 'src/app/servicios/ordencompra.service';
import { ProveedorService } from 'src/app/servicios/proveedor.service';
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';

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
  envio: boolean = false;
  buscador: any;
  buscador2:any;
  suggestions:any;

  //Variables para manejo de filtros
  filtroProducto: any;
  filtroproveedor: any;
  excel: any;
  ExcelData: any;

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
      this.buscador = '';
      this.buscador2="";
    });
  }

  buscarProveedores() {
    this.proveedorService.obtenerProveedores().subscribe((x: any) => {
      this.listaProveedor = x;
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
    if (this.formOrden.valid) {
      this.ordencompra.proveedor = this.proveedor;
      this.ordencompra.estado = this.estado;
      this.ordenService
        .actualizarOrden(this.ordencompra)
        .subscribe((x: any) => {
          this.buscarOrdenes();
          this.modalEdicionEstado = false;
          Swal.fire(
            '¡Excelente!',
            'La orden de compra con ID ' +
              x.idorden +
              ' fue actualizada exitosamente',
            'success'
          );
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
      this.modalDetalles = false;
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
                .subscribe((y: any) => {
                  this.buscarOrdenes();
                  console.log(y);

                  this.modalEdicionDetalles = false;
                  this.modalDetalles = false;
                  Swal.fire({
                    title: '¡Excelente!',
                    text:
                      'El detalle "' +
                      x.nombreproducto +
                      '" y la Orden de compra con ID ' +
                      y.idorden +
                      ' fueron actualizados exitosamente',
                    icon: 'success',
                    confirmButtonText: 'Ok!',
                  }).then((result) => {
                    if (result.isConfirmed) {
                      this.modalDetalles = true;
                    }
                  });
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
      estado: new FormControl('', [Validators.required, Validators.max(1)]),
      proveedor: new FormControl('', [Validators.required]),
    });
  }

  generarReporte() {
    this.ordenService.generarReportePdf().subscribe((x) => {
      let download = window.URL.createObjectURL(x);
      let link = document.createElement('a');
      link.href = download;
      link.download = 'ventas.pdf';
      link.click();
    });
  }

  filtroId(event: any) {
    let filtro = event.query;
    let listaFiltro:any[]=[];
    for (let x of this.listaOrdenes) {  
      let orden =x.idorden+"";
        if(orden.startsWith(filtro)==true){
          listaFiltro.push(x)
        }
      }
      this.listaOrdenes = listaFiltro;
      this.suggestions=listaFiltro;
  }

  filtrovalortotal(event: any) {
    let filtro = event.query;
    let listaFiltro:any[]=[];
    for (let x of this.listaOrdenes) {  
      let valor = x.valortotal+"";
        if(valor.startsWith(filtro)==true){
          listaFiltro.push(x)
        }
      }
      this.listaOrdenes = listaFiltro;
      this.suggestions=listaFiltro;
  }

  exportExcel() {}

  readExcel(event: any) {
    let file = event.target.files[0];
    let fileRead = new FileReader();
    fileRead.readAsBinaryString(file);

    fileRead.onload = (e) => {
      var workBook = XLSX.read(fileRead.result, { type: 'binary' });
      var sheetNames = workBook.SheetNames;
      this.ExcelData = XLSX.utils.sheet_to_json(workBook.Sheets[sheetNames[0]]);
      for (let i of this.ExcelData) {
        // if (i.ID != 0 && i.ID != '' && i.ID != null && i.ID != undefined) {
        //   let data = {
        //     id_producto: i.ID,
        //     type: y,
        //     proveedor: x,
        //     size: i.Talla,
        //     nombre: i.Nombre,
        //     reference: i.Referencia,
        //     quantity: i.Cantidad,
        //     price: i.Precio_por_unidad,
        //     precioTotal: i.Precio_total,
        //     date: i.Fecha_de_entrada,
        //   };
        // } else {
        //   let data = {
        //     id_producto: 0,
        //     type: y,
        //     proveedor: x,
        //     size: i.Talla,
        //     nombre: i.Nombre,
        //     reference: i.Referencia,
        //     quantity: i.Cantidad,
        //     price: i.Precio_por_unidad,
        //     precioTotal: i.Precio_total,
        //     date: i.Fecha_de_entrada,
        //   };
        // }
      }
    };
  }
}
