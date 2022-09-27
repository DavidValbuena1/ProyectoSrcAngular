import { Component, OnInit } from '@angular/core';
import { CategoriaService } from 'src/app/servicios/categoria.service';
import { ProveedorService } from 'src/app/servicios/proveedor.service';
import Swal from 'sweetalert2';
import { FormGroup, FormControl, Validators} from '@angular/forms';
import * as XLSX from 'xlsx';
import { ExcelService } from 'src/app/servicios/excel.service';

@Component({
  selector: 'app-admin-proveedores',
  templateUrl: './proveedores.component.html',
  styleUrls: ['./proveedores.component.css'],
})
export class ProveedoresAdminComponent implements OnInit {
  constructor(
    private proveedorService: ProveedorService,
    private categoriaService: CategoriaService,
    private excelService: ExcelService
  ) {}

  ngOnInit(): void {
    this.buscarProveedores();
    this.buscarCategorias();
    this.initForms();
  }

  formRegistro:FormGroup = new FormGroup({});
  //Variables para manejo CRUD
  listaProveedores: any[];
  listaCategorias: any[];
  nombre: any;
  ciudad: any;
  correo1: any;
  correo2: any;
  direccion1: any;
  direccion2: any;
  id_proveedor: any;
  nit: any;
  nombreempresa: any;
  categoria: any;
  buscador1:any;
  buscador2:any;
  buscador3:any;

  //Variables para manejo de modales
  modalRegistro: boolean = false;
  envio:boolean=false;
  botonRegistrar:boolean=false;
  botonActualizar:boolean=false;

  //Variables para manejo de filtros
  filtroCategoria: any;
  filtroExcel:any;
  buscador:any;
  ExcelData:any;
  excel:any;
  suggestions:any;

  buscarProveedores() {
    this.proveedorService.obtenerProveedores().subscribe((x: any) => {
      this.listaProveedores = x;
      this.buscador="";
    });
  }

  buscarCategorias() {
    this.categoriaService.obtenerCategorias().subscribe((x: any) => {
      this.listaCategorias = x;
    });
  }

  probar() {
    let nit: string = this.nit;
    nit =
      nit.substring(0, 3) +
      '-' +
      nit.substring(3, 6) +
      '.' +
      nit.substring(6, 9);
    console.log(nit);
  }

  buscarProveedorPorId(event: any) {
    this.botonActualizar=true;
    this.proveedorService.buscarProveedorPorId(event).subscribe((x: any) => {
      this.nombre = x.nombre;
      this.ciudad = x.ciudad;
      this.correo1 = x.correo1;
      this.correo2 = x.correo2;
      this.direccion1 = x.direccion1;
      this.direccion2 = x.direccion2;
      this.id_proveedor = x.id_proveedor;
      let nit:string=x.nit;
      if(nit.length ==11){
        this.nit= nit.substring(0,3)+nit.substring(4,7)+nit.substring(8,11)
      }else if(nit.length==13){
        this.nit= nit.substring(0,3)+nit.substring(4,7)+nit.substring(8,11)+nit.substring(12,13)
      }
      this.nombreempresa = x.nombreEmpresa;
      this.categoria =x.categoria
      this.modalRegistro=true;
    });
  }

  borrarProveedor(event: any) {
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
        try {
          this.proveedorService
            .eliminarProveedor(event)
            .subscribe((x: any) => {
              Swal.fire(
                'Eliminado',
                'El proveedor fue eliminado correctamente',
                'success'
              );
              this.ngOnInit();
            })
            .console.error();
        } catch (error) {
          Swal.fire('¡Upss!', 'El proveedor no puede ser eliminado', 'error');
        }
      } else if (
        /* Read more about handling dismissals below */
        result.dismiss === Swal.DismissReason.cancel
      ) {
        Swal.fire('Cancelado', 'Salvaste el proveedor :)', 'success');
      }
    });
  }

  registrarProveedor() {
    this.envio=true;
    if(this.formRegistro.valid){

      let nit: string = this.nit;
      let numero=nit.length;
      if(numero==9){
        nit =
        nit.substring(0, 3) +
        '.' +
        nit.substring(3, 6) +
        '.' +
        nit.substring(6, 9);
      }else if(numero==10){
        nit =
        nit.substring(0, 3) +
        '.' +
        nit.substring(3, 6) +
        '.' +
        nit.substring(6, 9)+
        "-"+nit.substring(9,10);
      }
      let data:any=[{

        nombre:this.nombre,
        ciudad:this.ciudad,
        correo1:this.correo1,
        correo2:this.correo2,
        direccion1:this.direccion1,
        direccion2:this.direccion2,
        nit:nit,
        nombreEmpresa:this.nombreempresa,
        categoria:this.categoria
      }]
      this.proveedorService.agregarProveedor(data).subscribe((x:any)=>{
        this.buscarProveedores();
        this.cerrarModalRegistro();
      });
    }else{
      this.modalRegistro=false;
      Swal.mixin({
        customClass: {
          confirmButton: 'btn btn-success',
          cancelButton: 'btn btn-danger',
        },
        buttonsStyling: false,
      });

      Swal.fire({
        title: '¡Upss!',
        text: 'Haz dejado algunos campos vacios, ¡Vamos a llenarlos!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: '¡Ok!',
        cancelButtonText: 'Salir',
        reverseButtons: true,
      }).then((result) => {
        if (result.isConfirmed) {
          this.modalRegistro=true;
        } else if (
          result.dismiss === Swal.DismissReason.cancel
        ) {
          this.cerrarModalRegistro();
        }
      });

    }
  }

  actualizarProveedor(){
    this.envio=true;
    if(this.formRegistro.valid){

      let nit: string = this.nit;
      let numero=nit.length;
      if(numero==9){
        nit =
        nit.substring(0, 3) +
        '.' +
        nit.substring(3, 6) +
        '.' +
        nit.substring(6, 9);
      }else if(numero==10){
        nit =
        nit.substring(0, 3) +
        '.' +
        nit.substring(3, 6) +
        '.' +
        nit.substring(6, 9)+
        "-"+nit.substring(9,10);
      }
      let data:any={

        nombre:this.nombre,
        ciudad:this.ciudad,
        correo1:this.correo1,
        correo2:this.correo2,
        direccion1:this.direccion1,
        direccion2:this.direccion2,
        nit:nit,
        nombreEmpresa:this.nombreempresa,
        categoria:this.categoria
      }

      this.proveedorService.editarProveedor(data,this.id_proveedor).subscribe((x:any)=>{
        this.buscarProveedores();
        this.cerrarModalRegistro();
      });
    }else{
      this.modalRegistro=false;
      Swal.mixin({
        customClass: {
          confirmButton: 'btn btn-success',
          cancelButton: 'btn btn-danger',
        },
        buttonsStyling: false,
      });

      Swal.fire({
        title: '¡Upss!',
        text: 'Haz dejado algunos campos vacios, ¡Vamos a llenarlos!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: '¡Ok!',
        cancelButtonText: 'Salir',
        reverseButtons: true,
      }).then((result) => {
        if (result.isConfirmed) {
          this.modalRegistro=true;
        } else if (
          result.dismiss === Swal.DismissReason.cancel
        ) {
          this.cerrarModalRegistro();
        }
      });

    }
  }

  cerrarModalRegistro() {
    this.modalRegistro = false;
    this.nombre = '';
    this.ciudad = '';
    this.correo1 = '';
    this.correo2 = '';
    this.direccion1 = '';
    this.direccion2 = '';
    this.id_proveedor = '';
    this.nit = '';
    this.nombreempresa = '';
    this.categoria = '';
    this.botonActualizar=false;
    this.botonRegistrar=false;
  }

  abrirmodalRegistro() {
    this.modalRegistro = true;
    this.botonRegistrar=true;
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

  filtro(event:any){
    let filtrado: any[] = [];
    let filtro = event;
    for (let x of this.listaProveedores) {
      let id = x.id_proveedor+""
      if (filtro == '' || filtro == null) {
        this.buscarProveedores();
      } else if (
        x.nombre.toLowerCase().indexOf(filtro.toLowerCase()) == 0 ||
        id.startsWith(filtro)==true
      ) {
        filtrado.push(x);
        this.listaProveedores = filtrado;
        this.suggestions=filtrado;
      }
    }
  }

  filtroId(event:any){
    let filtrado: any[] = [];
    let filtro = event;
    for (let x of this.listaProveedores) {
      let id = x.id_proveedor+""
      if (filtro == '' || filtro == null) {
        this.buscarProveedores();
      } else if (
        id.startsWith(filtro)==true
      ) {
        filtrado.push(x);
        this.listaProveedores = filtrado;
        this.suggestions=filtrado;
      }
    }
  }

  filtroNombre(event:any){
    let filtrado: any[] = [];
    let filtro = event;
    for (let x of this.listaProveedores) {
      if (filtro == '' || filtro == null) {
        this.buscarProveedores();
      } else if (
        x.nombre.toLowerCase().indexOf(filtro.toLowerCase()) == 0 
      ) {
        filtrado.push(x);
        this.listaProveedores = filtrado;
        this.suggestions=filtrado;
      }
    }
  }

  filtroCiudad(event:any){
    let filtrado: any[] = [];
    let filtro = event;
    for (let x of this.listaProveedores) {
      if (filtro == '' || filtro == null) {
        this.buscarProveedores();
      } else if (
        x.ciudad.toLowerCase().indexOf(filtro.toLowerCase()) == 0 
      ) {
        filtrado.push(x);
        this.listaProveedores = filtrado;
        this.suggestions=filtrado;
      }
    }
  }


  exportExcel(){
    this.excelService.descargarExcelProveedores(this.listaProveedores);
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

        this.categoriaService.buscarCategoriaPorNombre(i.Categoria).subscribe((x:any)=>{
          if (i.id != 0 || i.id != '') {
            data = [{
              id_proveedor: i.ID,
              ciudad: i.Ciudad,
              correo1: i.Correo_principal,
              correo2: i.Correo_secundario,
              direccion1: i.Direccion_principal,
              direccion2: i.Direccion_secundaria,
              nit: i.NIT,
              nombre: i.Nombre,
              nombreEmpresa: i.Nombre_de_la_empresa,
              categoria:x
            }];
          } else {
            data = [{
              ciudad: i.Ciudad,
              correo1: i.Correo_Principal,
              correo2: i.Correo_Secundario,
              direccion1: i.Direccion_principal,
              direccion2: i.Direccion_secundaria,
              nit: i.NIT,
              nombre: i.Nombre,
              nombreEmpresa: i.Nombre_de_la_empresa,
              categoria:x
            }];
          }
          lista.push(data);
          this.proveedorService.agregarProveedor(data).subscribe((x:any)=>{
            this.buscarProveedores();
            this.excel="";
          })

        })

      }
    };
  }

  initForms(){
    this.formRegistro = new FormGroup({
      nombre: new FormControl("",[Validators.required,Validators.maxLength(255)]),
      ciudad: new FormControl("",[Validators.required,Validators.maxLength(255)]),
      correo1: new FormControl("",[Validators.required,Validators.maxLength(255),Validators.email]),
      correo2: new FormControl("",[Validators.maxLength(255),Validators.email]),
      direccion1: new FormControl("",[Validators.required,Validators.maxLength(255)]),
      direccion2: new FormControl("",[Validators.maxLength(255)]),
      nit: new FormControl("",[Validators.required,Validators.minLength(9),Validators.maxLength(10)]),
      nombreEmpresa: new FormControl("",[Validators.required]),
      categoria: new FormControl ("",[Validators.required])
    })
  }

  generarReporte(){
    this.proveedorService.generarReportePdf().subscribe((x)=>{
      let download = window.URL.createObjectURL(x);
      let link = document.createElement("a");
      link.href=download;
      link.download="proveedor.pdf";
      link.click();
    })
  }
}
