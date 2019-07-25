import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

import { FuseUtils } from '@fuse/utils';

import { Contact } from 'app/main/contacts/contact.model';
import { text } from '@angular/core/src/render3';

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

  /*   user: any;
    selectedContacts: string[] = [];

    searchText: string;
    filterBy: string; */

    /**
     * Constructor
     *
     * @param {HttpClient} _httpClient
     */
    constructor(
        private _httpClient: HttpClient
    )
    {
        // Set the defaults
         this.onContactsChanged = new BehaviorSubject([]);
 /*       this.onSelectedContactsChanged = new BehaviorSubject([]);
        this.onUserDataChanged = new BehaviorSubject([]);
        this.onSearchTextChanged = new Subject();
        this.onFilterChanged = new Subject(); */
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

    /**
     * Get contacts
     *
     * @returns {Promise<any>}
     */
    getContacts(): Promise<any>
    {
         return new Promise((resolve, reject) => {
             this.crearRequestObtenerProveedores()
                    .subscribe((response: any) => {

                        this.contacts = response;


/*                         if ( this.filterBy === 'starred' )
                        {git branxg
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
                        }*/

                        this.contacts = this.contacts.map(contact => {
                            return new Contact(contact);
                        });

                        this.onContactsChanged.next(this.contacts); 
                        resolve(this.contacts);
                    }, reject);
            }
        ); 
     //   return null
    }

    initContacto(contact: Contact): void {
        contact.modulo = ContactsService.MODULO;
        contact.categoria = ContactsService.CATEGORIA;
        contact.etiqueta = ContactsService.ETIQUETA;
        contact.activo = 1;
    //    contact.propietario = this.cookieService.get('userName');
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
     */
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

/*         let httpHeaders = new HttpHeaders({
            'Content-Type': 'application/json',
        });

        let options = {
            headers: httpHeaders
        }; */

        let url = "http://10.100.58.25:8082/pymex/proveedores/getProveedores"

        let params = {
            "propietario": "7ideas",
            "modulo": "Proveedores",
            "categoria": "de Gastos",
            "etiqueta": "-Oficina-"
        };

        return this._httpClient.get(url, {params :params});
    }

    crearRequestNewCodigoProveedor(propietario: string, modulo: string) {

        /*         let httpHeaders = new HttpHeaders({
                    'Content-Type': 'application/json',
                });
        
                let options = {
                    headers: httpHeaders
                }; */

        let url = "http://10.100.58.25:8082/pymex/proveedores/siguienteCodigo2"

        let params = {
            "propietario": propietario,
            "modulo": modulo,
        };

        return this._httpClient.get(url, { params: params });
    }

}
