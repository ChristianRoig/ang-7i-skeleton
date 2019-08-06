import { FuseUtils } from '@fuse/utils';

export class Contact {
    
    id: string;
    cod: string;
    propietario: string;
    modulo: String;
    categoria: string;
    etiqueta: String;
    nombre_corto: string;
    file_link: string;
    nombre: string;
    correo: string;
    telefono: string;
    domicilio: string;
    localidad: string;
    cond_iva: string
    genero: string;
    notas: string;
    doc_nro: string;
/*     activo: number;
 */    predefinido: number;
    estado: string;

    /**
     * Constructor
     *
     * @param contact
     */
    constructor(contact) {
        {
            this.id = contact.id || FuseUtils.generateGUID();
            this.cod = contact.cod || '';
            this.propietario = contact.propietario;
            this.modulo = contact.modulo || '';
            this.categoria = contact.categoria || '';
            this.etiqueta = contact.etiqueta || '';
            this.nombre_corto = contact.nombre_corto || '';
            this.file_link = contact.file_link || 'assets/images/avatars/profile.jpg';
            this.nombre = contact.nombre || '';
            this.correo = contact.correo || '';
            this.telefono = contact.telefono || '';
            this.domicilio = contact.domicilio || '';
            this.localidad = contact.localidad || '';
            this.cond_iva = contact.cond_iva;
            this.genero = contact.genero || '';
            this.notas = contact.notas || '';
            this.doc_nro = contact.doc_nro;
/*             this.activo = contact.activo || 1;
 */            this.predefinido = contact.predefinido || 0;
            this.estado = contact.estado || 'activo';
        }
    }
}