import { FuseNavigation } from '@fuse/types';

export const navigation: FuseNavigation[] = [
    {
        id       : 'applications',
        title    : 'Applications',
        translate: 'NAV.APPLICATIONS',
        type     : 'group',
        children : [
            {
                id       : 'sample',
                title    : 'Sample',
                translate: 'NAV.SAMPLE.TITLE',
                type     : 'item',
                icon     : 'email',
                url      : '/sample',
                badge    : {
                    title    : '25',
                    translate: 'NAV.SAMPLE.BADGE',
                    bg       : '#F44336',
                    fg       : '#FFFFFF'
                }
            },
            {
                id   : 'login-v2',
                title: 'Login',
                type : 'item',
                icon: 'lock',
                url: '/auth/login-2'
            },
            {
                id       : 'perfil',
                title    : 'Perfil',
                type     : 'item',
                icon     : 'person',
                url      : '/perfil',
                badge    : {
                    title    : '1',
                    bg       : '#525e8a',
                    fg       : '#FFFFFF'
                }
            }
        ]
    },
    {
        id       : 'contactos',
                title    : 'Contactos',
                type     : 'item',
                icon     : 'person',
                url      : '/proveedores',
                badge    : {
                    title    : '8',
                    bg       : '#825e5a',
                    fg       : '#FFFFFF'
                }
    },
    {
        id: 'gastos',
        title: 'Gastos',
        type: 'item',
        icon: 'description',
        url: '/gastos',
        badge: {
            title: '8',
            bg: '#825e5a',
            fg: '#FFFFFF'
        }
    }
];
