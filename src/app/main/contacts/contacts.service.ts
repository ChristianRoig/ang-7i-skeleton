import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

import { FuseUtils } from '@fuse/utils';

import { Contact } from 'app/main/contacts/contact.model';
import { environment } from 'environments/environment';
import { CookieService } from 'ngx-cookie-service';
import { headersToString } from 'selenium-webdriver/http';


const API_URL = environment.API;

@Injectable()
export class ContactsService implements Resolve<any>
{
     onContactsChanged: BehaviorSubject<any>;
  /*  onSelectedContactsChanged: BehaviorSubject<any>;
    onUserDataChanged: BehaviorSubject<any>;
    onSearchTextChanged: Subject<any>;
    onFilterChanged: Subject<any>; */

    contacts: Contact[];
    public static readonly MODULO: string = "Proveedores";
    public static readonly CATEGORIA: string = "de Gastos";
    public static readonly ETIQUETA: string = "-Oficina-";
    httpOptions : any;

    user: any;
    selectedContacts: string[] = [];

    searchText: string;
    filterBy: string; 

    /**
     * Constructor
     *
     * @param {HttpClient} _httpClient
     */
    constructor(
        private _httpClient: HttpClient,
        private cookieService: CookieService

    )
    {
        // Set the defaults
         this.onContactsChanged = new BehaviorSubject([]);
        this.httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'Authorization': cookieService.get('tokenAuth')
            })}
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
         return new Promise((resolve, reject) => {

            Promise.all([
                this.getContacts(),
 //               this.getUserData()
            ]).then(
                ([files]) => {

/*                     this.onSearchTextChanged.subscribe(searchText => {
                        this.searchText = searchText;
                        this.getContacts();
                    });

                    this.onFilterChanged.subscribe(filter => {
                        this.filterBy = filter;
                        this.getContacts();
                    });
 */
                    resolve();

                },
                reject
            );
        }); 
    }

    getProveedor(id: string): Contact {
        let proveedor: Contact;
        proveedor = this.contacts.find(p => id === p.id);
        return proveedor;
    }

    /**
     * Get contacts
     *
     * @returns {Promise<any>}
     */
    getContacts(): Promise<any>
    {
         return new Promise((resolve, reject) => {
                this._httpClient.get('api/contactos')
                    .subscribe((response: any) => {

                        this.contacts = response;


/*                         if ( this.filterBy === 'starred' )
                        {
                            this.contacts = this.contacts.filter(_contact => {
                                return this.user.starred.includes(_contact.id);
                            });
                        }

                        if ( this.filterBy === 'frequent' )
                        {
                            this.contacts = this.contacts.filter(_contact => {
                                return this.user.frequentContacts.includes(_contact.id);
                            });
                        }

                        if ( this.searchText && this.searchText !== '' )
                        {
                            this.contacts = FuseUtils.filterArrayByString(this.contacts, this.searchText);
                        }

                        this.contacts = this.contacts.map(contact => {
                            return new Contact(contact);
                        });*/

                        this.onContactsChanged.next(this.contacts); 
                        resolve(this.contacts);
                    }, reject);
            }
        ); 
     //   return null
    }

    getContactos(): Contact[] {
        return this.contacts;
    }

    initContacto(contact: Contact): void {
        contact.modulo = ContactsService.MODULO;
        contact.categoria = ContactsService.CATEGORIA;
        contact.etiqueta = ContactsService.ETIQUETA;
        contact.propietario = "7ideas"; //luego obtener de las cookies al loguearse username
    }

    getContactoByName(id: string): Contact {
        let contact: Contact;
        if (this.contacts.length == 0) {
            this.getContacts();
        }
        contact = this.contacts.find(contact => contact.id == id);

        return contact;
    }

    addContact(contact: Contact): Promise<any> {
        return new Promise((resolve, reject) => {

            this.createRequestAddProveedor(contact)
                .subscribe(response => {
                    this.getContacts();
                   // resolve(response);
                });
        });
    } 

    /**
     * Get user data
     *
     * @returns {Promise<any>}
     */
    getUserData(): Promise<any>
    {
/*         return new Promise((resolve, reject) => {
                this._httpClient.get('api/contacts-user/5725a6802d10e277a0f35724')
                    .subscribe((response: any) => {
                        this.user = response;
                        this.onUserDataChanged.next(this.user);
                        resolve(this.user);
                    }, reject);
            }
        );*/
        return null;
    } 

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
     * /
    selectContacts(filterParameter?, filterValue?): void
    {
        this.selectedContacts = [];

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
    }

    /**
     * Update contact
     *
     * @param contact
     * @returns {Promise<any>}
     * /
    updateContact(contact): Promise<any>
    {
        return new Promise((resolve, reject) => {

            this._httpClient.post('api/contacts-contacts/' + contact.id, {...contact})
                .subscribe(response => {
                    this.getContacts();
                    resolve(response);
                });
        });
    }

    /**
     * Update user data
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
                    this.getContacts();
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

    /**
     * Delete contact
     *
     * @param contact
     */
    deleteContact(contact): void
    {
/*         const contactIndex = this.contacts.indexOf(contact);
        this.contacts.splice(contactIndex, 1);
        this.onContactsChanged.next(this.contacts); */
    }

    /**
     * Delete selected contacts
     */
    deleteSelectedContacts(): void
    {
/*         for ( const contactId of this.selectedContacts )
        {
            const contact = this.contacts.find(_contact => {
                return _contact.id === contactId;
            });
            const contactIndex = this.contacts.indexOf(contact);
            this.contacts.splice(contactIndex, 1);
        }
        this.onContactsChanged.next(this.contacts);
        this.deselectContacts(); */
    }

    crearRequestObtenerProveedores() {
        let url = API_URL + 'proveedores';

        return this._httpClient.get(url, this.httpOptions);
    }

    crearRequestNewCodigoProveedor(propietario: string, modulo: string) {

        let method = 'siguientecodigo';

        let url = API_URL + method;

        let httpHeaders = new HttpHeaders({
            'Authorization': this.cookieService.get('tokenAuth')
        });

        let params = new HttpParams();
        params = params.set("propietario", propietario);
        params = params.set("modulo", modulo)
        
        return this._httpClient.get(url, { headers : httpHeaders, 
                                           params : params,
                                           responseType : 'text' }
        ); //retorna un string
    }

    createRequestAddProveedor(contact: Contact) {

        let url = API_URL + 'proveedor'

        let body = JSON.stringify(contact);

        return this._httpClient.post(url, body, this.httpOptions);
    }

    createRequestUpdateProveedor(contact: Contact) {

        let url = API_URL + 'proveedor';
        let body = JSON.stringify(contact);

        return this._httpClient.put(url, body, this.httpOptions);
    }

    createRequestRemoveProveedor(contact: Contact) {

        let options;


        let params = {
            "idContacto": contact.id,
        };
        options = {
            headers: new HttpHeaders({
                'Authorization': this.cookieService.get('tokenAuth') }),
            params : params
        }
        
        let url = API_URL + 'proveedor'

        return this._httpClient.delete(url, options)
    }

}
