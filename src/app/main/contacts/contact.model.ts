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
    cond_iva: string;
    genero: string;
    notas: string;
    doc_nro: string;
    estado: string;
    activo: string;
    creado: string;
    doc_tipo: string;
    modificado: string;
    predefinido: string;

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
            this.genero = contact.genero || '';
            this.nombre_corto = contact.nombre_corto || '';
            this.file_link = this.defineAvatar(contact.file_link);
            this.nombre = contact.nombre || '';
            this.correo = contact.correo || '';
            this.telefono = contact.telefono || '';
            this.domicilio = contact.domicilio || '';
            this.localidad = contact.localidad || '';
            this.cond_iva = contact.cond_iva;
            this.notas = contact.notas || '';
            this.doc_nro = contact.doc_nro;
            this.estado = contact.estado || 'activo';
            this.activo = contact.activo || null;
            this.creado = contact.creado || '';
            this.doc_tipo = contact.doc_tipo || '';
            this.modificado = contact.modificado || '';
            this.predefinido = contact.predefinido || null;
        }
    }

    private defineAvatar(imagen: string): string {        
        if (imagen !== null && imagen !== '' && imagen !== undefined){
            return imagen;
        }
        
        if (this.genero.toLowerCase() === 'empresa'){
            return 'assets/images/avatars/empresa.png';
        }
                
        if (this.genero === 'mujer'){
            return 'assets/images/avatars/avatarF.png';
        }

        if (this.genero === 'hombre') {
            return 'assets/images/avatars/avatarF.png';
        }

        // Neutro o cualquier otra cosa
        return 'assets/images/avatars/profile.jpg';

    }
}
