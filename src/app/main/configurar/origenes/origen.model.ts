import { FuseUtils } from '@fuse/utils';

export class Origen
{
    codEmpresas: string;
    codOrigen: string;
    idOrigen: string;
    legajoResp: string;
    legajoSup: string;
    nombre: string;
    observaciones: string;
    tipo: string;

    /**
     * Constructor
     *
     * @param origen
     */
    constructor(origen)
    {

        this.codEmpresas = origen.codEmpresas || '';
        this.codOrigen = origen.codOrigen || '';
        this.idOrigen = origen.idOrigen || '';
        this.legajoResp = origen.legajoResp || null;
        this.legajoSup = origen.legajoSup || null;
        this.nombre = origen.nombre || '';
        this.observaciones = origen.observaciones || null;
        this.tipo = origen.tipo || '';
    
    }
}
