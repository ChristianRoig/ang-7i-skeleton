import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

import { FuseUtils } from '@fuse/utils';

import { Contact } from 'app/main/personas/contact.model';
import { environment } from 'environments/environment';
import { CookieService } from 'ngx-cookie-service';

const API_URL = environment.API;
const LIST_URL = environment.API.concat('proveedores');   // Get
const CRUD_URL = environment.API.concat('proveedor');  // Put, Post y Delete

@Injectable()
export class PersonasService implements Resolve<any>
{
    public static readonly MODULO: string = 'Proveedores';
    public static readonly TITULO:  string = 'Proveedores';
    public static readonly ENTIDAD: string = 'Proveedor';
    public static readonly CATEGORIA: string = 'de Gastos';
    public static readonly ETIQUETA:  string = '-Oficina-';

    onSelectedContactsChanged: BehaviorSubject<any>;
    onContactsChanged: BehaviorSubject<any>;
    onSearchTextChanged: Subject<any>;
    onFilterChanged: Subject<any>;

    contacts: Contact[];
    httpOptions: any;

    selectedContacts: string[] = [];

    onProveedorChanged: BehaviorSubject<any>;
    proveedor: Contact;

    searchText: string;
    filterBy: string; 

    /**
     * Constructor
     *
     * @param {HttpClient} _httpClient
     */
    constructor(private _httpClient: HttpClient, private cookieService: CookieService){
        // Set the defaults
        this.onSelectedContactsChanged = new BehaviorSubject([]);
        this.onContactsChanged = new BehaviorSubject([]);
        
        this.onSearchTextChanged = new Subject();
        this.onFilterChanged = new Subject(); 

        this.httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'Authorization': cookieService.get('tokenAuth')
            })};

        this.contacts = [];
        this.onProveedorChanged = new BehaviorSubject({});
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Resolver
     *
     * @param {ActivatedRouteSnapshot} route
     * @param {RouterStateSnapshot} state
     * @returns {Observable<any> | Promise<any> | any}
     */
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any
    {        
        // console.log(state);
        if (route.params['id']) {
            return new Promise((resolve, reject) => {
                Promise.all([
                    this.getProveedor(route.params['id']),
                ]).then(
                    ([files]) => {
                        resolve();
                    },
                    reject
                );
            }); 
        }
        
        return new Promise((resolve, reject) => {
            Promise.all([
                this.getProveedores(), 
            ]).then(
                ([files]) => {
                    this.onSearchTextChanged.subscribe(searchText => {
                        this.searchText = searchText;
                        this._filterContactos();
                    });
                    resolve();
                },
                reject
            );
        }); 
    }


    /**
     * Encargado de retornar una lista con todos los Proveedores
     *
     * @returns {Promise<any>}
     */
    getProveedores(): Promise<any> {
        return new Promise((resolve, reject) => {
            this.crearRequestObtenerProveedores()
                .subscribe((response: any) => {
                    // console.log('s.g.proveedores');
                    if (response == null) { // fix en caso de null
                        response = [];
                    }
                    
                    this.contacts = response.map((cont: any) => {
                        return new Contact(cont);
                    });

                    this.onContactsChanged.next(this.contacts);
                    resolve(this.contacts);
                }, reject);
        });
    }

    /**
     * Encargado de traer un proveedor en particular 
     * @param id 
     */
    getProveedor(id: string): Promise<any> {
        return new Promise((resolve, reject) => {
            this.crearRequestObtenerProveedor(id)
                .subscribe((response: any) => {
                    // console.log('s.g.proveedor');
                    if (response != null) {
                        response = new Contact(response);
                    }

                    this.proveedor = response;
                    this.onProveedorChanged.next(this.proveedor);

                    resolve(this.proveedor);
                }, reject);
        });
    }

    /**
     * Inicializa los datos modulo, categoria y etiqueta de un contacto en particular
     * @param contact 
     */
    initContacto(contact: Contact): Contact {
        contact.categoria = PersonasService.CATEGORIA;
        contact.etiqueta = PersonasService.ETIQUETA;
        contact.modulo = PersonasService.MODULO;

        return contact;
    }

    /**
     * Encargado de enviar al backend un nuevo proveedor
     * @param contact 
     */
    addContact(contact: Contact): Promise<any> {
        if ((contact.file_link.indexOf('assets/images/avatars/empresa.png') > -1) || (contact.file_link.indexOf('assets/images/avatars/avatarF.png') > -1) ||
            (contact.file_link.indexOf('assets/images/avatars/avatarM.png') > -1) || (contact.file_link.indexOf('assets/images/avatars/profile.jpg') > -1)) {
            contact.file_link = null;
        }

        return new Promise((resolve, reject) => {

            this.createRequestAddProveedor(contact)
                .subscribe(response => {
                    this.getProveedores();
                   // resolve(response);
                });
        });
    }

    /**
     * Encargado de enviar al backend los datos para actualizar un proveedor
     *
     * @param contact
     * @returns {Promise<any>}
     */
    updateContact(contact: Contact): Promise<any> {
        if ((contact.file_link.indexOf('assets/images/avatars/empresa.png') > -1) || (contact.file_link.indexOf('assets/images/avatars/avatarF.png') > -1) ||
            (contact.file_link.indexOf('assets/images/avatars/avatarM.png') > -1) || (contact.file_link.indexOf('assets/images/avatars/profile.jpg') > -1)) {
            contact.file_link = null;
        }
        return new Promise((resolve, reject) => {

            this.createRequestUpdateProveedor(contact)
                .subscribe(response => {
                    this.getProveedores();
                    resolve(response);
                }, reject);
        });
    }

    /**
     * Delete contact from backend
     * 
     * @param contact 
     */
    deleteContact(contact: Contact): Promise<any> {
        return new Promise((resolve, reject) => {
            this.createRequestRemoveProveedor(contact)
                .subscribe(response => {

                    // cuando este lo del response se va a poder realizar de mejor manera

                    this.deleteContactList(contact);
                    resolve(response);
                });
        });
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////
    // Metodos Privados
    ////////////////////////////////////////////////////////////////////////////////////////////////////////

    /**
     * Filtra la lista actual de contactos en funcion del searchText
     */
    private _filterContactos(): void {
        let filtered: Contact[] = [];
        if (this.searchText && this.searchText !== '') {
            filtered = FuseUtils.filterArrayByString(this.contacts, this.searchText);
            this.onContactsChanged.next(filtered);
        }
        else {
            this.onContactsChanged.next(this.contacts);
        }
    }

    /**
     * Delete contact from list
     *
     * @param contact
     */
    private deleteContactList(contact: Contact): void {
        const contactIndex = this.contacts.indexOf(contact);

        if (contactIndex > -1){
            this.contacts.splice(contactIndex, 1);
            this.onContactsChanged.next(this.contacts);
        }        
    }





    ///////////////////////////////////////////////////////////////////////
    // createRequest
    ///////////////////////////////////////////////////////////////////////

    crearRequestNewCodigoProveedor(): any {
        let method = 'siguientecodigo';

        let url = API_URL + method;

        let httpHeaders = new HttpHeaders({
            'Authorization': this.cookieService.get('tokenAuth')
        });

        let params = new HttpParams();
        params = params.set('modulo', PersonasService.MODULO);

        return this._httpClient.get(url, {
            headers: httpHeaders,
            params: params,
            responseType: 'text'
        }); // retorna un string
    }

    private crearRequestObtenerProveedor(id: string): any {
        return this._httpClient.get(LIST_URL + '/' + id, this.httpOptions);
    }

    private crearRequestObtenerProveedores(): any {
        return this._httpClient.get(LIST_URL, this.httpOptions);
    }    

    private createRequestAddProveedor(contact: Contact): any {        
        let body = JSON.stringify(contact);
        return this._httpClient.post(CRUD_URL, body, this.httpOptions);
    }

    private createRequestUpdateProveedor(contact: Contact): any {
        let body = JSON.stringify(contact);
        return this._httpClient.put(CRUD_URL, body, this.httpOptions);
    }

    private createRequestRemoveProveedor(contact: Contact): any {
        let params = {
            'idContacto': contact.id,
        };

        let options = {
            headers: new HttpHeaders({
                'Authorization': this.cookieService.get('tokenAuth')
            }),
            params: params
        };

        return this._httpClient.delete(CRUD_URL, options);
    }


///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// De aca para abajo hay que revisar TODO 
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    /**
     * Devuelvo las lista de contacts y si es 0 fuerzo que se cargue
     */
    // getContactos(): Contact[] {   

    //     if (this.contacts.length === 0) {
    //         this.getProveedores();
    //     }

    //     return this.contacts;
    // }

    

    // getContactoByName(id: string): Contact {
    //     let contact: Contact = new Contact({});
    //     if (this.contacts.length === 0) {
    //         this.getProveedores();
    //     }
    //     contact = this.contacts.find(contact => contact.id === id);

    //     return contact;
    // }

    

    /**
     * Toggle selected contact by id
     *
     * @param id
     */
    toggleSelectedContact(id): void
    {
/*         // First, check if we already have that contact as selected...
        if ( this.selectedContacts.length > 0 )
        {
            const index = this.selectedContacts.indexOf(id);

            if ( index !== -1 )
            {
                this.selectedContacts.splice(index, 1);

                // Trigger the next event
                this.onSelectedContactsChanged.next(this.selectedContacts);

                // Return
                return;
            }
        } 

        // If we don't have it, push as selected
        this.selectedContacts.push(id);

        // Trigger the next event
        this.onSelectedContactsChanged.next(this.selectedContacts); */
    }

    /**
     * Toggle select all
     */
    toggleSelectAll(): void
    {
/*         if ( this.selectedContacts.length > 0 )
        {
            this.deselectContacts();
        }
        else
        {
            this.selectContacts();
        } */
    }

    /**
     * Select contacts
     *
     * @param filterParameter
     * @param filterValue
     */
    selectContacts(filterParameter?, filterValue?): void
    {
    /**    this.selectedContacts = [];

        // If there is no filter, select all contacts
        if ( filterParameter === undefined || filterValue === undefined )
        {
            this.selectedContacts = [];
            this.contacts.map(contact => {
                this.selectedContacts.push(contact.id);
            });
        }

        // Trigger the next event
        this.onSelectedContactsChanged.next(this.selectedContacts);
    */
    }

    

    /**
     * Delete contact from list
     *
     * @param userData
     * @returns {Promise<any>}
     */
    updateUserData(userData): Promise<any>
    {
/*         return new Promise((resolve, reject) => {
            this._httpClient.post('api/contacts-user/' + this.user.id, {...userData})
                .subscribe(response => {
                    this.getUserData();
                    this.getProveedores();
                    resolve(response);
                });
        }); */
        return null;
    }

    /**
     * Deselect contacts
     */
    deselectContacts(): void
    {
/*         this.selectedContacts = [];

        // Trigger the next event
        this.onSelectedContactsChanged.next(this.selectedContacts); */
    }

}
