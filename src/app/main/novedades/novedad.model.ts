import { FuseUtils } from '@fuse/utils';

export class Novedad {
    
    idNovedad: string;
    empresa: string;
    descripcion: string;
    fecha_desde: string;
    fecha_hasta: string;
    cod_novedad: string;
    cod_origen: string;
    periodo: string;
    tipo: string;
    observaciones: string;
    importe: string;
    estado: string;
    nombre: string;
    legajo: string;
    origen: string;


    // no estan en la tabla
    sexo: string;
    img: string;
    

    /**
     * Constructor
     *
     * @param novedad
     */
    constructor(novedad) {
        this.idNovedad = novedad.idNovedad || null;
        this.nombre = novedad.nombre || '';
        this.legajo = novedad.legajo || '-';
        this.origen = novedad.origen || '';

        this.sexo = novedad.sexo || 'Masculino';
        if (this.sexo === 'Femenino') {
            this.img = novedad.img || 'assets/images/avatars/avatarF.png';
        } else {
            this.img = novedad.img || 'assets/images/avatars/avatarM.png';
        }

        this.empresa = novedad.empresa || '';
        this.descripcion = novedad.descripcion || '';
        this.fecha_desde = novedad.fecha_desde || '';
        this.fecha_hasta = novedad.fecha_hasta || '';
        this.cod_novedad = novedad.cod_novedad || '';
        this.cod_origen = novedad.cod_origen || '';
        this.periodo = novedad.periodo || '';
        this.tipo = novedad.tipo || '';
        this.observaciones = novedad.observaciones || '';
        this.importe = novedad.importe || '';
        this.estado = novedad.estado || '';

    }

}

