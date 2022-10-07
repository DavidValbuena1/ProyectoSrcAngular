import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class InventarioService {

  constructor(private http:HttpClient) { }


  obtenerProductos(){
    return this.http.get("https://proyectosioca.azurewebsites.net/Sioca/Producto/listar")
  }

  registrarProducto(data:any){
    return this.http.post("https://proyectosioca.azurewebsites.net/Sioca/Producto/agregar",data)
  }

  buscarProducto(data:any){
    return this.http.get("https://proyectosioca.azurewebsites.net/Sioca/Producto/listarId/"+data)
  }

  actualizarProducto(data:any){
    return this.http.put("https://proyectosioca.azurewebsites.net/Sioca/Producto/editar/"+data.id_producto,data);
  }

  borrarProducto(data:any):any{
      return this.http.delete("https://proyectosioca.azurewebsites.net/Sioca/Producto/eliminar/"+data)
  }

  generarReportePdf(){
    return this.http.get("https://proyectosioca.azurewebsites.net/Sioca/Producto/descargarReporte",{responseType:'blob'});
  }

  subirImagen(data:FormData, id:any):any{
    return this.http.put("https://proyectosioca.azurewebsites.net/Sioca/Producto/subirImagen/"+id,data);
  }
}
