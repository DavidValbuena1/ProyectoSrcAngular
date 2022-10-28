import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class OrdencompraService {

  constructor(private http:HttpClient) { }

  enviarOrdenAlProveedor(data:any){
    return this.http.post("https://proyectosioca.azurewebsites.net/Sioca/OrdenCompra/generarReporte",data);
  }

  generarOrden(data:any){
    return this.http.post("https://proyectosioca.azurewebsites.net/Sioca/OrdenCompra/agregar",data);
  }

  obtenerIdMaximo(){
    return this.http.get("https://proyectosioca.azurewebsites.net/Sioca/OrdenCompra/idMaximo");
  }

  obtenerOrdenes(){
    return this.http.get("https://proyectosioca.azurewebsites.net/Sioca/OrdenCompra/listar")
  }

  obtenerOrdenPorId(data:any){
    return this.http.get("https://proyectosioca.azurewebsites.net/Sioca/OrdenCompra/listarId/"+data);
  }

  actualizarOrden(data:any){
    return this.http.put("https://proyectosioca.azurewebsites.net/Sioca/OrdenCompra/editar/"+data.idorden,data);
  }

  generarReportePdf(){
    return this.http.get("https://proyectosioca.azurewebsites.net/Sioca/OrdenCompra/descargarReporte",{responseType:'blob'});
  }
}
