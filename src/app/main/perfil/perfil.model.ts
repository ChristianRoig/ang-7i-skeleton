import { FuseUtils } from '@fuse/utils';

export class Perfil {
    nombre: string;
    nombre_corto: string;
    telefono: string;
    correo: string;
    img: string;
    address: string;
    infoLaboral:  {};
    datosSistema: {};


    private defaultDatosSistema = {
        'usuario': '',
        'perfiles': '',
        'correoLaboral': '',
        'telefonoLaboral': '',
    };

    private defaultInfoLaboral = {
        'legajo': '',
        'puesto': '',
        'LugarTrabajo': '',
        'company': '',
    };

    /**
     * Constructor
     *
     * @param perfil
     */
    constructor(perfil) {        

            this.nombre = perfil.nombre || '';
            this.nombre_corto = perfil.nombre_corto || '';
            this.telefono = perfil.telefono || '';
            this.correo = perfil.correo || '';
            this.img = perfil.img || 'assets/images/avatars/profile.jpg';
            this.address = perfil.address || '';

            this.infoLaboral = perfil.infoLaboral || this.defaultInfoLaboral;
            this.datosSistema = perfil.datosSistema || this.defaultDatosSistema;
        
    }
}    
