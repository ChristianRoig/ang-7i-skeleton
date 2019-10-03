import { FuseNavigation } from '@fuse/types';

export const navigation: FuseNavigation[] = [
    {
        id       : 'applications',
        title    : 'PyMA',
        type     : 'group',
        children : [
            {
                id: 'comprobantes',
                title: 'Gastos',
                type: 'item',
                icon: 'description',
                url: '/gastos',
            },
            {
                id       : 'personas',
                title    : 'Proveedores',
                type     : 'item',
                icon     : 'group',
                url      : '/proveedores',
            },
            {
                id       : 'perfil',
                title    : 'Perfil',
                type     : 'item',
                icon     : 'person',
                url      : '/perfil',
            }
        ]
    },
    {
        id       : 'user',
        title    : 'Acceso',
        type     : 'group',
        children : [
            {
                id: 'logout',
                title: 'Cerrar Sesión',
                type: 'item',
                icon: 'meeting_room',
                url: '/auth/login-2',
            },
            {
                id   : 'login-v2',
                title: 'Cambiar de Usuario',
                type : 'item',
                icon: 'lock',
                url: '/auth/login-2'
            }
        ]
    },
];
