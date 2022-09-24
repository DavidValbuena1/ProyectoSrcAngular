import { Component, OnInit } from '@angular/core';
import { InventarioService } from 'src/app/servicios/inventario.service';
import { VentasService } from 'src/app/servicios/ventas.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { MessageService } from 'primeng/api';
import { DetalleventaService } from 'src/app/servicios/detalleventa.service';

@Component({
  selector: 'app-admin-ventas',
  templateUrl: './ventas.component.html',
  styleUrls: ['./ventas.component.css'],
})
export class VentasAdminComponent implements OnInit {
  constructor(
    private productoService: InventarioService,
    private ventaService: VentasService,
    private messageService: MessageService,
    private detalleService: DetalleventaService
  ) {}

  ngOnInit(): void {
    this.buscarProductos();
    this.initForms();
  }

  formBuscar: FormGroup = new FormGroup({});
  formCarrito: FormGroup = new FormGroup({});
  formEdicionCarrito: FormGroup = new FormGroup({});

  //Variables para manejo CRUD
  listaProductos: any[];
  carrito: any[] = [];
  producto: any;
  nombreproducto: any;
  talla: any;
  cantidad: any;
  precio: any;
  numeroproducto: any = 0;
  numeroproducto2:any=0;
  descuento: any;
  valortotal: any = 0;

  //Variables para manejo de modales
  modalEdicionCarrito:boolean=false;

  //Variables para manejo de filtros
  filtroproductos: any;
  envio: boolean = false;
  nombrebooleantrue: boolean = false;
  nombrebooleanfalse: boolean = false;

  //Metodos para manejo de CRUD
  llenarDatosFormulario(event: any) {
    this.nombreproducto = event.nombre;
    this.talla = event.size;
    this.precio = event.price;
    this.cantidad = event.quantity;
    this.producto = event;
  }

  buscarProductos() {
    this.productoService.obtenerProductos().subscribe((x: any) => {
      this.listaProductos = x;
    });
  }

  agregarAlCarrito() {
    if (
      this.nombreproducto != '' &&
      this.nombreproducto != null &&
      this.nombreproducto != undefined
    ) {
      this.envio = true;
      if (this.formCarrito.valid) {
        if (
          this.descuento == null ||
          this.descuento == '' ||
          this.descuento == undefined
        ) {
          this.descuento = 0;
        }
        this.numeroproducto = this.numeroproducto + 1;
        if (this.producto.quantity >= this.cantidad) {
          let data: any = {
            numeroproducto: this.numeroproducto,
            cantidad: this.cantidad,
            preciounidad: this.precio,
            preciototal:
              this.precio * this.cantidad -
              (this.precio * this.cantidad * this.descuento) / 100,
            nombreproducto: this.nombreproducto,
            producto: this.producto,
            descuento: this.descuento,
          };
          if (this.numeroproducto == 1) {
            this.carrito.push(data);
            this.nombreproducto = '';
            this.talla = '';
            this.precio = '';
            this.cantidad = '';
            this.producto = '';
            this.descuento = '';
            this.initForms();
            this.envio = false;
          }
          let carrito2: any[] = [];
          if (this.numeroproducto > 1) {
            for (let x of this.carrito) {
              if (data.producto.id_producto == x.producto.id_producto) {
                let f = x.cantidad;
                x.cantidad = parseInt(x.cantidad) + parseInt(data.cantidad);
                if (data.producto.quantity >= x.cantidad) {
                  x.descuento = data.descuento;
                  x.preciounidad = data.preciounidad;
                  (x.preciototal =
                    parseInt(x.preciounidad) * parseInt(x.cantidad) -
                    (parseInt(x.preciounidad) *
                      parseInt(x.cantidad) *
                      parseInt(x.descuento)) /
                      100),
                    carrito2.push(x);
                  this.nombreproducto = '';
                  this.talla = '';
                  this.precio = '';
                  this.cantidad = '';
                  this.producto = '';
                  this.descuento = '';
                  this.initForms();
                  this.envio = false;
                  this.numeroproducto = this.numeroproducto - 1;
                } else {
                  this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail:
                      'La cantidad sumada del producto ' +
                      x.nombreproducto +
                      ' es ' +
                      x.cantidad +
                      ' y no puede ser mayor a ' +
                      this.producto.quantity,
                  });
                  x.cantidad = f;
                  carrito2.push(x);
                  this.numeroproducto = this.numeroproducto - 1;
                }
              } else {
                carrito2.push(x);
              }
            }
            if (data.numeroproducto == this.numeroproducto) {
              carrito2.push(data);
              this.nombreproducto = '';
              this.talla = '';
              this.precio = '';
              this.cantidad = '';
              this.producto = '';
              this.descuento = '';
              this.initForms();
              this.envio = false;
            }

            this.carrito = carrito2;
          }
        } else {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail:
              'La cantidad ' +
              this.cantidad +
              ' no puede ser mayor a ' +
              this.producto.quantity +
              ' que es la cantidad existente en el inventario.',
          });
        }
      } else {
        Swal.fire(
          '¡Upss!',
          'Algunos campos son invalidos, ¡Vamos a corregirlos!',
          'warning'
        );
      }
    } else {
      Swal.fire('¡Upss!', 'El campo nombre no puede quedar vacío', 'warning');
    }
    this.valortotal = 0;
    for (let x of this.carrito) {
      this.valortotal = this.valortotal + x.preciototal;
    }
  }

  limpiarCarrito() {
    this.producto = '';
    this.carrito = [];
  }
  enviarCarrito() {
    let venta: any = {
      precio: this.valortotal,
      estado: 'Completada',
    };
    this.ventaService.GenerarVenta(venta).subscribe((x: any) => {
      this.ventaService.obtenerIdMaximo().subscribe((x: any) => {
        let idventas = x;
        let carrito2: any[] = [];
        for (let f of this.carrito) {

          let data =
            {
              idventa: {
                id: idventas,
              },
              idproducto: f.producto,
              descuento: f.descuento,
              subtotal: f.preciototal,
              cantidad: f.cantidad,
            };
          carrito2.push(data);
        }
        this.detalleService.enviarCarrito(carrito2).subscribe((x: any) => {
          Swal.fire(
            '¡Excelente!',
            'Se ha generado la venta #'+idventas+' con un valor total de $'+this.valortotal,
            'success'
          )
          this.producto = '';
          this.carrito = [];
          this.valortotal=0;
          this.buscarProductos();
        });
      });
    });
  }


  buscarProductoCarrito(event:any){
    let detalleorden:any;
    for(let x of this.carrito){
      if(x.numeroproducto == event){
        detalleorden=x;
      }
    }

    this.producto=detalleorden.producto;
    this.cantidad=detalleorden.cantidad;
    this.precio=detalleorden.preciounidad;
    this.descuento=detalleorden.descuento;
    this.nombreproducto=detalleorden.nombreproducto;
    this.numeroproducto2=detalleorden.numeroproducto;
    this.modalEdicionCarrito=true;
  }

  borrarProductoCarrito(event:any){
    let carritoborrado:any=[];
    this.numeroproducto=0;
    for(let y of this.carrito){
      if(y.numeroproducto!=event){
        this.numeroproducto=this.numeroproducto+1;
        y.numeroproducto=this.numeroproducto
        carritoborrado.push(y);
      }
    }
    this.carrito = carritoborrado;
    this.valortotal=0;
    for (let x of this.carrito) {
      this.valortotal = this.valortotal + x.preciototal;
    }
  }

  actualizarCarrito(){
    this.envio=true;
    let carrito2:any=[];
    if (
      this.descuento == null ||
      this.descuento == '' ||
      this.descuento == undefined
    ) {
      this.descuento = 0;
    }
    if(this.formEdicionCarrito.valid){
      if(this.producto.quantity>=this.cantidad){
        let data: any = {
          numeroproducto: this.numeroproducto2,
          cantidad: this.cantidad,
          preciounidad: this.precio,
          preciototal:
            this.precio * this.cantidad -
            (this.precio * this.cantidad * this.descuento) / 100,
          nombreproducto: this.nombreproducto,
          producto: this.producto,
          descuento: this.descuento,
        }
        for(let f of this.carrito){
          if(this.numeroproducto2 !=f.numeroproducto){
            carrito2.push(f);
          }else if(this.numeroproducto2==f.numeroproducto){
            carrito2.push(data);
          }
        }
        this.carrito=carrito2;
        this.valortotal = 0;
        for (let x of this.carrito) {
          this.valortotal= this.valortotal + x.preciototal;
        }
        this.cerrarModalCarrito();
        this.envio=false;
      }else{
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail:
            'La cantidad del producto ' +
            this.producto.nombre +
            ' es ' +
            this.cantidad +
            ' y no puede ser mayor a ' +
            this.producto.quantity,
        });
      }
    }
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
    this.filtroproductos = filtro;
  }

  initForms() {
    this.formBuscar = new FormGroup({
      producto: new FormControl('', [Validators.required]),
    });
    this.formCarrito = new FormGroup({
      cantidad: new FormControl('', [Validators.required, Validators.min(1)]),
      preciounidad: new FormControl('', [
        Validators.required,
        Validators.min(1),
      ]),
      descuento: new FormControl('', [Validators.max(100), Validators.min(0)]),
    });
    this.formEdicionCarrito = new FormGroup({
      cantidad: new FormControl('', [Validators.required, Validators.min(1)]),
      preciounidad: new FormControl('', [
        Validators.required,
        Validators.min(1),
      ]),
      descuento: new FormControl('', [Validators.max(100), Validators.min(0)]),
    });
  }


  //Metodos para manejo de modales
  cerrarModalCarrito(){
    this.producto="";
    this.cantidad="";
    this.precio="";
    this.descuento="";
    this.nombreproducto="";
    this.modalEdicionCarrito=false;
  }
}
