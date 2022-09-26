import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http'

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  constructor(private http:HttpClient) { }

  verificarUsuario(data:any):any{
    return this.http.post("https://proyectosioca.azurewebsites.net/Sioca/Usuario/verificar",data);
  }

  insertarUsuario(data:any){
    return this.http.post("https://proyectosioca.azurewebsites.net/Sioca/Usuario/agregar",data);
  }

  obtenerRoles(){
    return this.http.get("https://proyectosioca.azurewebsites.net/Sioca/Rol/listar");
  }

  obtenerUsuarios(){
    return this.http.get("https://proyectosioca.azurewebsites.net/Sioca/Usuario/listar");
  }

  obtenerTipos(){
    return this.http.get("https://proyectosioca.azurewebsites.net/Sioca/TipoDocumento/listar");
  }

  buscarUsuario(data:any){
    return this.http.get("https://proyectosioca.azurewebsites.net/Sioca/Usuario/listarId/"+data);
  }

  eliminarUsuario(data:any){
    return this.http.delete("https://proyectosioca.azurewebsites.net/Sioca/Usuario/eliminar/"+data);
  }

  editarUsuario(data:any,id:any){
    return this.http.put("https://proyectosioca.azurewebsites.net/Sioca/Usuario/editar/"+id,data);
  }


}
