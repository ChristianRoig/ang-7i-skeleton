import { InMemoryDbService } from 'angular-in-memory-web-api';

import { Perfil } from 'app/mock-db/data/perfil';
import { Contactos } from './data/contacts';

export class MockDbService implements InMemoryDbService
{
    createDb(): any
    {
        return {
            'perfil-info' : Perfil.info,
            'contactos' : Contactos.contacts
        };
    }
}
