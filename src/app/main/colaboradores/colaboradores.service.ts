import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot, Router } from '@angular/router';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

import { FuseUtils } from '@fuse/utils';

import { Colaborador } from 'app/main/colaboradores/colaborador.model';
import { ErrorService } from '../errors/error.service';

@Injectable()
export class ColaboradoresService implements Resolve<any>
{
    onContactsChanged: BehaviorSubject<any>;
    onSelectedContactsChanged: BehaviorSubject<any>;
    onUserDataChanged: BehaviorSubject<any>;
    onSearchTextChanged: Subject<any>;
    onFilterChanged: Subject<any>;     

    contacts: Colaborador[] = [];
    user: any;
    selectedContacts: string[] = [];

    searchText: string;
    filterBy: string; 

    /**
     * Constructor
     *
     * @param {HttpClient} _httpClient
     * @param {ErrorService} _errorService
     */
    constructor(
        private _httpClient: HttpClient,
        private _errorService: ErrorService
    )
    {
        // Set the defaults
        this.onContactsChanged = new BehaviorSubject([]);
        this.onSelectedContactsChanged = new BehaviorSubject([]);
        this.onUserDataChanged = new BehaviorSubject([]);
        this.onSearchTextChanged = new Subject();
        this.onFilterChanged = new Subject(); 
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
                this.getUserData()
            ]).then(
                ([files]) => {

                    /**
                     * Filtros de busqueda
                     */
                    
                    //  this.onSearchTextChanged.subscribe(searchText => {
                    //     this.searchText = searchText;
                    //     this.getContacts();
                    // });

                    this.onFilterChanged.subscribe(filter => {
                        this.filterBy = filter;
                        this.getContacts();
                    });

                    resolve();

                },
                (error) => {
                        this.contacts = [];
                        this.onContactsChanged.next(this.contacts);
                        
                        this._errorService.errorHandler(error);

                        resolve(this.contacts);
                    }
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
        let api: string = '';

        console.log("filtro " + this.filterBy);

        switch (this.filterBy) {
            case 'FC':  api = 'api/contactos-FC';
                break;
            case 'FN':  api = 'api/contactos-FN';
                break;
            case 'FH':  api = 'api/contactos-FH';
                break;
            case 'DTO': api = 'api/contactos-resDTO';
                break;
            case 'SUC': api = 'api/contactos-resSUC';
                break;                
            case 'NOV': api = 'api/contactos-resNOV';
                break;           
            case 'novEquipo': api = 'api/contactos-novEquipo';
                break;                
            default:    api = 'api/contactos'; //default ALL
                break;
        }


        return new Promise((resolve, reject) => {
                this._httpClient.get(api)
                    .subscribe((response: Colaborador[]) => {

                        this.contacts = response;
                       

                        /**
                         * Filtros de de sidebar
                         */
                        
                        // if ( this.filterBy === 'starred' )
                        // {
                        //     this.contacts = this.contacts.filter(_contact => {
                        //         return this.user.starred.includes(_contact.id);
                        //     });
                        // }

                        // if ( this.filterBy === 'frequent' )
                        // {
                        //     this.contacts = this.contacts.filter(_contact => {
                        //         return this.user.frequentContacts.includes(_contact.id);
                        //     });
                        // }

                        // if ( this.searchText && this.searchText !== '' )
                        // {
                        //     this.contacts = FuseUtils.filterArrayByString(this.contacts, this.searchText);
                        // }

                        this.contacts = this.contacts.map(contact => {
                            return new Colaborador(contact);
                        });

                        this.onContactsChanged.next(this.contacts); 
                        resolve(this.contacts);
                    }, reject);
            }
        ); 
        return null;
    }

    getVanilaContact(): Colaborador[]{
        let api = 'api/contactos';

        let contactos = null;

        this._httpClient.get(api).subscribe(data => {
            contactos = data;

            contactos = contactos.map(contact => {
                return new Colaborador(contact);
            },
                (error) => {
                    this._errorService.errorHandler(error);
                }
            );
        });        
        
        return contactos;
    }


    /**
     * Get user data
     *
     * @returns {Promise<any>}
     */
    getUserData(): Promise<any>
    {
        return new Promise((resolve, reject) => {
                this._httpClient.get('api/contacts-user/5725a6802d10e277a0f35724')
                    .subscribe((response: any) => {
                        this.user = response;
                        this.onUserDataChanged.next(this.user);
                        resolve(this.user);
                    }, reject);
            }
        );
        return null;
    } 

    /**
     * Toggle selected contact by id
     *
     * @param id
     */
    toggleSelectedContact(id): void
    {
        // First, check if we already have that contact as selected...
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
        this.onSelectedContactsChanged.next(this.selectedContacts);
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

}
