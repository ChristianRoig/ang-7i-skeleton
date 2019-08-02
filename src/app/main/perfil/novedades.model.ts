import { FuseUtils } from '@fuse/utils';

export class NovedadPerfil {
    Eq: [];
    Ex: [];

    private defaultEq = {
        'id': '',
        'fecha': '',
        'concepto': '',
        'monto': '',
    };

    private defaultEx = {
        'id': '',
        'fecha': '',
        'concepto': '',
        'cantidad': '',
        'tipo': '',
        'unidad': '',
    };

    /**
     * Constructor
     *
     * @param novedad
     */
    constructor(novedad) {
        this.Eq = novedad.Eq || [this.defaultEq];
        this.Ex = novedad.Ex || [this.defaultEx];
    }
}
