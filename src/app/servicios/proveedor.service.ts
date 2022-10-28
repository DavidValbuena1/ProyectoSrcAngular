import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AnyCatcher } from 'rxjs/internal/AnyCatcher';

@Injectable({
  providedIn: 'root'
})
export class ProveedorService {

  constructor(private http:HttpClient) { }

  obtenerProveedores():any{
    return this.http.get("https://proyectosioca.azurewebsites.net/Sioca/Proveedor/listar");
  }

  buscarProveedorPorId(data:any){
    return this.http.get("https://proyectosioca.azurewebsites.net/Sioca/Proveedor/listarId/"+data);
  }

  buscarProveedorPorNombre(data:any){
    return this.http.post("https://proyectosioca.azurewebsites.net/Sioca/Proveedor/buscarPorNombre",data);
  }

  agregarProveedor(data:any):any{
    return this.http.post("https://proyectosioca.azurewebsites.net/Sioca/Proveedor/agregar",data);
  }

  editarProveedor(data:any,id:number):any{
    return this.http.put("https://proyectosioca.azurewebsites.net/Sioca/Proveedor/editar/"+id,data);
  }

  eliminarProveedor(data:any):any{
    return this.http.delete("https://proyectosioca.azurewebsites.net/Sioca/Proveedor/eliminar/"+data);
  }

  generarReportePdf(){
    return this.http.get("https://proyectosioca.azurewebsites.net/Sioca/Proveedor/descargarReporte",{responseType:'blob'});
  }
}
