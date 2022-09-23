import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class VentasService {

  constructor(private http:HttpClient) { }

  GenerarVenta(data:any){
    return this.http.post("https://proyectosioca.azurewebsites.net/Sioca/Venta/agregar",data);
  }

  obtenerIdMaximo(){
    return this.http.get("https://proyectosioca.azurewebsites.net/Sioca/Venta/MaxId");
  }
}
