import { FuseUtils } from '@fuse/utils';

export class Novedad {
    
    idNovedad: string;
    empresa: string;
    descripcion: string;
    fechaDesde: string;
    fechaHasta: string;
    codNovedad: string;
    codEmpresa: string;
    codOrigen: string;
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
        this.codEmpresa = novedad.codEmpresa || '';
        this.descripcion = novedad.descripcion.toLocaleUpperCase() || '';
        this.fechaDesde = novedad.fechaDesde || '';
        this.fechaHasta = novedad.fechaHasta || '';
        this.codNovedad = novedad.codNovedad || '';
        this.codOrigen = novedad.codOrigen || '';
        this.periodo = novedad.periodo || '';
        this.tipo = novedad.tipo || '';
        this.observaciones = novedad.observaciones || '';
        this.importe = novedad.importe || '';
        this.estado = novedad.estado || '';

    }

}

