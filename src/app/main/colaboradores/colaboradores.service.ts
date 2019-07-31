import { FuseUtils } from '@fuse/utils';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot, Router } from '@angular/router';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { ErrorService } from '../errors/error.service';
import { Perfil } from '../perfil/perfil.model';
import { environment } from 'environments/environment';
import { LoginService } from '../authentication/login-2/login-2.service';

const API_URL: string = environment.API;

@Injectable()
export class ColaboradoresService implements Resolve<any>
{   
    
    filterBy = ''; 

    private invocador = '';
    
    private searchText = '';
    private colaboradores: Perfil[] = [];

    onColaboradoresChanged: BehaviorSubject<any>;
    onSearchTextChanged: Subject<any>;
    onFilterChanged: Subject<any>;
    onInvocadorChanged: Subject<any>;

    /**
     * Constructor
     *
     * @param {HttpClient} _httpClient
     * @param {ErrorService} _errorService
     * @param {LoginService} _loginService
     */
    constructor(
        private _httpClient: HttpClient,
        private _errorService: ErrorService,
        private _loginService: LoginService
    )
    {
        // Set the defaults
        this.onColaboradoresChanged = new BehaviorSubject([]);        
        this.onSearchTextChanged = new Subject();
        this.onFilterChanged = new Subject(); 
        this.onInvocadorChanged = new Subject(); 
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
                // this.getColaboradores()
            ]).then(
                ([files]) => {

                    /**
                     * Filtros de busqueda
                     */
                    
                    //  this.onSearchTextChanged.subscribe(searchText => {
                    //     this.searchText = searchText;
                    //     this.getContacts();
                    // });

                    // this.onInvocadorChanged.subscribe(inv => {
                    //     this.invocador = inv;
                    //     this.getColaboradores();
                    // });

                    // this.onFilterChanged.subscribe(filter => {
                    //     this.filterBy = filter;
                    //     this.getColaboradores();
                    // });

                    resolve();

                },
                (error) => {
                        this.colaboradores = [];
                        this.onColaboradoresChanged.next(this.colaboradores);
                        
                        this._errorService.errorHandler(error);

                        resolve(this.colaboradores);
                    }
            );
        }); 
    }

    getColaboradores(): Promise<any>{
        let url = API_URL;
        let params = {};
        let verbo = 'post';

        if (!(this.invocador)){
            return;
        }

        if (this.invocador === 'equipo'){
            url = API_URL + 'obtenerColaboradoresByDepartamento';
            
            params = {
                'departamento': 'Tesoreria cajas'
            };
        }else { //nomina
            
            if (this.filterBy === 'all'){
                verbo = 'get';
                url = API_URL + 'obtenerColaboradores';
            }else{
                url = API_URL + 'obtenerColaboradoresByEmpresa';
            }

    
        }

        return new Promise((resolve, reject) => {
                this._createRequest(url, verbo, params )
                    .subscribe((response: Perfil[]) => {
    
                    this.colaboradores = response;
    
    
                    // if ( this.searchText && this.searchText !== '' )
                    // {
                    //     this.contacts = FuseUtils.filterArrayByString(this.contacts, this.searchText);
                    // }
    
                    this.colaboradores = this.colaboradores.map(contact => {
                        return new Perfil(contact);
                    });
    
                    this.onColaboradoresChanged.next(this.colaboradores); 
    
                    resolve(this.colaboradores);
    
                }, reject);
            }
        ); 

    }


    /**
     * Crea el llamado a los servicios de back
     * @param {string} user 
     */
    private _createRequest(url: string, verbo: string, params?: {}): Observable<any> | any {

        if (verbo === 'post'){
            const httpHeadersP = new HttpHeaders({
                'Content-Type': 'application/json',
                'Authorization': this._loginService.getLocalToken()
            });

            const optionsP = { headers: httpHeadersP };

            return this._httpClient.post(url, params, optionsP);
        }
        // verbo = get
        
        const httpHeaders = new HttpHeaders({            
            'Authorization': this._loginService.getLocalToken()
        });

        const options = { headers: httpHeaders };

        return this._httpClient.get(url, options);

    }

    /**
     * Get contacts
     *
     * @returns {Promise<any>}
     */
    // getColaboradores(): Promise<any>
    // {
    //     let api = '';

    //     console.log('filtro ' + this.filterBy);

    //     switch (this.filterBy) {
    //         case 'FC':  api = 'api/contactos-FC';
    //             break;
    //         case 'FN':  api = 'api/contactos-FN';
    //             break;
    //         case 'FH':  api = 'api/contactos-FH';
    //             break;
    //         case 'DTO': api = 'api/contactos-resDTO';
    //             break;
    //         case 'SUC': api = 'api/contactos-resSUC';
    //             break;                
    //         case 'NOV': api = 'api/contactos-resNOV';
    //             break;           
    //         case 'novEquipo': api = 'api/contactos-novEquipo';
    //             break;                
    //         default:    api = 'api/contactos'; //default ALL
    //             break;
    //     }


    //     return new Promise((resolve, reject) => {
    //             this._httpClient.get(api)
    //                 .subscribe((response: Colaborador[]) => {

    //                     this.contacts = response;
 
    //                     /**
    //                      * Filtros de de sidebar
    //                      */
                        
    //                     // if ( this.filterBy === 'starred' )
    //                     // {
    //                     //     this.contacts = this.contacts.filter(_contact => {
    //                     //         return this.user.starred.includes(_contact.id);
    //                     //     });
    //                     // }

    //                     // if ( this.filterBy === 'frequent' )
    //                     // {
    //                     //     this.contacts = this.contacts.filter(_contact => {
    //                     //         return this.user.frequentContacts.includes(_contact.id);
    //                     //     });
    //                     // }

    //                     // if ( this.searchText && this.searchText !== '' )
    //                     // {
    //                     //     this.contacts = FuseUtils.filterArrayByString(this.contacts, this.searchText);
    //                     // }

    //                     this.contacts = this.contacts.map(contact => {
    //                         return new Colaborador(contact);
    //                     });

    //                     this.onColaboradoresChanged.next(this.contacts); 
    //                     resolve(this.contacts);
    //                 }, reject);
    //         }
    //     ); 
    //     return null;
    // }

    getVanilaContact(): Perfil[]{
        let api = 'api/contactos';

        let contactos = null;

        this._httpClient.get(api).subscribe(data => {
            contactos = data;

            contactos = contactos.map(contact => {
                return new Perfil(contact);
            },
                (error) => {
                    this._errorService.errorHandler(error);
                }
            );
        });        
        
        return contactos;
    }

}
