import { InMemoryDbService } from 'angular-in-memory-web-api';

import { Perfil } from 'app/mock-db/data/perfil';
import { Contactos } from './data/contacts';
import { Novedades } from './data/novedades';
import { Origenes } from './data/origenes';
import { Conceptos } from './data/conceptos';
import { Combos } from './data/combos';

export class MockDbService implements InMemoryDbService
{
    createDb(): any
    {
        return {
            // 'perfil-FN0051' : Perfil.FN0051, //default
            // 'perfil-FC0784' : Perfil.FC0784,
            // 'perfil-FC7871' : Perfil.FC7871,
            // 'perfil-FC4152' : Perfil.FC4152,

            // 'perfil-FC0192' : Perfil.FC0192,
            // 'perfil-FC1068' : Perfil.FC1068,
            // 'perfil-FC1791' : Perfil.FC1791,
            // 'perfil-FC1966' : Perfil.FC1966,
            // 'perfil-FC2173' : Perfil.FC2173,
            // 'perfil-FN0038' : Perfil.FN0038,
            // 'perfil-FN0042' : Perfil.FN0042,
            // 'perfil-FN0061' : Perfil.FN0061,
            // 'perfil-FN0063' : Perfil.FN0063,
            // 'perfil-FN0094' : Perfil.FN0094,
            // 'perfil-FN0097' : Perfil.FN0097,
            // 'perfil-FN0120' : Perfil.FN0120,
            // 'perfil-FH0248' : Perfil.FH0248,
            // 'perfil-FH0492' : Perfil.FH0492,
            // 'perfil-FH0568' : Perfil.FH0568,
            // 'perfil-FH0569' : Perfil.FH0569,

            'contactos': Contactos.allnomina, //default
            'contactos-resDTO': Contactos.resDTO,            
            'contactos-resSUC': Contactos.resSuc,
            'contactos-resNOV': Contactos.resNOV,
            'contactos-FC': Contactos.FC,
            'contactos-FN': Contactos.FN,
            'contactos-FH': Contactos.FH,
            'contacts-user': Contactos.user,
            'contactos-novEquipo': Contactos.novEquipo,
            'contactos-novSector': Contactos.novSector,
            
            'texto'           : Novedades.texto,

            'novedades-FN0051': Novedades.FN0051, //default
            'novedades-FC0784': Novedades.FC0784,
            'novedades-FC7871': Novedades.FC7871,
            'novedades-FC4152': Novedades.FC4152,

            'novedades-FC0192': Novedades.FC0192,
            'novedades-FC1068': Novedades.FC1068,
            'novedades-FC1791': Novedades.FC1791,
            'novedades-FC1966': Novedades.FC1966,
            'novedades-FC2173': Novedades.FC2173,
            'novedades-FN0038': Novedades.FN0038,
            'novedades-FN0042': Novedades.FN0042,
            'novedades-FN0061': Novedades.FN0061,
            'novedades-FN0063': Novedades.FN0063,
            'novedades-FN0094': Novedades.FN0094,
            'novedades-FN0097': Novedades.FN0097,
            'novedades-FN0120': Novedades.FN0120,
            'novedades-FH0248': Novedades.FH0248,
            'novedades-FH0492': Novedades.FH0492,
            'novedades-FH0568': Novedades.FH0568,
            'novedades-FH0569': Novedades.FH0569,

            'origenes'        : Origenes.origenes,
            'tabla'           : Origenes.tabla,
            // 'conceptos'       : Conceptos.conceptos,
            'sectores'        : Origenes.sectorCombo,
            'tablaConceptos'  : Conceptos.tablaConceptos,
            'rrhh'            : Conceptos.rrhh,
            'externo'         : Conceptos.externo,    
            
            

            // Combos
            'combo_dep_suc'      : Combos.dep_suc,
            'combo_ext_rrhh'     : Combos.ext_rrhh,
            'combo_ext'          : Combos.ext,
            'combo_rrhh'         : Combos.rrhh,            
            'combo_cualitativo'  : Combos.cualitativo,
            'combo_cuantitativo' : Combos.cuantitativo,
            'combo_externa'      : Combos.externa,

        };
    }
}
