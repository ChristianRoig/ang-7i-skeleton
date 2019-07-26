import { FuseUtils } from '@fuse/utils';

export class Origen
{
    id: string;
    cod: string;
    nombre: string;
    empresas: string;
    tipo: string;
    legajoR: string;
    responsableR: string;
    legajoS: string;
    responsableS: string;
    
    /**
     * Constructor
     *
     * @param origen
     */
    constructor(origen)
    {

        this.id = origen.id || '';
        this.cod = origen.cod || '';
        this.nombre = origen.nombre || '';
        this.empresas = origen.empresas || '';
        this.tipo = origen.tipo || '';
        this.legajoR = origen.legajoR || 'Ninguno';
        this.responsableR = origen.responsableR || 'Ninguno';
        this.legajoS = origen.legajoS || 'Ninguno';
        this.responsableS = origen.responsableS || 'Ninguno';
    
    }
}
