import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';


@Injectable()
export class CommonService {

  constructor() {
  }
  
  toInt(tochange: any): number {
      return +tochange;
  }

  // Formatea tipo moneda
  _formatMoney(cantidad: number, c: any, d: any, t: any) {
          c = isNaN(c = Math.abs(c)) ? 2 : c, 
          d = d === undefined ? '.' : d, 
          t = t === undefined ? ',' : t;
          const s = cantidad < 0 ? '-' : '';
          const i = String(cantidad = parseInt(Math.abs(Number(cantidad) || 0).toFixed(c)));
          let j;
          j = (j = i.length) > 3 ? j % 3 : 0;
      return "$ " + s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(cantidad - +i).toFixed(c).slice(2) : "");
  }

  // Función para convertir un JSON en CSV
  JSONToCSVConvertor(json, reportTitle, showLabel) {
      const arrData = typeof json !== 'object' ? JSON.parse(json) : json;
      let csv = '';
      // REMOVE TITLE AND EMPTY ROWS
      // csv += reportTitle + '\r\n\n';
      if (showLabel) {
          let row = '';
          // Títulos de columnas
          for (let index in arrData[0]) {
              // Comas
              row += index + ',';
          }
          row = row.slice(0, -1);
          csv += row + '\r\n';
      }
      // Renglones
      for (let i = 0; i < arrData.length; i++) {
          let row = '';
          // Columnas
          for (let index in arrData[i]) {
              row += '"' + arrData[i][index] + '",';
          }
          row.slice(0, row.length - 1);
          csv += row + '\r\n';
      }
      if (csv === '') {
          alert('Invalid data');
          return;
      }
      let fileName = 'App_';
      fileName += reportTitle.replace(/ /g,'_');
      const uri = `data:text/csv;charset=utf-8,${(csv)}`;
      const link = document.createElement('a');
      // link.style = 'visibility:hidden';
      link.href = uri;
      link.download = fileName + '.csv';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
  }

    /*printReporte(ordens: any) {
        let innerHTML = `
        <html>
        <head>
        <title>
            Reporte de Órdenes
        </title>
        <style>
        body {
            padding: 0px;
            marging: 0px;
            font-family: 'Arial';
            font-size: 12px;
            line-height: 12px;
        }
        p {
            font-size: 12px;
            line-height: 12px;
            text-align: center;
        }
        table {
            font-size: 12px;
            line-height: 12px;
        }
        </style>
        </head>
        <body>
            <h1 style="text-align: center;">Reporte de Órdenes</h1>
            <table>
            <tr>
                <th>
                Nó de Orden
                </th>
                <th>
                Cliente
                </th>
                <th>
                Subtotal
                </th>
                <th>
                Total
                </th>
                <th>
                Monto Abonado
                </th>
                <th>
                Monto Adeudado
                </th>
                <th>
                Factura
                </th>
                <th>
                Fecha
                </th>
                <th>
                Hora
                </th>
            </tr>`;

        for (const element in ordens) {
        if (ordens.hasOwnProperty(element)) {

            innerHTML += `
                <tr>
                <td>
                    ${ordens[element].idorden}
                </td>
                <td>
                    ${ordens[element].cliente_cliente_idcliente}
                </td>
                <td style="text-align: right;">
                    ${this.commonService._formatMoney(ordens[element].subtotal, 2, '.', ',')}
                </td>
                <td style="text-align: right;">
                    ${this.commonService._formatMoney(ordens[element].total, 2, '.', ',')}
                </td>
                <td style="text-align: right;">
                    ${this.commonService._formatMoney(ordens[element].abonado, 2, '.', ',')}
                </td>
                <td style="text-align: right;">
                    ${this.commonService._formatMoney(ordens[element].adeudo, 2, '.', ',')}
                </td>
                <td>
                    ${(ordens[element].factura) ? 'Si' : 'No'}
                </td>
                <td>
                    ${ordens[element].fecha.substring(0, 10)}
                </td>
                <td>
                    ${ordens[element].hora}
                </td>
                </tr>`;

        }

        }

        innerHTML += 
            `</table>
        </body>
        </html> 
        `;
        const ventimp = window.open(' ', 'Reporte de Órdenes');
        ventimp.document.write(innerHTML);
        ventimp.document.close();
        ventimp.print();
        ventimp.close();
    }*/

}
