import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { InicioComponent } from './inicio/inicio.component';
import { LoginComponent } from './login/login.component';
import { AdminComponent } from './dashboard/admin/admin.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { InventariosAdminComponent } from './dashboard/admin/inventarios/inventarios.component';
import { VentasAdminComponent } from './dashboard/admin/ventas/ventas.component';
import { OrdenesAdminComponent } from './dashboard/admin/ordenes/ordenes.component';
import { ProveedoresAdminComponent } from './dashboard/admin/proveedores/proveedores.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {TableModule} from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { SidebarModule } from 'primeng/sidebar';
import {DialogModule} from 'primeng/dialog';
import {AutoCompleteModule} from 'primeng/autocomplete';
import {InputTextModule} from 'primeng/inputtext';
import {DropdownModule} from 'primeng/dropdown';
import {ChartModule} from 'primeng/chart';
import {InputNumberModule} from 'primeng/inputnumber';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import {MultiSelectModule} from 'primeng/multiselect';
import {MatTableModule} from '@angular/material/table';
import { HistorialordenesComponent } from './dashboard/admin/ordenes/historialordenes/historialordenes.component'

@NgModule({
  declarations: [
    AppComponent,
    InicioComponent,
    LoginComponent,
    AdminComponent,
    InventariosAdminComponent,
    VentasAdminComponent,
    OrdenesAdminComponent,
    ProveedoresAdminComponent,
    HistorialordenesComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    TableModule,
    SidebarModule,
    ButtonModule,
    DialogModule,
    AutoCompleteModule,
    DropdownModule,
    InputTextModule,
    ChartModule,
    MultiSelectModule,
    MatTableModule,
    InputNumberModule,
    ReactiveFormsModule
  ],
  providers: [{provide:LocationStrategy, useClass: HashLocationStrategy}],
  bootstrap: [AppComponent]
})
export class AppModule { }
