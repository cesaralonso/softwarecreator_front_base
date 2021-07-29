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
        
        //csv += reportTitle + '\r\n\n';
        const separator = ",";

        if (showLabel) {
            let row = '';
            //Títulos de columnas
            for (let index in arrData[0]) {
                //Comas
                row += index + separator;
            }
            row = row.slice(0, -1);
            csv += row + '\r\n';
        }
        //Renglones
        for (let i = 0; i < arrData.length; i++) {
            let row = '';

            //Columnas
            for (let index in arrData[i]) {
                row += '"' + arrData[i][index] + '"' + separator;
                /* if(isNaN(arrData[i][index])) {
                    row += '"' + arrData[i][index] + '"' + separator;
                } else {
                    row += arrData[i][index] + separator;
                } */
            }
            row.slice(0, row.length - 1);
            csv += row + '\r\n';
        }
        if (csv === '') {
            alert('Invalid data');
            return;
        }

        let fileName = 'Iberoil ';
        fileName += reportTitle.replace(/ /g,' ');
        const universalBOM = '\uFEFF';
        const uri = `data:text/csv;charset=utf-8,${encodeURIComponent(universalBOM + csv)}`;
        const link = document.createElement('a');
        link.href = uri;
        link.download = fileName + '.csv';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    // Obtiene la hora y fecha dada de un Date
    getDateAndHour(date: Date): any {
        const year = date.getFullYear();
        let month = (date.getMonth() + 1).toString();
        month = ((+month < 10) ? '0' : '') + month;
        let day = date.getDate().toString();
        day = ((+day < 10) ? '0' : '') + day;
        let hours = date.getHours().toString();
        hours = ((+hours < 10) ? '0' : '') + hours;
        let minutes = date.getMinutes().toString();
        minutes = ((+minutes < 10) ? '0' : '') + minutes;

        const now = `${year}-${month}-${day}`;
        const hour = `${hours}:${minutes}`;

        const datehour = {
            'fecha': now,
            'hora': hour,
        };
        return datehour;
    }

    // Devuelve fecha tipo new Date() con formato yy-mm-dd
    formatDate(fecha): string {

        let month = fecha.getMonth() + 1;
        let day = fecha.getDate();
        let year = fecha.getFullYear();
    
        if (+month < 10) {
            month = "0" + month.toString();
        }
    
        if (+day < 10) {
            day = "0" + day.toString();
        }
    
        return `${year}-${month}-${day}`;
    }

}
