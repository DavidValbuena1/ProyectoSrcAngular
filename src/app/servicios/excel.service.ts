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

  async descargarExcel(dataExcel: any): Promise<void> {
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
    headerRow.font={
      color: { argb: "FFFFFF"},
      name: 'Times New Roman',
      size:14,
      bold: true
    }
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

    sheet.getCell('A1').fill={
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: '4E90BC' },
    }
    sheet.getCell('B1').fill={
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: '4E90BC' },
    }
    sheet.getCell('C1').fill={
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: '4E90BC' },
    }
    sheet.getCell('D1').fill={
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: '4E90BC' },
    }
    sheet.getCell('E1').fill={
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: '4E90BC' },
    }
    sheet.getCell('F1').fill={
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: '4E90BC' },
    }
    sheet.getCell('G1').fill={
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: '4E90BC' },
    }
    sheet.getCell('H1').fill={
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: '4E90BC' },
    }
    sheet.getCell('I1').fill={
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: '4E90BC' },
    }
    sheet.getCell('J1').fill={
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: '4E90BC' },
    }

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
      if((index+2)%2==0){
        sheet.getRow(index+2).border={
            top: {style:'thin'},
            left: {style:'thin'},
            bottom: {style:'thin'},
            right: {style:'thin'}
        }
        sheet.getRow(index + 2).fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'D2E3EE' },
        };
      }else{
        sheet.getRow(index + 2).fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FFFFFF' },
        };
        sheet.getRow(index+2).border={
          top: {style:'thin'},
          left: {style:'thin'},
          bottom: {style:'thin'},
          right: {style:'thin'}
      }
      }
    }
  }
}
