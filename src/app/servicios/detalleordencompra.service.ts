import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DetalleordencompraService {

  constructor(private http:HttpClient) { }

  enviarCarrito(data:any){
    return this.http.post("https://proyectosioca.azurewebsites.net/Sioca/DetalleOrdenCompra/agregarTodos",data);
  }

  obtenerDetallesPorOrden(data:any){
    return this.http.get("https://proyectosioca.azurewebsites.net/Sioca/DetalleOrdenCompra/listarPorOrden/"+data)
  }

  obtenerDetalles(){
    return this.http.get("https://proyectosioca.azurewebsites.net/Sioca/DetalleOrdenCompra/listar");
  }

  obtenerDetallePorId(data:any){
    return this.http.get("https://proyectosioca.azurewebsites.net/Sioca/DetalleOrdenCompra/listarId/"+data)
  }

  actualizarDetalle(data:any,id:any){
    return this.http.put("https://proyectosioca.azurewebsites.net/Sioca/DetalleOrdenCompra/editar/"+id,data);
  }
}
