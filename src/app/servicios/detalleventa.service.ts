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

  obtenerDetallesPorVenta(data:any){
    return this.http.get("https://proyectosioca.azurewebsites.net/Sioca/DetalleVenta/listarPorFactura/"+data);
  }

  obtenerDetallePorId(data:any){
    return this.http.get("https://proyectosioca.azurewebsites.net/Sioca/DetalleVenta/listarId/"+data);
  }

  editarDetalle(data:any,id:any){
    return this.http.put("https://proyectosioca.azurewebsites.net/Sioca/DetalleVenta/editar/"+id,data);
  }
}
