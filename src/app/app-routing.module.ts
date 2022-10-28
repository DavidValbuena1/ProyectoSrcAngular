import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './dashboard/admin/admin.component';
import { InventariosAdminComponent } from './dashboard/admin/inventarios/inventarios.component';
import { HistorialordenesComponent } from './dashboard/admin/ordenes/historialordenes/historialordenes.component';
import { OrdenesAdminComponent } from './dashboard/admin/ordenes/ordenes.component';
import { ProveedoresAdminComponent } from './dashboard/admin/proveedores/proveedores.component';
import { UsuariosComponent } from './dashboard/admin/usuarios/usuarios.component';
import { HistorialventasComponent } from './dashboard/admin/ventas/historialventas/historialventas.component';
import { VentasAdminComponent } from './dashboard/admin/ventas/ventas.component';
import { VendedorComponent } from './dashboard/vendedor/vendedor.component';
import { InicioComponent } from './inicio/inicio.component';
import { LoginComponent } from './login/login.component';

const routes: Routes = [
  {path:"",component:InicioComponent},

  {path:"login",component:LoginComponent},
// Dashboards
  {path:"administrador",component:AdminComponent},
  {path:"vendedor",component:VendedorComponent},


  // Modulos administrador
  {path:"inventariosAdmin",component:InventariosAdminComponent},
  {path:"ordenesAdmin",component:OrdenesAdminComponent},
  {path:"proveedoresAdmin",component:ProveedoresAdminComponent},
  {path:"ventasAdmin",component:VentasAdminComponent},
  {path:"historialordenesAdmin",component:HistorialordenesComponent},
  {path:"historialventasAdmin",component:HistorialventasComponent},
  {path:"usuariosAdmin",component:UsuariosComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash:true})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
