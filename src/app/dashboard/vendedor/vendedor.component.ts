import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PrimeNGConfig } from 'primeng/api';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-vendedor',
  templateUrl: './vendedor.component.html',
  styleUrls: ['./vendedor.component.css']
})
export class VendedorComponent implements OnInit {
  constructor(private router: Router, private primengConfig: PrimeNGConfig) {}

  nombreBotonSeleccionado = '';
  barraLateralVisible: any;


  nombre:any="";
  rol:any="";
  ngOnInit(): void {
    this.primengConfig.ripple = true;
    this.verificarSesion();
  }

  verificarSesion() {
    let user = localStorage.getItem('usuarioConectado');
    if (user == '1') {
      this.router.navigate(['administrador']);
    } else if (user == '2') {
      let user2 = localStorage.getItem('usuarioNombre');
      Swal.fire(
        '¡Bienvenido(a)!',
        'Bienvenido(a) Vendedor(a) ' + user2,
        'success');
        this.nombre = user2;
        this.rol=localStorage.getItem('usuarioRol');
      this.router.navigate(['vendedor']);
    } else {
      this.router.navigate(['login']);
      Swal.fire(
        '¿A donde ibas?',
        'No haz iniciado sesión',
        'question'
      )
    }
  }

  cerrarSesion() {
    localStorage.removeItem('usuarioConectado');
    this.router.navigate(['']);
  }

  cambiarBoton(n: string) {
    this.nombreBotonSeleccionado = n;
    this.barraLateralVisible = false;
  }
}
