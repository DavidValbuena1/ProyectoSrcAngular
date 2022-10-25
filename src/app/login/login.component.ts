import { Component, OnInit } from "@angular/core";
import { EmailValidator } from "@angular/forms";
import { Router } from "@angular/router";
import Swal from "sweetalert2";
import { UsuarioService } from "../servicios/usuario.service";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"],
})
export class LoginComponent implements OnInit {
  constructor(private router: Router, private usuarioservice: UsuarioService) {}

  ngOnInit(): void {}

  email: any;
  password: any;

  formularioInicio:boolean=true;
  formularioRecuperar:boolean=false;
  iniciarSesion() {
    let data = {
      correo: this.email,
      contraseña: this.password,
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

  enviarCorreoRecuperar(){
    
  }
}
