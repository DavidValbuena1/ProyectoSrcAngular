import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Loader } from '@googlemaps/js-api-loader';
@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css']
})
export class InicioComponent implements OnInit {

  constructor(private router:Router) { }

  position={
    lat: 4.57964,
    lng: -74.17987
  }

  label={
    color:'red',
    text:'El Gran Madrugón'
  }
  ngOnInit(): void {

  }

  irlogin(){
    this.router.navigate(["login"]);
  }

  modalQuienesSomos:boolean=false;
  modalmapa:boolean=false;

}
