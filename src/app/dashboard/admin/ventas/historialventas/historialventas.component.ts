import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { DetalleventaService } from 'src/app/servicios/detalleventa.service';
import { ExcelService } from 'src/app/servicios/excel.service';
import { InventarioService } from 'src/app/servicios/inventario.service';
import { VentasService } from 'src/app/servicios/ventas.service';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-historialventas',
  templateUrl: './historialventas.component.html',
  styleUrls: ['./historialventas.component.css'],
})
export class HistorialventasComponent implements OnInit {
  constructor(
    private ventasService: VentasService,
    private detalleService: DetalleventaService,
    private productoService: InventarioService,
    private messageService: MessageService,
    private excelService: ExcelService
  ) {}

  ngOnInit(): void {
    this.buscarVentas();
    this.buscarProductos();
    this.initForms();
  }

  //Variables para manejo CRUD
  listaVentas: any[];
  listaDetalles: any[];
  listaProductos: any[];
  producto: any;
  cantidad: any;
  preciounidad: any;
  descuento: any;
  producto2: any;
  venta: any;
  iddetalle: any;
  estado:any;

  //Variables para manejo de modales
  modalDetalles: boolean = false;
  modalEdicionDetalles: boolean = false;
  modalEdicionEstado: boolean=false;

  //Variables para manejo de filtros
  filtroProducto: any;
  ExcelData:any;
  buscador:any;

  //Variables para manejo de validaciones
  formParent: FormGroup;
  envio: boolean = false;

  //Metodos para manejo CRUD
  buscarVentas() {
    this.ventasService.obtenerVentas().subscribe((x: any) => {
      this.listaVentas = x;
    });
  }

  buscarProductos() {
    this.productoService.obtenerProductos().subscribe((x: any) => {
      this.listaProductos = x;
    });
  }

  editarEstado(event: any) {
    this.ventasService.obtenerVentaPorId(event).subscribe((x:any)=>{
      this.venta=x;
      this.estado=x.estado;
      this.modalEdicionEstado=true;
    })
  }

  verDetalles(event: any) {
    this.detalleService.obtenerDetallesPorVenta(event).subscribe((x: any) => {
      this.listaDetalles = x;
      this.modalDetalles = true;
    });
  }

  actualizarDetalle() {
    this.envio = true;
    if (this.formParent.valid) {
      if (
        this.descuento == null ||
        this.descuento == '' ||
        this.descuento == undefined
      ) {
        this.descuento = 0;
      }
      if (this.producto2 >= this.cantidad) {
        let data: any = {
          cantidad: this.cantidad,
          descuento: this.descuento,
          idproducto: this.producto,
          idventa: this.venta,
          preciounidad: this.preciounidad,
          subtotal:
            this.cantidad * this.preciounidad -
            (this.cantidad * this.preciounidad * this.descuento) / 100,
        };
        this.detalleService
          .editarDetalle(data, this.iddetalle)
          .subscribe((x: any) => {
            this.detalleService
              .obtenerDetallesPorVenta(this.venta.id)
              .subscribe((y: any) => {
                this.listaDetalles = y;
                this.envio = false;
                this.modalEdicionDetalles = false;
                this.modalDetalles = true;
                this.buscarVentas();
              });
          });
      } else if (this.producto.quantity >= (this.cantidad-this.producto2)) {
        let data: any = {
          cantidad: this.cantidad,
          descuento: this.descuento,
          idproducto: this.producto,
          idventa: this.venta,
          preciounidad: this.preciounidad,
          subtotal:
            this.cantidad * this.preciounidad -
            (this.cantidad * this.preciounidad * this.descuento) / 100,
        };
        this.detalleService
          .editarDetalle(data, this.iddetalle)
          .subscribe((x: any) => {
            this.detalleService
              .obtenerDetallesPorVenta(this.venta.id)
              .subscribe((y: any) => {
                this.listaDetalles = y;
                this.envio = false;
                this.modalEdicionDetalles = false;
                this.modalDetalles = true;
                this.buscarVentas();
              });
          });
      } else {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail:
            'La cantidad que quiere agregar del producto ' +
            this.producto.nombre +
            ' es ' +
            (this.cantidad-this.producto2) +
            ' y no puede ser mayor a ' +
            this.producto.quantity,
        });
      }
    }
  }

  editarDetalle(event: any) {
    this.detalleService.obtenerDetallePorId(event).subscribe((x: any) => {
      console.log(x);
      this.cantidad = x.cantidad;
      this.descuento = x.descuento;
      this.preciounidad = x.preciounidad;
      this.producto = x.idproducto;
      this.venta = x.idventa;
      this.iddetalle = x.iddetalle;
      this.producto2 = x.cantidad;
      this.modalDetalles = false;
      this.modalEdicionDetalles = true;
    });
  }

  actualizarEstado(){
    this.venta.estado=this.estado;
    this.ventasService.editarVenta(this.venta,this.venta.id).subscribe((x:any)=>{
      this.buscarVentas();
      this.modalEdicionEstado=false;
    })
  }
  //Metodos para manejo de modales
  cerrarModalDetalles() {
    this.modalDetalles = false;
  }

  cerrarModalDetallesEdicion() {
    this.modalEdicionDetalles = false;
    this.modalDetalles = true;
    this.cantidad = '';
    this.descuento = '';
    this.preciounidad = '';
    this.producto = '';
    this.producto2 = '';
    this.venta = '';
    this.iddetalle = '';
  }

  cerrarModalEstado(){
    this.venta="";
    this.estado="";
    this.modalEdicionEstado=false;
  }

  //Metodos para manejo de filtros
  filtrarProducto(event: any) {
    let filtro: any[] = [];
    let nombreproductos = event.query;

    for (let x of this.listaProductos) {
      if (
        x.nombre.toLowerCase().indexOf(nombreproductos.toLowerCase()) == 0 ||
        nombreproductos == x.id_producto
      ) {
        filtro.push(x);
      }
    }
    this.filtroProducto = filtro;
  }

  filtro(event:any){
    let filtrado: any[] = [];
    let filtro = event;
    for (let x of this.listaVentas) {

      if (filtro == '' || filtro == null) {
        this.buscarVentas();
      } else if (
        filtro.toLowerCase().indexOf(x.precio) == 0 ||
        filtro.toLowerCase().indexOf(x.id) == 0
      ) {
        filtrado.push(x);
        this.listaVentas = filtrado;
      }
    }
  }

  initForms() {
    this.formParent = new FormGroup({
      nombre: new FormControl('', [Validators.required]),
      cantidad: new FormControl('', [Validators.required, Validators.min(1)]),
      preciounidad: new FormControl('', [
        Validators.required,
        Validators.min(1),
      ]),
      descuento: new FormControl('', [Validators.max(100)]),
    });
  }

  exportExcel(){
    this.excelService.descargarExcelVentas(this.listaVentas);
  }

  readExcel(event:any){
    let file = event.target.files[0];
    let fileRead = new FileReader();
    console.log('Leyendo');

    fileRead.readAsBinaryString(file);

    fileRead.onload = (e) => {
      var workBook = XLSX.read(fileRead.result, { type: 'binary' });
      var sheetNames = workBook.SheetNames;
      let lista:any[]=[];
      let data:any;
      this.ExcelData = XLSX.utils.sheet_to_json(workBook.Sheets[sheetNames[0]]);
      for (let i of this.ExcelData) {
        console.log(i);

        // this.categoriaService.buscarCategoriaPorNombre(i.Categoria).subscribe((x:any)=>{
        //   if (i.id != 0 || i.id != '') {
        //     data = [{
        //       id_proveedor: i.ID,
        //       ciudad: i.Ciudad,
        //       correo1: i.Correo_principal,
        //       correo2: i.Correo_secundario,
        //       direccion1: i.Direccion_principal,
        //       direccion2: i.Direccion_secundaria,
        //       nit: i.NIT,
        //       nombre: i.Nombre,
        //       nombreEmpresa: i.Nombre_de_la_empresa,
        //       categoria:x
        //     }];
        //   } else {
        //     data = [{
        //       ciudad: i.Ciudad,
        //       correo1: i.Correo_Principal,
        //       correo2: i.Correo_Secundario,
        //       direccion1: i.Direccion_principal,
        //       direccion2: i.Direccion_secundaria,
        //       nit: i.NIT,
        //       nombre: i.Nombre,
        //       nombreEmpresa: i.Nombre_de_la_empresa,
        //       categoria:x
        //     }];
        //   }
        //   lista.push(data);
        //   this.proveedorService.agregarProveedor(data).subscribe((x:any)=>{
        //     this.buscarProveedores();
        //     this.excel="";
        //   })

        // })

      }
    };
  }
}
