import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DetalleventaService {

  constructor(private http:HttpClient) { }

  enviarCarrito(data:any){
    return this.http.post("https://proyectosioca.azurewebsites.net/Sioca/DetalleVenta/agregar",data);
  }
}
