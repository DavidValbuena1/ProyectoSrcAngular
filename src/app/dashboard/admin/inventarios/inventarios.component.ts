import { Component, Input, OnInit } from '@angular/core';
import { InventarioService } from 'src/app/servicios/inventario.service';
import { PrimeNGConfig } from 'primeng/api';
import { CategoriaService } from 'src/app/servicios/categoria.service';
import { ProveedorService } from 'src/app/servicios/proveedor.service';
import Swal from 'sweetalert2';
import { Subscription } from 'rxjs';
import { ApplicationConfig } from '@angular/platform-browser';
import * as XLSX from 'xlsx';
import { Chart } from 'chart.js';
import { ExcelService } from 'src/app/servicios/excel.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-admin-inventarios',
  templateUrl: './inventarios.component.html',
  styleUrls: ['./inventarios.component.css'],
})
export class InventariosAdminComponent implements OnInit {
  constructor(
    private proveedorService: ProveedorService,
    private primengConfig: PrimeNGConfig,
    private inventarioService: InventarioService,
    private categoriaService: CategoriaService,
    private excelService: ExcelService
  ) {}

  formRegistro: FormGroup;
  //Creando las listas a usar
  listaProductos: any[] = [];
  listaCategorias: any[];
  listaProveedores: any[];

  //Creando variables para manejo de modales
  modalRegistro: boolean = false;
  botonActualizar: boolean = false;
  botonRegistrar: boolean = true;

  //Creando filtros
  filtroCategoria: any[];
  filtroproveedor: any[];
  filtroTalla: any[];
  talla: any;

  //Variables para el registro de productos
  producto: any;
  categoria: any;
  proveedor: any;
  tallaseleccionada: any = [];
  nombre: any;
  referencia: any;
  cantidad: any;
  preciounidad: any;
  preciototal: any;
  fecha: any;
  id_producto: any;
  envio: boolean = false;
  myChart: Chart;

  //Manejo de graficos dinamicos
  data: any;
  chartOptions: any;
  subscription: Subscription;
  config: ApplicationConfig;

  //Manejo de filtros para excel
  filtroExcel: any[];
  buscador: any;
  suggestions: any[];

  //Subida de archivos de excel
  excel: any;
  ExcelData: any[];

  ngOnInit(): void {
    this.primengConfig.ripple = true;
    this.buscarProductos();
    this.buscarCategorias();
    this.buscarProveedores();
    this.llenarTallas();
    this.llenarGraficoDeDona();
    this.initForms();
  }

  //Metodos para el CRUD y manejo de Datos de productos
  buscarProductos() {
    this.inventarioService.obtenerProductos().subscribe((x: any) => {
      this.listaProductos = x;
    });
  }

  buscarProductoPorId(id: number) {
    this.inventarioService.buscarProducto(id).subscribe((x: any) => {
      this.producto = x;
      this.id_producto = this.producto.id_producto;
      this.fecha = this.producto.date;
      this.nombre = this.producto.nombre;
      this.tallaseleccionada = {
        talla: this.producto.size,
      };
      this.proveedor = this.producto.proveedor;
      this.categoria = this.producto.type;
      this.preciototal = this.producto.precioTotal;
      this.preciounidad = this.producto.price;
      this.cantidad = this.producto.quantity;
      this.referencia = this.producto.reference;
      this.modalRegistro = true;
      this.botonRegistrar = false;
      this.botonActualizar = true;
    });
  }

  borrarProducto(data: number) {
    Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger',
      },
      buttonsStyling: false,
    });

    Swal.fire({
      title: 'Estás seguro?',
      text: 'Esto no tiene reversa',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si, borralo!',
      cancelButtonText: 'No, cancelalo!',
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        this.inventarioService.borrarProducto(data).subscribe((x: any) => {
          Swal.fire(
            'Eliminado',
            'El producto fue eliminado correctamente',
            'success'
          );
          this.ngOnInit();
        });
      } else if (
        /* Read more about handling dismissals below */
        result.dismiss === Swal.DismissReason.cancel
      ) {
        Swal.fire('Cancelado', 'Salvaste el producto :)', 'error');
      }
    });
  }

  registrarProducto() {
    this.envio = true;
    if (this.formRegistro.valid) {
      let data: any = [
        {
          id_producto: 0,
          size: this.tallaseleccionada.talla,
          nombre: this.nombre,
          reference: this.referencia,
          quantity: parseInt(this.cantidad),
          price: parseInt(this.preciounidad),
          type: this.categoria,
          proveedor: this.proveedor,
          precioTotal: parseInt(this.cantidad) * parseInt(this.preciounidad),
        },
      ];
      this.inventarioService.registrarProducto(data).subscribe((x: any) => {
        this.cerrarModalRegistro();
        Swal.fire(
          '¡Excelente!',
          'El producto "' +
            x[0].nombre +
            '" fue registrado exitosamente con el ID ' +
            x[0].id_producto,
          'success'
        );
        this.ngOnInit();
      });
    }
  }

  actualizarProducto() {
    this.envio = true;
    if (this.formRegistro.valid) {
      let data: any = {
        id_producto: this.producto.id_producto,
        size: this.tallaseleccionada.talla,
        nombre: this.producto.nombre,
        reference: this.referencia,
        date: this.producto.date,
        quantity: parseInt(this.cantidad),
        price: parseInt(this.preciounidad),
        type: this.categoria,
        proveedor: this.proveedor,
      };
      this.inventarioService.actualizarProducto(data).subscribe((x: any) => {
        this.cerrarModalRegistro();
        Swal.fire(
          '¡Excelente!',
          'El producto "'+x.nombre+'" con ID '+x.id_producto+' fue actualizado exitosamente',
          'success'
          )
        this.ngOnInit();
      });
    }
  }

  //Metodos para el manejo de modal y filtros para categoria, proveedores

  llenarTallas() {
    this.talla = [
      { talla: '2' },
      { talla: '4' },
      { talla: 'S' },
      { talla: 'XS' },
      { talla: 'M' },
      { talla: 'L' },
      { talla: 'XL' },
    ];
  }

  filtrarTallas(event: any) {
    let filtro: any[] = [];
    let Talla = event.query;

    for (let x of this.talla) {
      if (x.talla.toLowerCase().indexOf(Talla.toLowerCase()) == 0) {
        filtro.push(x);
      }
    }
    this.filtroTalla = filtro;
  }
  abrirmodalRegistro() {
    this.modalRegistro = true;
  }

  cerrarModalRegistro() {
    this.modalRegistro = false;
    this.categoria = '';
    this.tallaseleccionada = '';
    this.nombre = '';
    this.referencia = '';
    this.preciototal = '';
    this.preciounidad = '';
    this.proveedor = '';
    this.cantidad = '';
    this.botonRegistrar = true;
    this.botonActualizar = false;
    this.envio = false;
  }

  filtrarCategoria(event: any) {
    let filtro: any[] = [];
    let nombreCategoria = event.query;

    for (let x of this.listaCategorias) {
      if (x.nombre.toLowerCase().indexOf(nombreCategoria.toLowerCase()) == 0) {
        filtro.push(x);
      }
    }
    this.filtroCategoria = filtro;
  }

  filtrarProveedor(event: any) {
    let filtro: any[] = [];
    let nombreProveedor = event.query;

    for (let x of this.listaProveedores) {
      if (x.nombre.toLowerCase().indexOf(nombreProveedor.toLowerCase()) == 0) {
        filtro.push(x);
      }
    }
    this.filtroproveedor = filtro;
  }

  buscarCategorias() {
    this.categoriaService.obtenerCategorias().subscribe((x: any) => {
      this.listaCategorias = x;
    });
  }

  buscarProveedores() {
    this.proveedorService.obtenerProveedores().subscribe((x: any) => {
      this.listaProveedores = x;
    });
  }

  //Metodos para el manejo de graficos dinamicos
  llenarGraficoDeDona() {
    this.categoriaService.obtenerCategorias().subscribe((x: any) => {
      this.inventarioService.obtenerProductos().subscribe((y: any) => {
        let jean = 0;
        let pantalon = 0;
        let camiseta = 0;
        let camisa = 0;
        let calzado = 0;
        let tennis = 0;
        let chaqueta = 0;
        let maleta = 0;
        let accesorios = 0;
        let otros = 0;
        for (let categoria of y) {
          if (categoria.type.nombre == 'Jean') {
            jean += categoria.quantity;
          } else if (categoria.type.nombre == 'Pantalon Formal') {
            pantalon += categoria.quantity;
          } else if (categoria.type.nombre == 'Camiseta') {
            camiseta += categoria.quantity;
          } else if (categoria.type.nombre == 'Camisa') {
            camisa += categoria.quantity;
          } else if (categoria.type.nombre == 'Calzado Formal') {
            calzado += categoria.quantity;
          } else if (categoria.type.nombre == 'Tennis') {
            tennis += categoria.quantity;
          } else if (categoria.type.nombre == 'Chaqueta') {
            chaqueta += categoria.quantity;
          } else if (categoria.type.nombre == 'Maleta') {
            maleta += categoria.quantity;
          } else if (categoria.type.nombre == 'Accesorios') {
            accesorios += categoria.quantity;
          } else if (categoria.type.nombre == 'Otros') {
            otros += categoria.quantity;
          }
        }
        const ctx: any = document.getElementById('graficos');
        if (this.myChart) {
          this.myChart.destroy();
        }
        this.myChart = new Chart(ctx, {
          type: 'bar',
          data: {
            labels: [
              x[0].nombre,
              x[1].nombre,
              x[2].nombre,
              x[3].nombre,
              x[4].nombre,
              x[5].nombre,
              x[6].nombre,
              x[7].nombre,
              x[8].nombre,
              x[9].nombre,
            ],
            datasets: [
              {
                label: 'Cantidad',
                data: [
                  pantalon,
                  jean,
                  camiseta,
                  camisa,
                  calzado,
                  tennis,
                  chaqueta,
                  maleta,
                  accesorios,
                  otros,
                ],
                backgroundColor: [
                  'rgba(54, 162, 235)',
                  'rgba(201, 203, 207)',
                  'rgba(255, 99, 132)',
                  'rgba(255, 159, 64)',
                  'rgba(255, 205, 86)',
                  'rgba(75, 192, 192)',
                  'rgba(54, 162, 235)',
                  'rgba(153, 102, 255)',
                  'rgba(201, 203, 207)',
                  'rgba(255, 99, 132)',
                ],
                hoverBackgroundColor: [
                  'rgba(54, 162, 235, 0.2)',
                  'rgba(201, 203, 207, 0.2)',
                  'rgba(255, 99, 132, 0.2)',
                  'rgba(255, 159, 64, 0.2)',
                  'rgba(255, 205, 86, 0.2)',
                  'rgba(75, 192, 192, 0.2)',
                  'rgba(54, 162, 235, 0.2)',
                  'rgba(153, 102, 255, 0.2)',
                  'rgba(201, 203, 207, 0.2)',
                  'rgba(255, 99, 132, 0.2)',
                ],
                borderWidth: 1,
              },
            ],
          },
          options: {
            indexAxis: 'y',
          },
        });
      });
    });
  }

  exportExcel() {
    this.excelService.descargarExcelInventario(this.listaProductos);
  }

  filtro(event: any) {
    let filtrado: any[] = [];
    let filtro = event;
    for (let x of this.listaProductos) {
      if (filtro == '' || filtro == null) {
        this.buscarProductos();
      } else if (
        x.nombre.toLowerCase().indexOf(filtro.toLowerCase()) == 0 ||
        filtro.toLowerCase().indexOf(x.id_producto) == 0
      ) {
        filtrado.push(x);
        this.listaProductos = filtrado;
      }
    }
  }

  //Lector de excel
  readExcel(event: any) {
    let file = event.target.files[0];
    let fileRead = new FileReader();
    fileRead.readAsBinaryString(file);

    fileRead.onload = (e) => {
      var workBook = XLSX.read(fileRead.result, { type: 'binary' });
      var sheetNames = workBook.SheetNames;
      this.ExcelData = XLSX.utils.sheet_to_json(workBook.Sheets[sheetNames[0]]);
      for (let i of this.ExcelData) {
        this.proveedorService
          .buscarProveedorPorNombre(i.Proveedor)
          .subscribe((x: any) => {
            this.categoriaService
              .buscarCategoriaPorNombre(i.Categoria)
              .subscribe((y: any) => {
                if (
                  i.ID != 0 &&
                  i.ID != '' &&
                  i.ID != null &&
                  i.ID != undefined
                ) {
                  let data = {
                    id_producto: i.ID,
                    type: y,
                    proveedor: x,
                    size: i.Talla,
                    nombre: i.Nombre,
                    reference: i.Referencia,
                    quantity: i.Cantidad,
                    price: i.Precio_por_unidad,
                    precioTotal: i.Precio_total,
                    date: i.Fecha_de_entrada,
                  };
                  console.log(data);
                  this.inventarioService
                    .actualizarProducto(data)
                    .subscribe((x: any) => {
                      this.buscarProductos();
                      this.excel = '';
                    });
                } else {
                  let data = {
                    id_producto: 0,
                    type: y,
                    proveedor: x,
                    size: i.Talla,
                    nombre: i.Nombre,
                    reference: i.Referencia,
                    quantity: i.Cantidad,
                    price: i.Precio_por_unidad,
                    precioTotal: i.Precio_total,
                    date: i.Fecha_de_entrada,
                  };
                  this.inventarioService
                    .actualizarProducto(data)
                    .subscribe((x: any) => {
                      this.buscarProductos();
                      this.excel = '';
                    });
                }
              });
          });
      }
    };
  }

  generarReporte() {
    this.inventarioService.generarReportePdf().subscribe((x) => {
      let download = window.URL.createObjectURL(x);
      let link = document.createElement('a');
      link.href = download;
      link.download = 'ventas.pdf';
      link.click();
    });
  }

  initForms() {
    this.formRegistro = new FormGroup({
      nombre: new FormControl('', [Validators.required]),
      categoria: new FormControl('', [Validators.required]),
      cantidad: new FormControl('', [Validators.required, Validators.min(1)]),
      referencia: new FormControl('', [Validators.required]),
      talla: new FormControl('', [Validators.required]),
      precioporunidad: new FormControl('', [
        Validators.required,
        Validators.min(1),
      ]),
      proveedor: new FormControl('', [Validators.required]),
    });
  }
}
