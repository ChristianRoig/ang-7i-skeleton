import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

import { FuseUtils } from '@fuse/utils';

import { Gasto } from './gasto.model';
import { CookieService } from 'ngx-cookie-service';

import { environment } from 'environments/environment';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { map } from 'rxjs/operators';


const API_URL : string = environment.API;

@Injectable()
export class GastosService implements Resolve<any>
{
    onGastosChanged: BehaviorSubject<any>;
    onSelectedGastosChanged: BehaviorSubject<any>;
    onUserDataChanged: BehaviorSubject<any>;    
    onSearchTextChanged: Subject<any>;
    onFilterChanged: Subject<any>; 

    gastos: Gasto[] = [];
    infoOnChanged = new BehaviorSubject({});
    info: any;
    user: any;    
    selectedGastos: string[] = [];

    searchText: string;
    filterBy: string;

    index:number;
    
    httpOptions: any;
    public static readonly MODULO: string = "Compras";
    public static readonly CATEGORIA: string = "Facturas";
    public static readonly ETIQUETA: string = "-Oficina-";
    /**
     * Constructor
     *
     */
    constructor(
        private http : HttpClient,
        private cookieService: CookieService
    )
    {      
        // Set the defaults
        this.onGastosChanged = new BehaviorSubject([]);
        this.onSelectedGastosChanged = new BehaviorSubject([]);
/*      this.onUserDataChanged = new BehaviorSubject([]);*/        
        this.onSearchTextChanged = new Subject();
        this.onFilterChanged = new Subject();
        this.index = 0;

        this.httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            })
        }
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
                this.getGastos(),
            ]).then(
                ([files]) => {

                     this.onSearchTextChanged.subscribe(searchText => {
                        this.searchText = searchText;
                        this.getGastos();
                    });

                    this.onFilterChanged.subscribe(filter => {
                        this.filterBy = filter;
                        this.getGastos();
                    });
 
                    resolve();

                },
                reject
            );
        }); 
    }

    getGastos(): Promise<any>
    {
         return new Promise((resolve, reject) => {
                this.createRequestObtenerGastos()
                    .subscribe((response: any) => {
                        this.gastos = response;
/*                         if ( this.filterBy === 'frequent' ) //comentar este if
                        {
                            this.gastos = this.gastos.filter(_contact => {
                                return this.user.frequentContacts.includes(_contact.id);
                            });
                        }  
                        if ( this.searchText && this.searchText !== '' )
                        {
                            this.gastos = FuseUtils.filterArrayByString(this.gastos, this.searchText);
                        } */
                         this.gastos = this.gastos.map(gasto => {                            
                            return new Gasto(gasto);
                        });   
                        this.onGastosChanged.next(this.gastos);  
                        resolve(this.gastos)

                    }, reject);
            }); 
    }
    
    initGasto(gasto: Gasto): void {
        gasto.modulo = GastosService.MODULO;
        gasto.categoria = GastosService.CATEGORIA;
        gasto.etiqueta = GastosService.ETIQUETA;
        gasto.propietario = this.cookieService.get('userName');
    }

    addGasto(gasto : Gasto): Promise<any> {
        return new Promise((resolve, reject) => {

            this.createRequestAddGasto(gasto)
                .subscribe((response : any) => {
                    this.getGastos();
                });
        });
    } 

    deleteGasto(gasto : Gasto): Promise<any> {
        return new Promise((resolve, reject) => {

            this.createRequestRemoveGasto(gasto)
                .subscribe(response => {
                    this.deleteContactList(gasto);
                 //   this.getGastos(); 
                    resolve(response);
                });
        });
    }
    
    deleteContactList(gasto : Gasto): void {
        const contactIndex = this.gastos.indexOf(gasto);
        if(contactIndex != -1) {
            this.gastos.splice(contactIndex, 1);
            this.onGastosChanged.next(this.gastos);
        }
    }

    getGastosByName(proveedor: string): Promise<any> {
        let gastos: any[] = [];
        return new Promise((resolve, reject) => {
            this.createRequestGastosByProveedor(proveedor)
                .subscribe((response: any) => {
                    gastos = response;
     
                    gastos = gastos.map(gasto => {
                        return new Gasto(gasto);
                    });
                    resolve(gastos);
                }, reject);
        });
    }

    createRequestAddGasto(gasto : Gasto): any {

        let url = API_URL + 'comprobante';
        let request = JSON.stringify(gasto); //agrego un nuevo gasto. 

        return this.http.post(url, request, this.httpOptions);
    }

    createRequestUpdateGasto(gasto: Gasto): any {

        let url = API_URL + 'comprobante';
        let request = JSON.stringify(gasto); //agrego un nuevo gasto. 

        return this.http.put(url, request, this.httpOptions);
    }

    createRequestRemoveGasto(gasto : Gasto): any {

        let url = API_URL + 'comprobante';
        let params = new HttpParams();
        params = params.set("id", gasto.id );

        return this.http.delete(url, { params : params });
    }

    createRequestObtenerGastos(): any {
/*         let httpHeaders = new HttpHeaders({
            'Content-Type': 'application/json',
        });

        let options = {
            headers: httpHeaders
        }; */
        let url = API_URL + 'compras';
        return this.http.get(url); // post debido a que la cant de parametros para filtrar es mayor a 2.
    }

     createRequestGastosByProveedor( idProveedor: string): any {

         let httpHeaders = new HttpHeaders({
             'Content-Type': 'application/json',
         });

         let params = {
             "proveedor": idProveedor
         };

         let options = {
             headers: httpHeaders,
             params : params
         };

         let url = API_URL + 'compras';

         return this.http.get(url, options);
    } 
    
    getGasto(id: string) : Gasto {
        let gasto: Gasto;
        gasto = this.gastos.find(element =>  element.id == id  )
        return gasto;    
    }

    obtenerMasComprobantes() {
        this.index = this.index + 1;
        this.getGastos();
    }

    getInfo(id:number): Promise<any> {
 

    return null;
    }

    /**
     * Get user data
     *
     * @returns {Promise<any>}
     */
/*      getUserData(): Promise<any>
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
    } */

    /**
     * Toggle selected contact by id
     *
     * @param id
     */
    toggleSelectedContact(id): void
    {
         // First, check if we already have that contact as selected...
        if ( this.selectedGastos.length > 0 )
        {
            const index = this.selectedGastos.indexOf(id);

            if ( index !== -1 )
            {
                this.selectedGastos.splice(index, 1);

                // Trigger the next event
                this.onSelectedGastosChanged.next(this.selectedGastos);

                // Return
                return;
            }
        } 

        // If we don't have it, push as selected
        this.selectedGastos.push(id);

        // Trigger the next event
        this.onSelectedGastosChanged.next(this.selectedGastos);
    }

    /**
     * Toggle select all
     */
    toggleSelectAll(): void
    {
         if ( this.selectedGastos.length > 0 )
        {
            this.deselectGastos();
        }
        else
        {
            this.selectGastos();
        } 
    }

    /**
     * Select contacts
     *
     * @param filterParameter
     * @param filterValue
     */
    selectGastos(filterParameter?, filterValue?): void
    {
        this.selectedGastos = [];

        // If there is no filter, select all contacts
        if ( filterParameter === undefined || filterValue === undefined )
        {
            this.selectedGastos = [];
            this.gastos.map(contact => {
                this.selectedGastos.push(contact.id);
            });
        }

        // Trigger the next event
        this.onSelectedGastosChanged.next(this.selectedGastos);
    }

    /**
     * Update contact
     *
     * @param contact
     * @returns {Promise<any>}
     */
     updateContact(gasto : Gasto): Promise<any>
    {
        return new Promise((resolve, reject) => {
                this.createRequestUpdateGasto(gasto)
                .subscribe(response => {
                    this.getGastos();
               //     resolve(response);
                });
        });
    } 

    /**
     * Update user data
     *
     * @param userData
     * @returns {Promise<any>}
     */
/*      updateUserData(userData): Promise<any>
    {
         return new Promise((resolve, reject) => {
            this._httpClient.post('api/contacts-user/' + this.user.id, {...userData})
                .subscribe(response => {
                    this.getUserData();
                    this.getGastos();
                    resolve(response);
                });
        }); 
        return null;
    }  */

    /**
     * Deselect contacts
     */
    deselectGastos(): void
    {
         this.selectedGastos = [];

        // Trigger the next event
        this.onSelectedGastosChanged.next(this.selectedGastos); 
    }

    /**
     * Delete selected contacts
     */
    deleteSelectedGastos(): void
    {
         for ( const contactId of this.selectedGastos )
        {
            const contact = this.gastos.find(_contact => {
                return _contact.id === contactId;
            });
            const contactIndex = this.gastos.indexOf(contact);
            this.gastos.splice(contactIndex, 1);
        }
        this.onGastosChanged.next(this.gastos);
        this.deselectGastos(); 
    }
}
