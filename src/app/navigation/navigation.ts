import { FuseNavigation } from '@fuse/types';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';

export const navigation: FuseNavigation[] = [
    {
        id       : 'Usuario',
        title    : 'Usuario',
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
            },            
            {
                id       : 'perfil',
                title    : 'Perfil',
                type     : 'item',
                icon     : 'person',
                url      : '/perfil/',               
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
                }
            },
            {
                id: 'sector',
                title: 'Novedades por Sector',
                type: 'item',
                icon: 'announcement',
                url: '/novedades/sectores/',
                badge: {
                    title: '23',
                    bg: '#8ebdaf',
                    fg: '#FFFFFF'
                }
            },
            {
                id: 'nov-equipo',
                title: 'Novedades por Equipo',
                type: 'item',
                icon: 'ballot',
                url: '/novedades/equipos/',
                badge: {
                    title: '8',
                    bg: '#9158e2',
                    fg: '#FFFFFF'
                }
            },            
        ]
    },

    {
        id       : 'RRHH',
        title    : 'RRHH',
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
                icon: 'supervisor_account',
                url: '/novedades/control/',                
            }
        ]
    },
];

