import { FuseUtils } from '@fuse/utils';

export class Colaborador
{
    id: string;
    name: string;
    lastName: string;
    avatar: string;
    nickname: string;
    company: string;
    jobTitle: string;
    email: string;
    phone: string;
    address: string;
    birthday: string;
    notes: string;
    docket: string;
    departament: string;
    workplace: string;
    status: string;
    novedades: string; 
    novedad: string;
    monto: string;
    statusNovedades: string;
    legajo: string;


    /**
     * Constructor
     *
     * @param colaborador
     */
    constructor(colaborador)
    {
        {
            this.id = colaborador.id || FuseUtils.generateGUID();
            this.name = colaborador.name || '';
            this.lastName = colaborador.lastName || '';
            this.avatar = colaborador.avatar || 'assets/images/avatars/profile.jpg';
            this.nickname = colaborador.nickname || '';
            this.company = colaborador.company || '';
            this.jobTitle = colaborador.jobTitle || '';
            this.email = colaborador.email || '';
            this.phone = colaborador.phone || '';
            this.address = colaborador.address || '';
            this.birthday = colaborador.birthday || '';
            this.notes = colaborador.notes || '';
            this.docket = colaborador.docket || '';
            this.departament = colaborador.departament || '';
            this.workplace = colaborador.workplace || '';
            this.status = colaborador.status || '';
            this.novedad = colaborador.novedad || '';
            this.monto = colaborador.monto || '$0';
            this.statusNovedades = colaborador.statusNovedades || '';
            this.legajo = colaborador.legajo || '';    //esto no se ve utilizado en el front pero seria la idea final por company y docket

            if (colaborador.novedades) {
                this.novedades = colaborador.novedades.cantidad || null; 
            }else{
                this.novedades = null ; 
            }

            
        }
    }

}
