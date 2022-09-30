import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PrimeNGConfig } from 'primeng/api';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css'],
})
export class AdminComponent implements OnInit {
  constructor(private router: Router, private primengConfig: PrimeNGConfig) {}

  nombreBotonSeleccionado = '';
  barraLateralVisible: any;

  ngOnInit(): void {
    this.primengConfig.ripple = true;
    this.verificarSesion();
  }

  verificarSesion() {
    let user = localStorage.getItem('usuarioConectado');
    if (user == '1') {
      let user2 = localStorage.getItem('usuarioNombre')
      Swal.fire(
        '¡Bienvenido!',
        'Bienvenido Administrador ' + user2,
        'success')
    } else if (user == '2') {
      this.router.navigate(['vendedor']);
      Swal.fire(
        '¿A donde ibas?',
        'Tu sesión es vendedor, no puedes acceder al dashboard de administrador',
        'question'
      )
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
