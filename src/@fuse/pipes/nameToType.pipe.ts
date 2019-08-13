import { PipeTransform, Pipe } from '@angular/core';

@Pipe({
    name: 'nameToType',
    pure: true
  })
export class GetTypePipe implements PipeTransform {

    transform(value: string, ...args: any[]): string {
        return this.getTipoComprobante(value);
    }

    getTipoComprobante(comprobante: string ): string {
        let tipo = '';
        if ((comprobante != null || comprobante !== 'undefined') ) {
            switch (comprobante) {
                case 'Factura A' :  tipo = 'A'; break; 
                case 'Factura B' :  tipo = 'B'; break; 
                case 'Factura C':  tipo = 'C'; break;
                case 'Gasto X' : tipo = '$'; break; 
            }
        }
        return tipo;
     } 
}
