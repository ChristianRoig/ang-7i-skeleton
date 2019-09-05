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
        this.nombre = this._isTextNull(novedad.nombre) || '';
        this.legajo = this._isTextNull(novedad.legajo) || '-';
        this.origen = this._isTextNull(novedad.origen) || '';

        this.sexo = this._isTextNull(novedad.sexo) || 'Masculino';
        if (this.sexo === 'Femenino') {
            this.img = novedad.img || 'assets/images/avatars/avatarF.png';
        } else {
            this.img = novedad.img || 'assets/images/avatars/avatarM.png';
        }

        this.empresa = this._isTextNull(novedad.empresa) || '';
        this.codEmpresa = this._isTextNull(novedad.codEmpresa) || '';
        this.descripcion = novedad.descripcion.toLocaleUpperCase() || '';
        this.fechaDesde = this._isTextNull(novedad.fechaDesde) || '';
        this.fechaHasta = this._isTextNull(novedad.fechaHasta) || '';
        this.codNovedad = this._isTextNull(novedad.codNovedad) || '';
        this.codOrigen = this._isTextNull(novedad.codOrigen) || '';
        this.periodo = this._isTextNull(novedad.periodo) || '';
        this.tipo = this._isTextNull(novedad.tipo) || '';
        this.observaciones = this._isTextNull(novedad.observaciones) || '';
        this.importe = this._isTextNull(novedad.importe) || '0';
        this.estado = this._isTextNull(novedad.estado) || '';
    }

    private _isTextNull(value: string): string {
        if (value === 'null' || value === null){
            return '';
        }
        return value;
    }

}

