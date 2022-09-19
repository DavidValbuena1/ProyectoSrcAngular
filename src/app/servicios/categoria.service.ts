import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CategoriaService {

  constructor(private http:HttpClient) { }

  obtenerCategorias():any{
    return this.http.get("https://proyectosioca.azurewebsites.net/Sioca/Categoria/listar");
  }
}
