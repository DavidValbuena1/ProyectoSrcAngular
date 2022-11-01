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
      console.log(x);

      if (x == null) {
        Swal.fire("¡Upss!", "El correo y la contraseña no coinciden", "error");
      } else if (x.rol.id == 1) {
        this.router.navigate(["administrador"]);
      } else if (x.rol.id == 2) {
        this.router.navigate(["vendedor"]);
      }
      localStorage.setItem("usuarioConectado", x.rol.id);
      localStorage.setItem("usuarioNombre", x.nombres + " " + x.apellidos);
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
    let data = {
      codigorecuperacion: this.codigo,
      usuario:{
        correo:this.email
      }
    };
    this.usuarioservice.enviarCodigo(data).subscribe((x:any)=>{
      this.usuario=x;
      this.formularioCodigo=false;
      this.formularioContrasena=true;
    })
  }

  enviarContrasenaNueva(){
    if(this.formContrasena.valid){
      this.usuario.contrasena=this.contrasena;
      this.usuario.confirmar=this.confirmar;
      this.usuarioservice.editarUsuario(this.usuario,this.usuario.id_usuario).subscribe((x:any)=>{
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
