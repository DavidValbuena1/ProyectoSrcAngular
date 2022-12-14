   import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {  Router } from '@angular/router';
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
    private excelService: ExcelService,
    private router:Router
  ) {}

  ngOnInit(): void {
    this.verificarSesion();
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
  idventa:any;
  excel:any;

  //Variables para manejo de modales
  modalDetalles: boolean = false;
  modalEdicionDetalles: boolean = false;
  modalEdicionEstado: boolean=false;

  //Variables para manejo de filtros
  filtroProducto: any;
  ExcelData:any;
  buscador:any;
  buscador1:any;
  buscador2:any;
  suggestions:any;

  //Variables para manejo de validaciones
  formParent: FormGroup;
  envio: boolean = false;

  vendedor:boolean=true;


  verificarSesion() {
    let user = localStorage.getItem('usuarioConectado');
    if (user == '1') {
      this.router.navigate(['administrador'])
    } else if (user == '2') {
      this.vendedor=false;
    } else {
      this.router.navigate(['login']);
    }
  }

  //Metodos para manejo CRUD
  buscarVentas() {
    this.ventasService.obtenerVentas().subscribe((x: any) => {
      this.listaVentas = x;
      this.buscador="";
      this.buscador1="";
      this.buscador2="";   
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
      this.idventa=event;
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
      let id= x.id+"";
      let valor = x.precio+"";
      if (filtro == '' || filtro == null) {
        this.buscarVentas();
      } else if (
        id.startsWith(filtro)==true || valor.startsWith(filtro)==true
      ) {
        filtrado.push(x);
        this.listaVentas = filtrado;
        this.suggestions = filtrado;
      }
    }
  }

  filtroPrecio(event:any){
    let filtrado: any[] = [];
    let filtro = event;
    for (let x of this.listaVentas) {
      let precio = x.precio+"";

      if (filtro == '' || filtro == null) {
        this.buscarVentas();
      } else if (
        precio.startsWith(filtro)==true
      ) {
        filtrado.push(x);
        this.listaVentas = filtrado;
        this.suggestions = filtrado;
      }
    }
  }

  filtroId(event:any){
    let filtrado: any[] = [];
    let filtro = event;
    for (let x of this.listaVentas) {
      let id = x.id+"";
      if (filtro == '' || filtro == null) {
        this.buscarVentas();
      } else if (
        id.startsWith(filtro)==true
      ) {
        filtrado.push(x);
        this.listaVentas = filtrado;
        this.suggestions=filtrado;
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

    fileRead.readAsBinaryString(file);

    fileRead.onload = (e) => {
      var workBook = XLSX.read(fileRead.result, { type: 'binary' });
      var sheetNames = workBook.SheetNames;
      let lista:any[]=[];
      let data:any;
      this.ExcelData = XLSX.utils.sheet_to_json(workBook.Sheets[sheetNames[0]]);
      for (let i of this.ExcelData) {
        console.log(i);

          if (i.ID != 0 && i.id != '' && i.ID != null && i.ID!= undefined) {
            data = {
              id: i.ID,
              precio: i.Valor_total,
              fecha: i.Fecha,
              estado: i.Estado
            };
          } else {
            data = {
              precio: i.Valor_total,
              fecha: i.Fecha,
              estado: i.Estado
            };
          }
          this.ventasService.GenerarVenta(data).subscribe((x:any)=>{
            this.buscarVentas();
            this.excel="";
          })
      }
    };
  }

  generarReporte(){
    this.ventasService.generarReportePdf().subscribe((x)=>{
      let download = window.URL.createObjectURL(x);
      let link = document.createElement("a");
      link.href=download;
      link.download="ventas.pdf";
      link.click();
    })
  }
}
