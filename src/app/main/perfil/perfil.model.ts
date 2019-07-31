import { FuseUtils } from '@fuse/utils';

export class Perfil { // de Colaborador

    idColaborador: string;
    idLegajo: string;
    legajo: string;
    nombre: string;
    nombreCorto: string;
    codEmpresa: string;
    empresa: string;
    departamento: string;
    lugarTrabajo: string;
    fechaIngreso: string;
    fechaEgreso: string;
    telefonos: string;
    fechaNacimiento: string;
    dni: string;
    domicilio: string;
    localidad: string;
    tarea: string;
    cuil: string;
    email: string;
    sexo: string;
    estadoCivil: string;
    observaciones: string;
    
    // No vienen en el response por el momento
    img: string;
    cantNovedades: number;
    estado: string;


    // Para el Filtro de Responsable NOV 
    sector: string;



    /**
     * Constructor
     *
     * @param perfil
     */
    constructor(perfil){
        this.idColaborador = perfil.idColaborador || '-';
        this.idLegajo = perfil.idLegajo || '-';
        this.legajo = perfil.legajo || '-';
        this.nombre = perfil.nombre || '';
        this.nombreCorto = perfil.nombreCorto || '';
        this.codEmpresa = perfil.codEmpresa || '-';
        this.empresa = perfil.empresa || '-';
        this.departamento = perfil.departamento || '-';
        this.lugarTrabajo = perfil.lugarTrabajo || '-';
        this.fechaIngreso = perfil.fechaIngreso || '';
        this.fechaEgreso = perfil.fechaEgreso || '';
        this.telefonos = perfil.telefonos || '-';
        this.fechaNacimiento = perfil.fechaNacimiento || '';
        this.dni = perfil.dni || '';
        this.domicilio = perfil.domicilio || '-';
        this.localidad = perfil.localidad || '-';
        this.tarea = perfil.tarea || '-';
        this.cuil = perfil.cuil || '-';
        this.email = perfil.email || '-';
        this.sexo = perfil.sexo || '-';
        this.estadoCivil = perfil.estadoCivil || '-';
        this.observaciones = perfil.observaciones || '-';

        if (this.sexo === 'Femenino'){
            this.img = perfil.img || 'assets/images/avatars/avatarF.png';
        }else {
            this.img = perfil.img || 'assets/images/avatars/avatarM.png';
        }  

        this.cantNovedades = Math.floor(Math.random() * 6);
        this.estado = perfil.estado || this._getEstadoRandom();        
        this.sector = '';
        
    }

    private _getEstadoRandom(): string{        
        const status = [
            'nuevo',
            'eliminado',
            'modificado',
        ];

        return status[Math.floor(Math.random() * 3)];
    }
    
}

