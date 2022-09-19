import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ProveedorService {

  constructor(private http:HttpClient) { }

  obtenerProveedores():any{
    return this.http.get("https://proyectosioca.azurewebsites.net/Sioca/Proveedor/listar");
  }
}
