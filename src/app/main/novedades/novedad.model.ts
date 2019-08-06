import { FuseUtils } from '@fuse/utils';

export class Novedad {

    sexo: string;
    img: string;
    legajo: string;
    nombre: string;
    origen: string;
    concepto: string;
    monto: string;
    estatus: string;

    /**
     * Constructor
     *
     * @param novedad
     */
    constructor(novedad) {       
        this.legajo = novedad.legajo || '-';
        this.nombre = novedad.nombre || '';
        this.concepto = novedad.concepto || '';
        this.origen = novedad.origen || '';
        this.sexo = novedad.sexo || 'Masculino';
        
        if (this.sexo === 'Femenino') {
            this.img = novedad.img || 'assets/images/avatars/avatarF.png';
        } else {
            this.img = novedad.img || 'assets/images/avatars/avatarM.png';
        }

        this.monto = novedad.monto || Math.floor(Math.random() * 800);        
        this.estatus = novedad.estatus || this._randomEstatus();

    }


    private _randomEstatus(): string {
        const arr = ['Pendiente', 'Verificado'];
        
        return arr[Math.floor(Math.random() * 2)];
    }

}

