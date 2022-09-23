import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DetalleventaService {

  constructor(private http:HttpClient) { }

  enviarCarrito(data:any){
    return this.http.post("http://localhost:8880/Sioca/DetalleVenta/agregar",data);
  }
}
