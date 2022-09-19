import { Component, OnInit } from '@angular/core';
import { DetalleordencompraService } from 'src/app/servicios/detalleordencompra.service';
import { InventarioService } from 'src/app/servicios/inventario.service';
import { OrdencompraService } from 'src/app/servicios/ordencompra.service';
import { ProveedorService } from 'src/app/servicios/proveedor.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-admin-ordenes',
  templateUrl: './ordenes.component.html',
  styleUrls: ['./ordenes.component.css'],
})
export class OrdenesAdminComponent implements OnInit {
  constructor(
    private detalleordenService: DetalleordencompraService,
    private ordenService: OrdencompraService,
    private productoService: InventarioService,
    private proveedorService: ProveedorService
  ) {}

  ngOnInit(): void {
    this.buscarProductos();
    this.buscarProveedores();
  }

  //Listas a utilizar
  listaOrdenes: any[];
  listaDetalleOrdenes: any[];
  listaProveedores: any[];
  listaProductos: any[];
  carrito: any[] = [];

  //Variables para Manejo CRUD DetalleOrdenCompra
  producto: any;
  ordenCompra: any;
  cantidadproducto: any;
  precioUnidad: any;
  precioTotal: any = 0;
  observaciones: any;
  descuento: any;

  //Variables para Manejo CRUD OrdenCompra
  idOrden: any;
  fecha: any;
  proveedor: any;
  idEstado: any;

  //Variables para Manejo de productos
  nombreproducto: any;
  talla: any;

  //Variables para filtros
  filtroproductos: any[];
  filtroproveedor: any[];

  //Metodos para Manejo CRUD
  buscarProductos() {
    this.productoService.obtenerProductos().subscribe((x: any) => {
      this.listaProductos = x;
    });
  }

  buscarProveedores() {
    this.proveedorService.obtenerProveedores().subscribe((x: any) => {
      this.listaProveedores = x;
    });
  }

  GenerarOrden() {
    if (
      this.proveedor != '' &&
      this.proveedor != null &&
      this.proveedor != undefined
    ) {
      if (
        this.carrito.length != 0 &&
        this.carrito != null &&
        this.carrito != undefined
      ) {
        let data: any = {
          proveedor: this.proveedor,
          Estado: 0,
          valortotal: this.precioTotal,
        };
        this.ordenService.generarOrden(data).subscribe((x: any) => {
          this.ordenService.obtenerIdMaximo().subscribe((x: any) => {
            let idorden = x;
            for (let x of this.carrito) {
              x.ordenCompra={
                idorden:idorden

              }
            }
            this.detalleordenService
              .enviarCarrito(this.carrito)
              .subscribe((x: any) => {
                this.ordenService
                  .enviarOrdenAlProveedor(this.carrito)
                  .subscribe((x: any) => {
                  });
                  Swal.fire(
                    'Operación Exitosa',
                    'Se genero la orden de compra y fue enviada una copia al proveedor por correo',
                    'success'
                  );
                  this.carrito=[];
                  this.proveedor="";
                  this.precioTotal="";
              });
          });
        });
      } else {
        Swal.fire(
          'Llena la orden',
          'Creo que se te ha olvidado agregar productos, ¡por favor hazlo!',
          'error'
        );
      }
    } else {
      Swal.fire(
        'Selecciona el proveedor',
        'Creo que se te ha olvidado seleccionar el proveedor, ¡por favor hazlo!',
        'error'
      );
    }
  }

  //Metodos para filtro de productos y proveedores
  filtrarProveedor(event: any) {
    let filtro: any[] = [];
    let nombreProveedor = event.query;

    for (let x of this.listaProveedores) {
      if (
        x.nombre.toLowerCase().indexOf(nombreProveedor.toLowerCase()) == 0 ||
        nombreProveedor == x.id_proveedor
      ) {
        filtro.push(x);
      }
    }
    this.filtroproveedor = filtro;
  }

  filtrarProducto(event: any) {
    let filtro: any[] = [];
    let nombreProducto = event.query;

    for (let x of this.listaProductos) {
      if (
        x.nombre.toLowerCase().indexOf(nombreProducto.toLowerCase()) == 0 ||
        nombreProducto == x.id_producto
      ) {
        filtro.push(x);
      }
    }
    this.filtroproductos = filtro;
  }

  llenarDatosFormulario(event: any) {
    console.log(event);

    this.nombreproducto = event.nombre;
    this.talla = event.size;
    this.precioUnidad = event.price;
  }

  agregarAlCarrito() {
    if (
      this.observaciones == null ||
      this.observaciones == '' ||
      this.observaciones == undefined
    ) {
      this.observaciones = 'Ninguna';
    }
    let data: any = {
      nombreproducto: this.nombreproducto,
      talla: this.talla,
      cantidadproducto: this.cantidadproducto,
      preciounidad: this.precioUnidad,
      preciototal: this.cantidadproducto * this.precioUnidad,
      observaciones: this.observaciones,
    };
    this.carrito.push(data);
    this.nombreproducto = '';
    this.talla = '';
    this.cantidadproducto = '';
    this.precioUnidad = '';
    this.producto = '';
    this.ordenCompra = {
      Idorden: 0,
    };
    this.precioTotal = 0;
    for (let x of this.carrito) {
      this.precioTotal = this.precioTotal + x.preciototal;
    }
  }
}
