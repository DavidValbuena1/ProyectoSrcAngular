import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ExcelService } from 'src/app/servicios/excel.service';
import { UsuarioService } from 'src/app/servicios/usuario.service';
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css'],
})
export class UsuariosComponent implements OnInit {
  constructor(
    private usuarioService: UsuarioService,
    private mensajeService: MessageService,
    private excelService: ExcelService
  ) {}

  ngOnInit(): void {
    this.buscarUsuarios();
    this.buscarRoles();
    this.buscarTipos();
    this.initForms();
    this.minDate = new Date();
    this.minDate.setDate(1);
    this.minDate.setMonth(12);
    this.minDate.setFullYear(2005);
  }

  formRegistro: FormGroup;

  //Variables para manejo CRUD
  listaUsuarios: any[];
  listaTiposDocumentos: any[];
  listaRoles: any[];
  nombres: any;
  apellidos: any;
  numerodocumento: any;
  fechanacimiento: any;
  correo: any;
  direccion: any;
  tipodocumento: any;
  rol: any;
  contrasena: any;
  confirmar: any;
  telefono: any;
  id:any;
  correo2:any;

  envio: boolean = false;
  tituloRegistro:boolean=true;
  tituloActualizacion:boolean=false;

  //Variables para manejo de filtros
  filtroTipodocumento: any;
  filtroRoles: any;
  minDate: Date;
  buscador:any;
  ExcelData:any;
  excel:any;

  //Metodos para manejo CRUD
  buscarUsuarios() {
    this.usuarioService.obtenerUsuarios().subscribe((x: any) => {
      this.listaUsuarios = x;
    });
  }

  buscarTipos() {
    this.usuarioService.obtenerTipos().subscribe((x: any) => {
      this.listaTiposDocumentos = x;
    });
  }

  buscarRoles() {
    this.usuarioService.obtenerRoles().subscribe((x: any) => {
      this.listaRoles = x;
    });
  }

  crearUsuario() {
    this.envio = true;
    if (this.formRegistro.valid) {
      let prueba: boolean = false;
      this.buscarUsuarios();
      for (let x of this.listaUsuarios) {
        if (x.correo == this.correo) {
          prueba = true;
        }
      }
      let contrasena: string = this.contrasena;
      let regex =
        /^(?=(?:.*[A-Z]){1})(?=(?:.*[a-z]){1})(?=(?:.*[0-9]){1})\S{8,16}$/;
      console.log(contrasena.match(regex));

      if (contrasena.match(regex)) {
        if (this.contrasena == this.confirmar) {
          if (prueba == false) {
            let data: any = {
              apellidos: this.apellidos,
              confirmar: this.confirmar,
              contrasena: this.contrasena,
              correo: this.correo,
              direccion: this.direccion,
              fecha: this.fechanacimiento,
              nombres: this.nombres,
              num_identificacion_usuario: this.numerodocumento,
              rol: this.rol,
              telefono: this.telefono,
              tipoDocumento: this.tipodocumento,
            };
            this.usuarioService.insertarUsuario(data).subscribe((x: any) => {
              Swal.fire(
                '¡Excelente!',
                'El usuario ' +
                  this.nombres +
                  ' ' +
                  this.apellidos +
                  ' se ha creado con Rol ' +
                  this.rol.nombre,
                'success'
              );
              this.apellidos = '';
              this.confirmar = '';
              this.contrasena = '';
              this.correo = '';
              this.direccion = '';
              this.fechanacimiento = '';
              this.nombres = '';
              this.numerodocumento = '';
              this.rol = '';
              this.telefono = '';
              this.tipodocumento = '';
              this.envio = false;
              this.ngOnInit();
            });
          } else {
            this.mensajeService.add({
              severity: 'error',
              summary: 'Error',
              detail:
                'El correo ' + this.correo + ' ya existe, elige otro porfavor',
            });
          }
        } else {
          this.mensajeService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Las contraseñas no coinciden',
          });
        }
      } else {
        this.mensajeService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Las contraseña no tiene todos los requisitos',
        });
      }
    }
  }

  buscarUsuarioPorId(event: any) {
    this.usuarioService.buscarUsuario(event).subscribe((x: any) => {
      Swal.mixin({
        customClass: {
          confirmButton: 'btn btn-success',
          cancelButton: 'btn btn-danger',
        },
        buttonsStyling: false,
      });

      Swal.fire({
        title: '¿Quieres editar este usuario?',
        text: 'Cargaremos toda la información en el formulario',
        icon: 'warning',
        confirmButtonText: 'Si, quiero editarlo!'
      }).then((result) => {
        if (result.isConfirmed) {
          this.apellidos = x.apellidos;
          this.confirmar = x.confirmar;
          this.contrasena = x.contraseña;
          this.correo = x.correo;
          this.correo2=x.correo;
          this.direccion = x.direccion;
          this.fechanacimiento = x.fecha;
          this.nombres = x.nombres;
          this.numerodocumento = x.num_identificacion_usuario;
          this.rol = x.rol;
          this.telefono = x.telefono;
          this.tipodocumento = x.tipoDocumento;
          this.id=x.id_usuario;
          this.tituloActualizacion=true;
          this.tituloRegistro=false;
        }
      });
    });
  }

  actualizarUsuario(){
    this.envio = true;
    if (this.formRegistro.valid) {
      let prueba: boolean = false;
      this.buscarUsuarios();
      for (let x of this.listaUsuarios) {
        if (x.correo == this.correo) {
          prueba = true;
        }
      }
      if(this.correo2==this.correo){
        prueba=false;
      }
      let contrasena: string = this.contrasena;
      let regex =
        /^(?=(?:.*[A-Z]){1})(?=(?:.*[a-z]){1})(?=(?:.*[0-9]){1})\S{8,16}$/;
      console.log(contrasena.match(regex));

      if (contrasena.match(regex)) {
        if (this.contrasena == this.confirmar) {
          if (prueba == false) {
            let data: any = {
              apellidos: this.apellidos,
              confirmar: this.confirmar,
              contrasena: this.contrasena,
              correo: this.correo,
              direccion: this.direccion,
              fecha: this.fechanacimiento,
              nombres: this.nombres,
              num_identificacion_usuario: this.numerodocumento,
              rol: this.rol,
              telefono: this.telefono,
              tipoDocumento: this.tipodocumento,
            };
            this.usuarioService.editarUsuario(data,this.id).subscribe((x: any) => {
              Swal.fire(
                '¡Excelente!',
                'El usuario ' +
                  this.nombres +
                  ' ' +
                  this.apellidos +
                  ' se ha editado con exito ',
                'success'
              );
              this.apellidos = '';
              this.confirmar = '';
              this.contrasena = '';
              this.correo = '';
              this.direccion = '';
              this.fechanacimiento = '';
              this.nombres = '';
              this.numerodocumento = '';
              this.rol = '';
              this.telefono = '';
              this.tipodocumento = '';
              this.envio = false;
              this.tituloActualizacion=false;
              this.tituloRegistro=true;
              this.ngOnInit();
            });
          } else {
            this.mensajeService.add({
              severity: 'error',
              summary: 'Error',
              detail:
                'El correo ' + this.correo + ' ya existe, elige otro porfavor',
            });
          }
        } else {
          this.mensajeService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Las contraseñas no coinciden',
          });
        }
      } else {
        this.mensajeService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Las contraseña no tiene todos los requisitos',
        });
      }
    }
  }

  cancelarActualizacion(){
    this.apellidos = "";
          this.confirmar = "";
          this.contrasena ="";
          this.correo = "";
          this.direccion = "";
          this.fechanacimiento ="";
          this.nombres = "";
          this.numerodocumento = "";
          this.rol = "";
          this.telefono = "";
          this.tipodocumento = "";
          this.id="";
          this.tituloActualizacion=false;
          this.tituloRegistro=true;
  }
  borrarUsuario(event: any) {
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
        this.usuarioService.eliminarUsuario(event).subscribe((x: any) => {
          Swal.fire(
            'Excelente',
            'El usuario con id ' + event + ' se ha eliminado correctamente',
            'success'
          );
          this.buscarUsuarios();
        });
      } else if (
        /* Read more about handling dismissals below */
        result.dismiss === Swal.DismissReason.cancel
      ) {
        Swal.fire('Cancelado', 'Salvaste el usuario :)', 'error');
      }
    });
  }
  //Metodos para manejo de filtros
  filtrarTipos(event: any) {
    let filtro: any[] = [];
    let nombreproductos = event.query;

    for (let x of this.listaTiposDocumentos) {
      if (
        x.nombre.toLowerCase().indexOf(nombreproductos.toLowerCase()) == 0 ||
        nombreproductos == x.id
      ) {
        filtro.push(x);
      }
    }
    this.filtroTipodocumento = filtro;
  }

  filtrarRoles(event: any) {
    let filtro: any[] = [];
    let nombreproductos = event.query;

    for (let x of this.listaRoles) {
      if (
        x.nombre.toLowerCase().indexOf(nombreproductos.toLowerCase()) == 0 ||
        nombreproductos == x.id
      ) {
        filtro.push(x);
      }
    }
    this.filtroRoles = filtro;
  }

  filtro(event:any){
    let filtrado: any[] = [];
    let filtro = event;
    for (let x of this.listaUsuarios) {
      if (filtro == '' || filtro == null) {
        this.buscarUsuarios();
      } else if (
        x.nombres.toLowerCase().indexOf(filtro.toLowerCase()) == 0 ||
        x.apellidos.toLowerCase().indexOf(filtro.toLowerCase()) == 0 ||
        filtro.toLowerCase().indexOf(x.id_usuario) == 0
      ) {
        filtrado.push(x);
        this.listaUsuarios = filtrado;
      }
    }
  }

  exportExcel(){
    this.excelService.descargarExcelUsuarios(this.listaUsuarios);
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
        console.log(i.Tipo_de_documento);

        let rol:any;
        let tipoDocumento:any;
        if(i.Rol=="Administrador"){
          rol={
            id:1,
            nombre:"Administrador"
          }
        }else if(i.Rol=="Vendedor"){
          rol={
            id:2,
            nombre:"Vendedor"
          }
          }else{
            console.log("Ese rol no existe");
          }

          if(i.Tipo_de_documento=="Cedula de Ciudadania"){
            tipoDocumento={
              idTipoDocumento:1,
              nombre:"Cedula de ciudadania"
            }
          }else if(i.Tipo_de_documento=="Cedula de Extranjeria"){
            tipoDocumento={
              idTipoDocumento:2,
              nombre:"Cedula de Extranjeria"
            }
          }else if(i.Tipo_de_documento=="Tarjeta de identidad"){
            tipoDocumento={
              idTipoDocumento:3,
              nombre:"Tarjeta de Identidad"
            }
          }else if(i.Tipo_de_documento=="(PEP) Permiso Especial de Permanencia"){
            tipoDocumento={
              idTipoDocumento:4,
              nombre:"(PEP) Permiso Especial de Permanencia"
            }
          }else{
            console.log("Ese tipo de documento no existe");
          }
          if (i.ID != 0 && i.ID != '' && i.ID!=undefined && i.ID!=null) {

            this.usuarioService.buscarUsuario(parseInt(i.ID)).subscribe((x:any)=>{
              data = {
                apellidos:i.Apellidos,
                confirmar:x.confirmar,
                contraseña:x.contraseña,
                correo: i.Correo_Electronico,
                direccion:i.Dirección,
                fecha: i.Fecha_de_nacimiento,
                id_usuario:i.ID,
                nombres:i.Nombres,
                num_Identificacion_usuario:i.Numero_de_documento,
                rol:rol,
                telefono:i.Telefono,
                tipoDocumento:tipoDocumento

              };
              this.usuarioService.insertarUsuario(data).subscribe((x:any)=>{
                this.buscarUsuarios();
                this.excel="";
              })
            })
          } else {
            let contraseña;
            if(i.Contraseña == 0 || i.Contraseña == '' || i.Contraseña==undefined || i.Contraseña!=null){
              contraseña="Elgranmadrugon"
            }
            data = {
              apellidos:i.Apellidos,
              confirmar:contraseña,
              contraseña:contraseña,
              correo: i.Correo_Electronico,
              direccion:i.Dirección,
              fecha: i.Fecha_de_nacimiento,
              nombres:i.Nombres,
              num_Identificacion_usuario:i.Numero_de_documento,
              rol:rol,
              telefono:i.Telefono,
              tipoDocumento:tipoDocumento

            };

            this.usuarioService.insertarUsuario(data).subscribe((x:any)=>{
              this.buscarUsuarios();
              this.excel="";
            })
          }
      }
    };
  }

  initForms() {
    this.formRegistro = new FormGroup({
      nombres: new FormControl('', [Validators.required]),
      apellidos: new FormControl('', [Validators.required]),
      tipodocumento: new FormControl('', [Validators.required]),
      numerodocumento: new FormControl('', [
        Validators.required,
        Validators.minLength(7),
        Validators.maxLength(10),
      ]),
      fechanacimiento: new FormControl('', [Validators.required]),
      correo: new FormControl('', [Validators.required, Validators.email]),
      direccion: new FormControl('', [Validators.required]),
      rol: new FormControl('', [Validators.required]),
      contrasena: new FormControl('', [
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(16),
      ]),
      confirmar: new FormControl('', [
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(16),
      ]),
      telefono: new FormControl('', [Validators.required]),
    });
  }
}
