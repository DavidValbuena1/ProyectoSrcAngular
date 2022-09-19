import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PrimeNGConfig } from 'primeng/api';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  constructor(private router:Router, private primengConfig:PrimeNGConfig) { }

  nombreBotonSeleccionado="";
  barraLateralVisible:any;

  ngOnInit(): void {
    this.primengConfig.ripple=true;
    if(this.verificarSesion() == false){
      this.router.navigate(['']);
    }
    if(this.verificarSesion() == true){
      this.router.navigate(['administrador']);
    }
  }

  
  verificarSesion(){
    let user = localStorage.getItem("usuarioConectado");
    if(user == null || user == ""){
      return false;
    } else{
      return true;
    }
  }

  cerrarSesion(){
    localStorage.removeItem("usuarioConectado");
    this.router.navigate([""]);
  }

  cambiarBoton(n:string){
    this.nombreBotonSeleccionado=n;
    this.barraLateralVisible=false;
  }
}
