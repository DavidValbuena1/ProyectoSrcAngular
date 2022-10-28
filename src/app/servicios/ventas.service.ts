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

  obtenerVentas(){
    return this.http.get("https://proyectosioca.azurewebsites.net/Sioca/Venta/listar")
  }
  obtenerVentaPorId(data:any){
    return this.http.get("https://proyectosioca.azurewebsites.net/Sioca/Venta/listarId/"+data);
  }
  editarVenta(data:any,id:any){
    return this.http.put("https://proyectosioca.azurewebsites.net/Sioca/Venta/editar/"+id,data);
  }

  generarReportePdf(){
    return this.http.get("https://proyectosioca.azurewebsites.net/Sioca/Venta/descargarReporte",{responseType:'blob'});
  }
}
