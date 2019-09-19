import { FuseNavigation } from '@fuse/types';

export const navigation: FuseNavigation[] = [
    {
        id       : 'Acceso',
        title    : 'Acceso',
        // translate: 'NAV.APPLICATIONS',
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
                id: 'logout',
                title: 'Logout',
                type: 'item',
                icon: 'meeting_room',
                url: '/auth/logout'                      
            }            
        ]
    },

    {
        id       : 'AreadeUsuario',
        title    : 'Area de Usuario',
        type     : 'group',
        children : [
            {
                id: 'Legajo',
                title: 'Legajo',
                type: 'item',
                icon: 'person',
                url: '/legajo/',
            },
            {
                id: 'equipo',
                title: 'Equipo',
                type: 'item',
                icon: 'person_pin',
                url: '/equipo/',
                badge: {
                    title: '16',
                    bg: '#825e5a',
                    fg: '#FFFFFF'
                },
                hidden: true
            },
            {
                id: 'nov-equipo',
                title: 'Novedades por Equipo',
                type: 'item',
                icon: 'assignment_ind',
                url: '/novedades/equipos/',
                badge: {
                    title: '8',
                    bg: '#9158e2',
                    fg: '#FFFFFF'
                },
                hidden: true
            },
            {
                id: 'nov-sector',
                title: 'Novedades por Sector',
                type: 'item',
                icon: 'assignment_late',
                url: '/novedades/sectores/',
                badge: {
                    title: '23',
                    bg: '#8ebdaf',
                    fg: '#FFFFFF'
                },
                hidden: true
            },
        ]
    },



    {
        id       : 'RRHH',
        title    : 'Area de RRHH',
        type     : 'group',
        children: [
            {
                id: 'nomina',
                title: 'Nomina',
                type: 'item',
                icon: 'group',
                url: '/nomina/',
                badge: {
                    title: '550',
                    bg: '#09D261',
                    fg: '#FFFFFF'
                }
            },
            {
                id: 'control_de_novedades',
                title: 'Control de Novedades',
                type: 'item',
                icon: 'beenhere',
                url: '/novedades/control/',
                hidden: true
            }
        ]
    },
];

