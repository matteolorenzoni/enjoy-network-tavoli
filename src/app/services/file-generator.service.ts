import { Injectable } from '@angular/core';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

@Injectable({
  providedIn: 'root'
})
export class FileGeneratorService {
  toastService: any;

  public downloadPDF(data: any[], headerNames: string[], keys: string[], fileName: string) {
    // eslint-disable-next-line new-cap
    const doc = new jsPDF({ orientation: 'p', unit: 'pt', format: 'a4' });

    const body = data.map((item, index) => {
      const row = [index + 1];
      keys.forEach((key) => {
        row.push(item.props[key]);
      });
      return row;
    });

    try {
      autoTable(doc, {
        head: [headerNames],
        body,
        headStyles: { fillColor: [250, 137, 56] }
      });

      doc.save(`${fileName}.pdf`);
    } catch (error: any) {
      this.toastService.showError(error);
    }
  }

  public downloadCSV(data: any[], headerNames: string[], keys: string[], fileName: string) {
    const body = data.map((item, index) => {
      const row = [index + 1];
      keys.forEach((key) => {
        row.push(item.props[key]);
      });
      return row;
    });

    const csvHeader = headerNames.join(',');
    const csvBody = body.join('\n');
    const csv = `${csvHeader}\n${csvBody}`;

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', `${fileName}.csv`);
    document.body.appendChild(a);
    a.click();
  }
}
