import { Injectable } from '@angular/core';
import { Workbook } from 'exceljs';
import * as fs from 'file-saver';
import { throwIfEmpty } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class ExcelService {
  constructor() {}

  private workbook: Workbook;

  async descargarExcelProveedores(dataExcel: any): Promise<void> {
    this.workbook = new Workbook();
    await this.formatoTablaProveedor(dataExcel);
    this.workbook.xlsx.writeBuffer().then((x) => {
      const blob = new Blob([x]);
      fs.saveAs(blob, 'Prueba1.xlsx');
    });
  }

  async formatoTablaProveedor(data: any[]): Promise<void> {
    const sheet = this.workbook.addWorksheet('Lista de proveedores');
    sheet.getColumn('A').width = 6;
    sheet.getColumn('B').width = 30;
    sheet.getColumn('C').width = 30;
    sheet.getColumn('D').width = 30;
    sheet.getColumn('E').width = 30;
    sheet.getColumn('F').width = 30;
    sheet.getColumn('G').width = 30;
    sheet.getColumn('H').width = 30;
    sheet.getColumn('I').width = 30;
    sheet.getColumn('J').width = 30;

    const headerRow = sheet.getRow(1);
    headerRow.font = {
      color: { argb: 'FFFFFF' },
      name: 'Times New Roman',
      size: 14,
      bold: true,
    };
    headerRow.values = [
      'ID',
      'Nombre',
      'Correo_principal',
      'Correo_secundario',
      'Direccion_principal',
      'Direccion_secundaria',
      'Nombre_de_la_empresa',
      'NIT',
      'Ciudad',
      'Categoria',
    ];

    sheet.getCell('A1').fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: '4E90BC' },
    };
    sheet.getCell('B1').fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: '4E90BC' },
    };
    sheet.getCell('C1').fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: '4E90BC' },
    };
    sheet.getCell('D1').fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: '4E90BC' },
    };
    sheet.getCell('E1').fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: '4E90BC' },
    };
    sheet.getCell('F1').fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: '4E90BC' },
    };
    sheet.getCell('G1').fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: '4E90BC' },
    };
    sheet.getCell('H1').fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: '4E90BC' },
    };
    sheet.getCell('I1').fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: '4E90BC' },
    };
    sheet.getCell('J1').fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: '4E90BC' },
    };

    sheet.columns.forEach((column) => {
      column.alignment = {
        vertical: 'middle',
        wrapText: true,
        horizontal: 'center',
      };
    });

    const filas = sheet.getRows(2, data.length)!;

    for (let index = 0; index < filas.length; index++) {
      const item = data[index];
      const row = filas[index];
      console.log(item);

      row.values = [
        item.id_proveedor,
        item.nombre,
        item.correo1,
        item.correo2,
        item.direccion1,
        item.direccion2,
        item.nombreEmpresa,
        item.nit,
        item.ciudad,
        item.categoria.nombre,
      ];
      if ((index + 2) % 2 == 0) {
        sheet.getRow(index + 2).border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' },
        };
        sheet.getRow(index + 2).fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'D2E3EE' },
        };
      } else {
        sheet.getRow(index + 2).fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FFFFFF' },
        };
        sheet.getRow(index + 2).border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' },
        };
      }
    }
  }

  async descargarExcelVentas(dataExcel: any): Promise<void> {
    this.workbook = new Workbook();
    await this.formatoTablaVentas(dataExcel);
    this.workbook.xlsx.writeBuffer().then((x) => {
      const blob = new Blob([x]);
      fs.saveAs(blob, 'Venta_Fecha:' + new Date() + '.xlsx');
    });
  }

  async formatoTablaVentas(data: any[]): Promise<void> {
    const sheet = this.workbook.addWorksheet('Lista de ventas');
    sheet.getColumn('A').width = 6;
    sheet.getColumn('B').width = 30;
    sheet.getColumn('C').width = 30;
    sheet.getColumn('D').width = 30;

    const headerRow = sheet.getRow(1);
    headerRow.font = {
      color: { argb: 'FFFFFF' },
      name: 'Times New Roman',
      size: 14,
      bold: true,
    };

    headerRow.values = ['ID', 'Valor total', 'Fecha', 'Estado'];
    sheet.getCell('A1').fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: '4E90BC' },
    };
    sheet.getCell('B1').fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: '4E90BC' },
    };
    sheet.getCell('C1').fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: '4E90BC' },
    };
    sheet.getCell('D1').fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: '4E90BC' },
    };

    const filas = sheet.getRows(2, data.length)!;

    for (let index = 0; index < filas.length; index++) {
      const item = data[index];
      const row = filas[index];
      row.values = [item.id, item.precio, item.fecha, item.estado];
      if ((index + 2) % 2 == 0) {
        let valor: string = '' + (index + 2);
        sheet.getCell('A' + valor).border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' },
        };
        sheet.getCell('A' + valor).fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'D2E3EE' },
        };
        sheet.getCell('B' + valor).border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' },
        };
        sheet.getCell('B' + valor).fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'D2E3EE' },
        };
        sheet.getCell('C' + valor).border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' },
        };
        sheet.getCell('C' + valor).fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'D2E3EE' },
        };
        sheet.getCell('D' + valor).border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' },
        };
        sheet.getCell('D' + valor).fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'D2E3EE' },
        };

      } else {
        let valor: string = '' + (index + 2);
        sheet.getCell('A' + valor).fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FFFFFF' },
        };
        sheet.getCell('A' + valor).border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' },
        };
        sheet.getCell('B' + valor).fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FFFFFF' },
        };
        sheet.getCell('B' + valor).border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' },
        };
        sheet.getCell('C' + valor).fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FFFFFF' },
        };
        sheet.getCell('C' + valor).border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' },
        };
        sheet.getCell('D' + valor).fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FFFFFF' },
        };
        sheet.getCell('D' + valor).border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' },
        };
      }
    }
  }


  async descargarExcelUsuarios(dataExcel: any): Promise<void> {
    this.workbook = new Workbook();
    await this.formatoTablaUsuarios(dataExcel);
    this.workbook.xlsx.writeBuffer().then((x) => {
      const blob = new Blob([x]);
      fs.saveAs(blob, 'Lista_Usuarios_Fecha:' + new Date() + '.xlsx');
    });
  }

  async formatoTablaUsuarios(data: any[]): Promise<void> {
    const sheet = this.workbook.addWorksheet('Lista de usuarios');
    sheet.getColumn('A').width = 6;
    sheet.getColumn('B').width = 30;
    sheet.getColumn('C').width = 30;
    sheet.getColumn('D').width = 30;
    sheet.getColumn('E').width = 30;
    sheet.getColumn('F').width = 30;
    sheet.getColumn('G').width = 30;
    sheet.getColumn('H').width = 30;
    sheet.getColumn('I').width = 30;
    sheet.getColumn('J').width = 30;

    const headerRow = sheet.getRow(1);
    headerRow.font = {
      color: { argb: 'FFFFFF' },
      name: 'Times New Roman',
      size: 14,
      bold: true,
    };

    headerRow.values = ['ID', 'Nombres', 'Apellidos', 'Correo_Electronico','Dirección','Telefono','Fecha_de_nacimiento','Tipo_de_documento','Numero_de_documento','Rol'];
    sheet.getCell('A1').fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: '4E90BC' },
    };
    sheet.getCell('B1').fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: '4E90BC' },
    };
    sheet.getCell('C1').fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: '4E90BC' },
    };
    sheet.getCell('D1').fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: '4E90BC' },
    };
    sheet.getCell('E1').fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: '4E90BC' },
    };
    sheet.getCell('F1').fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: '4E90BC' },
    };
    sheet.getCell('G1').fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: '4E90BC' },
    };
    sheet.getCell('H1').fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: '4E90BC' },
    };
    sheet.getCell('J1').fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: '4E90BC' },
    };
    sheet.getCell('I1').fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: '4E90BC' },
    };

    const filas = sheet.getRows(2, data.length)!;

    for (let index = 0; index < filas.length; index++) {
      const item = data[index];
      const row = filas[index];
      console.log(item);

      row.values = [item.id_usuario, item.nombres, item.apellidos, item.correo,item.direccion,item.telefono,item.fecha,item.tipoDocumento.nombre,item.num_Identificacion_usuario,item.rol.nombre];
      if ((index + 2) % 2 == 0) {
        let valor: string = '' + (index + 2);
        sheet.getCell('A' + valor).border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' },
        };
        sheet.getCell('A' + valor).fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'D2E3EE' },
        };
        sheet.getCell('B' + valor).border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' },
        };
        sheet.getCell('B' + valor).fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'D2E3EE' },
        };
        sheet.getCell('C' + valor).border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' },
        };
        sheet.getCell('C' + valor).fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'D2E3EE' },
        };
        sheet.getCell('D' + valor).border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' },
        };
        sheet.getCell('D' + valor).fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'D2E3EE' },
        };
        sheet.getCell('E' + valor).border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' },
        };
        sheet.getCell('E' + valor).fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'D2E3EE' },
        };
        sheet.getCell('F' + valor).border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' },
        };
        sheet.getCell('F' + valor).fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'D2E3EE' },
        };
        sheet.getCell('G' + valor).border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' },
        };
        sheet.getCell('G' + valor).fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'D2E3EE' },
        };
        sheet.getCell('H' + valor).border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' },
        };
        sheet.getCell('H' + valor).fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'D2E3EE' },
        };
        sheet.getCell('I' + valor).border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' },
        };
        sheet.getCell('I' + valor).fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'D2E3EE' },
        };
        sheet.getCell('J' + valor).border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' },
        };
        sheet.getCell('J' + valor).fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'D2E3EE' },
        };

      } else {
        let valor: string = '' + (index + 2);
        sheet.getCell('A' + valor).fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FFFFFF' },
        };
        sheet.getCell('A' + valor).border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' },
        };
        sheet.getCell('B' + valor).fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FFFFFF' },
        };
        sheet.getCell('B' + valor).border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' },
        };
        sheet.getCell('C' + valor).fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FFFFFF' },
        };
        sheet.getCell('C' + valor).border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' },
        };
        sheet.getCell('D' + valor).fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FFFFFF' },
        };
        sheet.getCell('D' + valor).border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' },
        };
        sheet.getCell('E' + valor).fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FFFFFF' },
        };
        sheet.getCell('E' + valor).border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' },
        };
        sheet.getCell('F' + valor).fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FFFFFF' },
        };
        sheet.getCell('F' + valor).border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' },
        };
        sheet.getCell('G' + valor).fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FFFFFF' },
        };
        sheet.getCell('G' + valor).border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' },
        };
        sheet.getCell('H' + valor).fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FFFFFF' },
        };
        sheet.getCell('H' + valor).border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' },
        };
        sheet.getCell('I' + valor).fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FFFFFF' },
        };
        sheet.getCell('I' + valor).border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' },
        };
        sheet.getCell('J' + valor).fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FFFFFF' },
        };
        sheet.getCell('J' + valor).border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' },
        };
      }
    }
  }


  async descargarExcelInventario(dataExcel: any): Promise<void> {
    this.workbook = new Workbook();
    await this.formatoTablaInventario(dataExcel);
    this.workbook.xlsx.writeBuffer().then((x) => {
      const blob = new Blob([x]);
      fs.saveAs(blob, 'Lista_Productos_Fecha:' + new Date() + '.xlsx');
    });
  }

  async formatoTablaInventario(data: any[]): Promise<void> {
    const sheet = this.workbook.addWorksheet('Lista de productos');
    sheet.getColumn('A').width = 6;
    sheet.getColumn('B').width = 30;
    sheet.getColumn('C').width = 30;
    sheet.getColumn('D').width = 30;
    sheet.getColumn('E').width = 30;
    sheet.getColumn('F').width = 30;
    sheet.getColumn('G').width = 30;
    sheet.getColumn('H').width = 30;
    sheet.getColumn('I').width = 30;
    sheet.getColumn('J').width = 30;

    const headerRow = sheet.getRow(1);
    headerRow.font = {
      color: { argb: 'FFFFFF' },
      name: 'Times New Roman',
      size: 14,
      bold: true,
    };

    headerRow.values = ['ID', 'Nombre', 'Categoria','Cantidad','Referencia','Talla','Precio_por_unidad','Precio_total','Fecha_de_entrada','Proveedor'];
    sheet.getCell('A1').fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: '4E90BC' },
    };
    sheet.getCell('B1').fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: '4E90BC' },
    };
    sheet.getCell('C1').fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: '4E90BC' },
    };
    sheet.getCell('D1').fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: '4E90BC' },
    };
    sheet.getCell('E1').fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: '4E90BC' },
    };
    sheet.getCell('F1').fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: '4E90BC' },
    };
    sheet.getCell('G1').fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: '4E90BC' },
    };
    sheet.getCell('H1').fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: '4E90BC' },
    };
    sheet.getCell('J1').fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: '4E90BC' },
    };
    sheet.getCell('I1').fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: '4E90BC' },
    };

    const filas = sheet.getRows(2, data.length)!;

    for (let index = 0; index < filas.length; index++) {
      const item = data[index];
      const row = filas[index];
      console.log(item);

      row.values = [item.id_producto, item.nombre, item.type.nombre, item.quantity,item.reference,item.size,item.price,item.precioTotal,item.date,item.proveedor.nombre];
      if ((index + 2) % 2 == 0) {
        let valor: string = '' + (index + 2);
        sheet.getCell('A' + valor).border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' },
        };
        sheet.getCell('A' + valor).fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'D2E3EE' },
        };
        sheet.getCell('B' + valor).border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' },
        };
        sheet.getCell('B' + valor).fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'D2E3EE' },
        };
        sheet.getCell('C' + valor).border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' },
        };
        sheet.getCell('C' + valor).fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'D2E3EE' },
        };
        sheet.getCell('D' + valor).border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' },
        };
        sheet.getCell('D' + valor).fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'D2E3EE' },
        };
        sheet.getCell('E' + valor).border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' },
        };
        sheet.getCell('E' + valor).fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'D2E3EE' },
        };
        sheet.getCell('F' + valor).border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' },
        };
        sheet.getCell('F' + valor).fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'D2E3EE' },
        };
        sheet.getCell('G' + valor).border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' },
        };
        sheet.getCell('G' + valor).fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'D2E3EE' },
        };
        sheet.getCell('H' + valor).border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' },
        };
        sheet.getCell('H' + valor).fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'D2E3EE' },
        };
        sheet.getCell('I' + valor).border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' },
        };
        sheet.getCell('I' + valor).fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'D2E3EE' },
        };
        sheet.getCell('J' + valor).border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' },
        };
        sheet.getCell('J' + valor).fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'D2E3EE' },
        };

      } else {
        let valor: string = '' + (index + 2);
        sheet.getCell('A' + valor).fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FFFFFF' },
        };
        sheet.getCell('A' + valor).border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' },
        };
        sheet.getCell('B' + valor).fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FFFFFF' },
        };
        sheet.getCell('B' + valor).border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' },
        };
        sheet.getCell('C' + valor).fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FFFFFF' },
        };
        sheet.getCell('C' + valor).border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' },
        };
        sheet.getCell('D' + valor).fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FFFFFF' },
        };
        sheet.getCell('D' + valor).border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' },
        };
        sheet.getCell('E' + valor).fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FFFFFF' },
        };
        sheet.getCell('E' + valor).border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' },
        };
        sheet.getCell('F' + valor).fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FFFFFF' },
        };
        sheet.getCell('F' + valor).border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' },
        };
        sheet.getCell('G' + valor).fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FFFFFF' },
        };
        sheet.getCell('G' + valor).border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' },
        };
        sheet.getCell('H' + valor).fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FFFFFF' },
        };
        sheet.getCell('H' + valor).border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' },
        };
        sheet.getCell('I' + valor).fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FFFFFF' },
        };
        sheet.getCell('I' + valor).border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' },
        };
        sheet.getCell('J' + valor).fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FFFFFF' },
        };
        sheet.getCell('J' + valor).border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' },
        };
      }
    }
  }
}
