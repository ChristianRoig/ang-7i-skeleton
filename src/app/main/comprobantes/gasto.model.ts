import { FuseUtils } from '@fuse/utils';

export class Gasto
{
    id: string;  // deberia ser number pero el generateGUID retorna un string.
    propietario: string;
    modulo: string;
    categoria: string;
    rubro: string;
    nombre: string; 
    nro: string; 
    fecha: Date;
    contacto_id: string;
    contacto_corto: string;
    descripcion: string;  
    pago_estado: string;
    importe: number;
    notas: string;
    periodo: string;
    file_link: string;
    etiqueta: string;
    orden: number;
    comprobante: any;
    pago_forma: string;

     /**
     * Constructor
     *
     * @param gasto
     */
    constructor(gasto)
    {
      this.id = gasto.id || '';
      this.propietario = gasto.propietario || '';
      this.modulo  = gasto.modulo || '';
      this.categoria = gasto.categoria || '';
      this.nombre = gasto.nombre || '';
      this.nro = gasto.nro || '';
      this.fecha = gasto.fecha || null;
      this.contacto_id = gasto.contacto_id || 0;
      this.contacto_corto = gasto.contacto_corto || '';
      this.descripcion = gasto.descripcion || '';
      this.pago_estado = gasto.pago_estado;
      this.importe = gasto.importe || 0;
      this.notas = gasto.notas || '';
      this.periodo = gasto.periodo || '';
      this.file_link = gasto.file_link || '';
      this.etiqueta = gasto.etiqueta || '';
      this.orden = gasto.orden || 0;
      this.comprobante = gasto.comprobante || '';
      this.pago_forma = gasto.pago_forma || '';
    }
  }
