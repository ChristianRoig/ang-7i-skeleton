import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

import { FuseUtils } from '@fuse/utils';

import { Gasto } from './gasto.model';
import { CookieService } from 'ngx-cookie-service';

import { environment } from 'environments/environment';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';


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
        this.index = 1;

        this.httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'Authorization': cookieService.get('tokenAuth')
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
                        this.filterGastos(searchText);
                    })
 
                    resolve();

                },
                reject
            );
        }); 
    }

    getGastos(): Promise<any>
    {
         return new Promise((resolve, reject) => {
             this.createRequestObtenerGastosConFiltro()
                    .subscribe((response: any) => {
                        this.gastos = response;
 
/*                         if ( this.searchText && this.searchText !== '' )
                        {
                            this.gastos = FuseUtils.filterArrayByString(this.gastos, this.searchText);
                        }  */
                         this.gastos = this.gastos.map(gasto => {                            
                            return new Gasto(gasto);
                        });   
                        this.onGastosChanged.next(this.gastos);  
                        resolve(this.gastos)

                    }, reject);
            }); 
    }

    filterGastos(text : string) {
        let filtered: Gasto[] = [];
        if (this.searchText && this.searchText !== '') {
            filtered = FuseUtils.filterArrayByString(this.gastos, this.searchText);
            this.onGastosChanged.next(filtered);  
        } 
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
        let request = JSON.stringify(gasto);

        return this.http.put(url, request, this.httpOptions);
    }

    createRequestRemoveGasto(gasto : Gasto): any {
        let url = API_URL + 'comprobante';
        let options; 
        let params = new HttpParams();
        params = params.set("id", gasto.id );
        options = {
            headers: new HttpHeaders({
                'Authorization': this.cookieService.get('tokenAuth')
            }),
            params : params,
        }

        return this.http.delete(url, { params : params });
    }

    createRequestObtenerGastos(): any {
        let url = API_URL + 'compras';
        return this.http.get(url, this.httpOptions); // post debido a que la cant de parametros para filtrar es mayor a 2.
    }

    createRequestObtenerGastosConFiltro(): any {

        let body = {
            "propietario" : "7ideas",
            "modulo"      : "Compras",
            "categoria"   : "Facturas",
            "etiqueta"    : "-Oficina-",
            "pagina"      : this.index,
        }
        let url = API_URL + 'compras';
        return this.http.post(url, body, this.httpOptions); // post debido a que la cant de parametros para filtrar es mayor a 2.
    }

     createRequestGastosByProveedor( idProveedor: string): any {

         let httpHeaders = new HttpHeaders({
             'Authorization': this.cookieService.get('tokenAuth')
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

    obtenerMasComprobantes() : any {
        this.index = this.index + 1;
        //let gastos : any = [];
        return new Promise((resolve, reject) => {
            this.createRequestObtenerGastosConFiltro()
                .subscribe((response: any) => {
                    //gastos = response;
                    let gastos = response.map(gasto => {
                        return new Gasto(gasto);
                    });
                    this.gastos = this.gastos.concat(gastos);
                    this.onGastosChanged.next(this.gastos);
                    resolve(this.gastos)

                }, reject);
        });
    }

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
