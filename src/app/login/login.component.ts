import { Component, OnInit } from '@angular/core';
import { EmailValidator } from '@angular/forms';
import { Router } from '@angular/router';
import { UsuarioService } from '../servicios/usuario.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private router:Router, private usuarioservice:UsuarioService) { }

  ngOnInit(): void {
  }

  email:any;
  password:any;
  iniciarSesion(){
    let data={
      correo:this.email,
      contraseña:this.password
    }

    this.usuarioservice.verificarUsuario(data).subscribe((x:any)=>{
      console.log(x);
      localStorage.setItem("usuarioConectado","");

      localStorage.setItem("usuarioConectado",JSON.stringify(x));


      try{

        if(x.rol.id == 1){
          this.router.navigate(['administrador']);
        }
        else if(x.rol.id == 2){
          this.router.navigate(['vendedor']);
        }
        }catch(err){
          alert("EL USUARIO NO EXISTE");

        }

    })
  }
}
