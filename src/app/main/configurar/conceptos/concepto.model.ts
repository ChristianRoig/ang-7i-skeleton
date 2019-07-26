import { FuseUtils } from '@fuse/utils';

export class Concepto
{
    nombre: string;
    cod: string;
    tipo: string;
    origenCod: string;
    origenNombre: string;
    
    /**
     * Constructor
     *
     * @param concepto
     */
    constructor(concepto)
    {
        {
            this.nombre = concepto.nombre || '';
            this.cod = concepto.cod || '';
            this.tipo = concepto.tipo || '';
            this.origenCod = concepto.origenCod || '';
            this.origenNombre = concepto.origenNombre || '';
    
        }
    }
}
