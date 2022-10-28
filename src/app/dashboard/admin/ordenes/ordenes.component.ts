import { Component, OnInit } from '@angular/core';
import { DetalleordencompraService } from 'src/app/servicios/detalleordencompra.service';
import { InventarioService } from 'src/app/servicios/inventario.service';
import { OrdencompraService } from 'src/app/servicios/ordencompra.service';
import { ProveedorService } from 'src/app/servicios/proveedor.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
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
    this.initForms();
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
  numeroproducto: number = 0;
  numeroproducto2: any;

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

  //Variables para manejo de modales
  modalEdicionCarrito: boolean = false;
  //Variables para validacion de inputs
  formBuscar: FormGroup = new FormGroup({});
  formCarrito: FormGroup = new FormGroup({});
  formEdicionCarrito: FormGroup = new FormGroup({});
  envio: boolean = false;

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
              x.ordenCompra = {
                idorden: idorden,
              };
            }
            this.detalleordenService
              .enviarCarrito(this.carrito)
              .subscribe((x: any) => {
                this.ordenService
                  .enviarOrdenAlProveedor(this.carrito)
                  .subscribe((x: any) => {});
                Swal.fire(
                  'Operación Exitosa',
                  'Se genero la orden de compra y fue enviada una copia al proveedor por correo',
                  'success'
                );
                this.carrito = [];
                this.proveedor = '';
                this.precioTotal = '';
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
    let nombreproductos = event.query;

    for (let x of this.listaProductos) {
      if (
        x.nombre.toLowerCase().indexOf(nombreproductos.toLowerCase()) == 0 ||
        nombreproductos == x.id_producto
      ) {
        filtro.push(x);
      }
    }
    this.filtroproductos = filtro;
  }

  llenarDatosFormulario(event: any) {
    if (event != '' && event != undefined) {
      this.nombreproducto = event.nombre;
      this.talla = event.size;
      this.precioUnidad = event.price;
    } else {
      Swal.fire({
        icon: 'error',
        title: '¡Ups!',
        text: 'Haz dejado el campo producto vacio, vamos a llenarlo',
      });
    }
  }

  agregarAlCarrito() {
    this.envio = true;
    if (this.formCarrito.valid) {
      if (
        this.observaciones == null ||
        this.observaciones == '' ||
        this.observaciones == undefined
      ) {
        this.observaciones = 'Ninguna';
      }
      if (
        this.descuento == null ||
        this.descuento == '' ||
        this.descuento == undefined
      ) {
        this.descuento = 0;
      }
      let data: any = {
        numeroproducto: (this.numeroproducto = this.numeroproducto + 1),
        nombreproducto: this.nombreproducto,
        talla: this.talla,
        cantidadproducto: this.cantidadproducto,
        preciounidad: this.precioUnidad,
        preciototal:
          this.cantidadproducto * this.precioUnidad -
          (this.cantidadproducto * this.precioUnidad * this.descuento) / 100,
        observaciones: this.observaciones,
        descuento: this.descuento,
        productos: this.producto,
      };
      this.carrito.push(data);
      this.nombreproducto = '';
      this.talla = '';
      this.cantidadproducto = '';
      this.precioUnidad = '';
      this.producto = '';
      this.observaciones = '';
      this.descuento = '';
      this.ordenCompra = {
        Idorden: 0,
      };
      this.precioTotal = 0;
      for (let x of this.carrito) {
        this.precioTotal = this.precioTotal + x.preciototal;
      }
      this.envio=false;
    } else {
      Swal.fire(
        '¡Upss!',
        'Algunos campos son invalidos, ¡Vamos a corregirlos!',
          'warning'
      );
    }
  }

  buscarProductoCarrito(event: any) {
    this.modalEdicionCarrito = true;
    let detalleorden: any;
    for (let x of this.carrito) {
      if (x.numeroproducto == event) {
        detalleorden = x;
      }
    }
    this.talla = detalleorden.talla;
    this.cantidadproducto = detalleorden.cantidadproducto;
    this.precioUnidad = detalleorden.preciounidad;
    this.producto = detalleorden.productos;
    this.observaciones = detalleorden.observaciones;
    this.descuento = detalleorden.descuento;
    this.numeroproducto2 = detalleorden.numeroproducto;
    this.nombreproducto = detalleorden.nombreproducto;
  }

  borrarProductoCarrito(event: number) {
    console.log(event);
    let carritoborrado: any = [];
    this.numeroproducto = 0;
    for (let y of this.carrito) {
      if (y.numeroproducto != event) {
        this.numeroproducto = this.numeroproducto + 1;
        y.numeroproducto = this.numeroproducto;
        carritoborrado.push(y);
      }
    }
    this.carrito = carritoborrado;
    this.precioTotal = 0;
    for (let x of this.carrito) {
      this.precioTotal = this.precioTotal + x.preciototal;
    }
  }
  actualizarCarrito() {
    let carrito2: any = [];
    this.envio=true;
    if (this.formEdicionCarrito.valid) {
      if (
        this.descuento == null ||
        this.descuento == '' ||
        this.descuento == undefined
      ) {
        this.descuento = 0;
      }
      let data: any = {
        numeroproducto: this.numeroproducto2,
        nombreproducto: this.producto.nombre,
        talla: this.talla,
        cantidadproducto: this.cantidadproducto,
        preciounidad: this.precioUnidad,
        preciototal:
          this.cantidadproducto * this.precioUnidad -
          (this.cantidadproducto * this.precioUnidad * this.descuento) / 100,
        observaciones: this.observaciones,
        descuento: this.descuento,
        productos: this.producto,
      };
      for (let f of this.carrito) {
        if (this.numeroproducto2 != f.numeroproducto) {
          carrito2.push(f);
        } else if (this.numeroproducto2 == f.numeroproducto) {
          carrito2.push(data);
        }
      }
      this.carrito = carrito2;
      this.precioTotal = 0;
      for (let x of this.carrito) {
        this.precioTotal = this.precioTotal + x.preciototal;
      }
      this.cerrarModalCarrito();
    } else {
      this.modalEdicionCarrito=false;
      Swal.fire({
        title: '¡Upss!',
        text: 'Algunos campos son invalidos, ¡Vamos a corregirlos!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: '¡Ok!',
        cancelButtonText: 'Salir',
        reverseButtons: true,
      }).then((result) => {
        if (result.isConfirmed) {
          this.modalEdicionCarrito=true;
        } else if (
          result.dismiss === Swal.DismissReason.cancel
        ) {
          this.cerrarModalCarrito();
        }
      });
    }
  }
  cerrarModalCarrito() {
    this.modalEdicionCarrito = false;
    this.nombreproducto = '';
    this.talla = '';
    this.cantidadproducto = '';
    this.precioUnidad = '';
    this.producto = '';
    this.observaciones = '';
    this.descuento = '';
    this.ordenCompra = {
      Idorden: 0,
    };
    this.envio = false;
  }

  //Metodos para validación de formularios
  initForms() {
    this.formBuscar = new FormGroup({
      producto: new FormControl('', [Validators.required]),
    });
    this.formCarrito = new FormGroup({
      cantidad: new FormControl('', [Validators.required]),
      preciounidad: new FormControl('', [Validators.required]),
      name: new FormControl('', [Validators.required]),
      talla: new FormControl('', [Validators.required]),
      descuento: new FormControl('', [Validators.max(100)]),
      observaciones: new FormControl('', [Validators.maxLength(255)]),
    });
    this.formEdicionCarrito = new FormGroup({
      cantidad: new FormControl('', [Validators.required]),
      preciounidad: new FormControl('', [Validators.required]),
      nombre: new FormControl('', [Validators.required]),
      talla: new FormControl('', [Validators.required]),
      descuento: new FormControl('', [Validators.max(100)]),
      observaciones: new FormControl('', [Validators.maxLength(255)]),
    });
  }


}
