import { FuseUtils } from '@fuse/utils';

export class Origen
{
    // mock
    id: string;
    cod: string;
    nombre: string;
    empresas: string;
    tipo: string;
    legajoR: string;
    responsableR: string;
    legajoS: string;
    responsableS: string;




    // id_origen: string;
    // cod_origen: string;
    // nombre: string;
    // cod_empresas: string;
    // tipo: string;
    // legajo_resp: string;
    // nombre_resp: string;
    // legajo_sup: string;
    // observaciones: string;

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

        // this.id_origen = origen.id_origen || '';
        // this.cod_origen = origen.cod_origen || '';
        // this.nombre = origen.nombre || '';
        // this.cod_empresas = origen.cod_empresas || '';
        // this.tipo = origen.tipo || '';
        // this.legajo_resp = origen.legajo_resp || 'Ninguno';
        // this.nombre_resp = origen.nombre_resp || 'Ninguno';
        // this.legajo_sup = origen.legajo_sup || 'Ninguno';
        // this.observaciones = origen.observaciones || 'Ninguna';
    
    }
}
