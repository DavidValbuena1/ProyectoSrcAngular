import { Component, OnInit, ViewChild } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { SwalComponent } from "@sweetalert2/ngx-sweetalert2";
import Swal from "sweetalert2";
import { UsuarioService } from "../servicios/usuario.service";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"],
})
export class LoginComponent implements OnInit {
  constructor(private router: Router, private usuarioservice: UsuarioService) {}

  ngOnInit(): void {
    this.initForms();
  }
  @ViewChild('temporizador')
  public readonly deleteSwal!: SwalComponent;
  formContrasena:FormGroup;
  timer:boolean=false;

  email: any;
  password: any;
  codigo:any;
  usuario:any;
  contrasena:any;
  confirmar:any;

  formularioInicio:boolean=true;
  formularioRecuperar:boolean=false;
  formularioCodigo:boolean=false;
  formularioContrasena:boolean=false;


  IrAIniciar(){
    this.formularioInicio=true;
    this.formularioRecuperar=false;
    this.formularioCodigo=false;
    this.formularioContrasena=false;
  }
  iniciarSesion() {
    let data = {
      correo: this.email,
      contrasena: this.password,
    };
    this.usuarioservice.verificarUsuario(data).subscribe((x: any) => {
      localStorage.setItem("usuarioConectado", "");
      if (x == null) {
        Swal.fire("¡Upss!", "El correo y la contraseña no coinciden", "error");
      } else if (x.rol.id == 1) {
        localStorage.setItem("usuarioConectado", x.rol.id);
        localStorage.setItem("usuarioRol", x.rol.nombre);
        localStorage.setItem("usuarioNombre", x.nombres + " " + x.apellidos);
        this.router.navigate(["administrador"]);
      } else if (x.rol.id == 2) {
        localStorage.setItem("usuarioConectado", x.rol.id);
        localStorage.setItem("usuarioRol", x.rol.nombre);
        localStorage.setItem("usuarioNombre", x.nombres + " " + x.apellidos);
        this.router.navigate(["vendedor"]);
      }
    });
  }

  IrARecuperarContrasena() {
    this.formularioInicio=false;
    this.formularioRecuperar=true;
  }

  recuperarContrasena(){
    this.timer=true;
    let data ={
      correo: this.email
    };
    this.usuarioservice.enviarCorreoRecuperar(data).subscribe((x:any)=>{
      this.timer=false;
      Swal.fire(
        '¡Bien!',
        'Mensaje de verificación enviado',
        'success'
      );
        this.formularioInicio=false;
        this.formularioRecuperar=false;
        this.formularioCodigo=true;
    },error=>{
      this.timer=false;
      Swal.fire(
        '¡Error!',
        'Algo ocurrió y no pudimos enviar el codigo',
        'error'
      );
      
    }
    );
  }

  enviarCodigo(){
    this.timer=true;
    let data = {
      codigorecuperacion: this.codigo,
      usuario:{
        correo:this.email
      }
    };
    this.usuarioservice.enviarCodigo(data).subscribe((x:any)=>{
      this.usuario=x;
      if(this.usuario!=null){
        this.formularioCodigo=false;
        this.timer=false;
        this.formularioContrasena=true;
      }else{
        this.timer=false;
        Swal.fire(
          "¡Codigo invalido!",
          "El codigo ingresado no es valido, puede que sea incorrecto o haya caducado",
          "error"
        )
      }
    })
  }

  enviarContrasenaNueva(){
    if(this.formContrasena.valid){
      this.timer=true;
      this.usuario.contrasena=this.contrasena;
      this.usuario.confirmar=this.confirmar;
      this.usuarioservice.editarUsuario(this.usuario,this.usuario.id_usuario).subscribe((x:any)=>{
        this.timer=false;
        this.formularioRecuperar=false;
        this.formularioCodigo=false;
        this.formularioContrasena=false;
        this.formularioInicio=true;
      })
    }
  }

  initForms(){
    this.formContrasena = new FormGroup({
      contrasena: new FormControl("",[Validators.required]),
      confirmar: new FormControl("",[Validators.required])
    })
  }
}
