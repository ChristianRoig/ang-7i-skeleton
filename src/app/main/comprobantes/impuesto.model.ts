import { FuseUtils } from '@fuse/utils';

export class Impuesto
{
    id: string;  // deberia ser number pero el generateGUID retorna un string.
    propietario: string;
    modulo: string;
    noGrav: number;
    netoGrav: number;
    iva: number;
    cae: string;

     /**
     * Constructor
     *
     * @param impuesto
     */
    constructor(impuesto)
    {
      this.id = impuesto.id || '';
      this.propietario = impuesto.propietario || '';
      this.modulo  = impuesto.modulo || '';
    }

  }
