import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import * as JsBarcode from 'jsbarcode';
// import { PDFProgressData } from 'ng2-pdf-viewer'; // https://github.com/VadimDez/ng2-pdf-viewer/blob/HEAD/README.md
import * as jsPDF from 'jspdf';
// import domtoimage from 'dom-to-image'; // https://stackoverflow.com/questions/52576473/convert-html-to-pdf-in-angular-6 tira error con css
import html2canvas from 'html2canvas'; // https://stackoverflow.com/questions/52576473/convert-html-to-pdf-in-angular-6


@Component({
  selector: 'app-factura',
  templateUrl: './factura.component.html',
  styleUrls: ['./factura.component.scss']
})
export class FacturaComponent implements OnInit {

  tipo: string;
  nro: string;
  fecha: string;
  tipo_factura: string;
  cod_factura: string;

  Cliente: string;
  Domicilio: string;
  CondIVA: string;
  CUIT: string;
  Localidad: string;
  CondicionVenta: string;

  // pdfSrc: string = '/assets/pdf_ejemplo.pdf';

  pdfSrc = null;

  private valueBarcode: string;

  @ViewChild('barcode') barcode: ElementRef;
  @ViewChild('comprobante') comprobante: ElementRef;
  
  constructor() { this.init(); }

  ngOnInit(): void {
    // Datos Header
    this.tipo_factura = 'A';
    this.cod_factura = '001';
    this.tipo = 'Factura';
    this.nro = '00000001'; // 8
    this.fecha = '09/10/2019';

    // Datos Cliente
    this.Cliente = 'Test';
    this.Domicilio = 'Test';
    this.CondIVA = 'Test';
    this.CUIT = 'Test';
    this.Localidad = 'Test';
    this.CondicionVenta = 'Test';
    this.valueBarcode = '1234567890123456789012345678901234567890';

    // Datos Descripcion

    // Datos Footer
    // transforma un valor string a codigo de barras
    JsBarcode(this.barcode.nativeElement, this.valueBarcode,
              {
                format: 'ITF',
                width: 1,
                height: 50,
                margin: 0,
                background: '#4b8b7f',
                lineColor: '#ffffff',
                displayValue: false
              });
  }


  descargarPDF(): void{ // Convierto el html a un canvas para luego pasarlo a un pdf
    html2canvas(this.comprobante.nativeElement, { allowTaint: true,
                                                  useCORS: false,
                                                  // Calidad del PDF
                                                  scale: 1,
                                                  backgroundColor: '#ffffff' }
      ).then(canvas => {
        let img = canvas.toDataURL('image/jpeg');
        let doc = new jsPDF('p', 'mm', 'a4');
        let width = doc.internal.pageSize.getWidth();
        let height = doc.internal.pageSize.getHeight();
        doc.addImage(img, 'JPEG', 0, 0, width, height);
        doc.save('postres.pdf');
    });
  }

  private init(): void{
    this.tipo = '';
    this.nro = '';
    this.fecha = '';
    this.tipo_factura = '';
    this.cod_factura = '';
    this.Cliente = '';
    this.Domicilio = '';
    this.CondIVA = '';
    this.CUIT = '';
    this.Localidad = '';
    this.CondicionVenta = '';

    this.valueBarcode = '';
  }

  


}
