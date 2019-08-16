import { FuseNavigation } from '@fuse/types';

export const navigation: FuseNavigation[] = [
    {
        id       : 'applications',
        title    : 'Applications',
        translate: 'NAV.APPLICATIONS',
        type     : 'group',
        children : [
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
