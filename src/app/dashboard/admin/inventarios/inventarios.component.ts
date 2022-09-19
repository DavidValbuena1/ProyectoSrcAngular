import { Component, Input, OnInit } from '@angular/core';
import { InventarioService } from 'src/app/servicios/inventario.service';
import { PrimeNGConfig } from 'primeng/api';
import { CategoriaService } from 'src/app/servicios/categoria.service';
import { ProveedorService } from 'src/app/servicios/proveedor.service';
import Swal from 'sweetalert2';
import { Subscription } from 'rxjs';
import { ApplicationConfig } from '@angular/platform-browser';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';

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
    private categoriaService: CategoriaService
  ) {}

  //Creando las listas a usar
  listaProductos: any[] = [];
  listaCategorias: any[];
  listaProveedores: any[];

  //Creando variables para manejo de modales
  modalRegistro: boolean = false;
  modalActualizacion: boolean = false;

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
        talla:this.producto.size
      }
      this.proveedor = this.producto.proveedor;
      this.categoria = this.producto.type;
      this.preciototal = this.producto.precioTotal;
      this.preciounidad = this.producto.price;
      this.cantidad = this.producto.quantity;
      this.referencia = this.producto.reference;
      this.modalActualizacion = true;
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
    let data: any = [
      {
        id_producto: 0,
        size: this.tallaseleccionada.talla,
        nombre: this.nombre,
        reference: this.referencia,
        quantity: parseInt(this.cantidad),
        price: parseInt(this.preciounidad),
        type: {
          id: this.categoria.id,
        },
        proveedor: {
          id_proveedor: this.proveedor.id_proveedor,
        },
      },
    ];
    this.inventarioService.registrarProducto(data).subscribe((x: any) => {
      this.cerrarModalRegistro();
      this.ngOnInit();
    });
  }

  actualizarProducto() {
    let data: any = {
      id_producto: this.producto.id_producto,
      size: this.tallaseleccionada.talla,
      nombre: this.producto.nombre,
      reference: this.referencia,
      date: this.producto.date,
      quantity: parseInt(this.cantidad),
      price: parseInt(this.preciounidad),
      type: {
        id: this.categoria.id,
      },
      proveedor: {
        id_proveedor: this.proveedor.id_proveedor,
      },
    };
    this.inventarioService.actualizarProducto(data).subscribe((x: any) => {
      this.cerrarModalActualizacion();
      this.ngOnInit();
    });
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
    this.tallaseleccionada.talla = '';
    this.nombre = '';
    this.referencia = '';
    this.preciototal = '';
    this.preciounidad = '';
    this.proveedor = '';
    this.cantidad = '';
  }

  abrirModalActualizacion() {
    this.modalActualizacion = true;
  }

  cerrarModalActualizacion() {
    this.modalActualizacion = false;
    this.categoria = '';
    this.tallaseleccionada.talla = '';
    this.nombre = '';
    this.referencia = '';
    this.preciototal = '';
    this.preciounidad = '';
    this.proveedor = '';
    this.cantidad = '';
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
      console.log(x);

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
        this.data = {
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
                '#42A5F5',
                '#66BB6A',
                '#FFA726',
                '#FFA726',
                '#FFA726',
                '#FFA726',
                '#FFA726',
                '#FFA726',
                '#FFA726',
                '#FFA726',
              ],
              hoverBackgroundColor: [
                '#64B5F6',
                '#81C784',
                '#FFB74D',
                '#FFA726',
                '#FFA726',
                '#FFA726',
                '#FFA726',
                '#FFA726',
                '#FFA726',
                '#FFA726',
              ],
            },
          ],
        };
      });
    });
  }

  exportExcel() {
    let listaFiltro: any[] = [];
    for (let y of this.listaProductos) {
      let data: any = {
        id_producto: y.id_producto,
        Talla: y.size,
        Nombre: y.nombre,
        Reference: y.reference,
        Quantity: y.quantity,
        Price: y.price,
        Type: y.type.nombre,
        Proveedor: y.proveedor.nombre,
        Preciototal: y.precioTotal,
      };

      listaFiltro.push(data);
    }
    this.filtroExcel = listaFiltro;
    console.log(listaFiltro);
    const worksheet = XLSX.utils.json_to_sheet(listaFiltro);
    const workbook = { Sheets: { data: worksheet }, SheetNames: ['data'] };
    const excelBuffer: any = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array',
    });
    this.saveAsExcelFile(excelBuffer, 'productos');
  }

  saveAsExcelFile(buffer: any, fileName: string): void {
    let EXCEL_TYPE =
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    let EXCEL_EXTENSION = '.xlsx';
    const data: Blob = new Blob([buffer], {
      type: EXCEL_TYPE,
    });
    FileSaver.saveAs(
      data,
      fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION
    );
    this.buscarProductos();
    this.buscador = '';
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
    console.log(this.listaProductos);
  }

  //Lector de excel
  readExcel(event: any) {
    let file = event.target.files[0];
    let fileRead = new FileReader();
    console.log('Leyendo');

    fileRead.readAsBinaryString(file);

    fileRead.onload = (e) => {
      var workBook = XLSX.read(fileRead.result, { type: 'binary' });
      var sheetNames = workBook.SheetNames;
      this.ExcelData = XLSX.utils.sheet_to_json(workBook.Sheets[sheetNames[0]]);
      for (let i of this.ExcelData) {
        if (i.id != 0 || i.id != '') {
          let data = {
            id_producto: i.id_producto,
            type: {
              id: i.type,
            },
            proveedor: {
              id_proveedor: i.proveedor,
            },
            size: i.size,
            nombre: i.nombre,
            reference: i.reference,
            quantity: i.quantity,
            price: i.price,
            precioTotal: i.preciototal,
            date: new Date(),
          };
          console.log(data);
          this.inventarioService
            .actualizarProducto(data)
            .subscribe((x: any) => {
              console.log('salimos');

              this.buscarProductos();
              this.excel = '';
            });
        } else {
        }
      }
    };
  }
}
