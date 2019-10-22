import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

import { FuseUtils } from '@fuse/utils';

import { Gasto } from './gasto.model';
import { CookieService } from 'ngx-cookie-service';

import { environment } from 'environments/environment';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';


// const API_URL: string = environment.API;
const LIST_URL = environment.API.concat('compras');     // Get
const CRUD_URL = environment.API.concat('comprobante');  // Put, Post y Delete

@Injectable()
export class ComprobantesService implements Resolve<any>
{
    public static readonly TITULO:  string = 'Gastos';
    public static readonly ENTIDAD: string = 'Gasto';
    public static readonly ROL_PERSONA: string = 'Proveedor';

    public static readonly MODULO: string = 'Compras';
    public static readonly CATEGORIA: string = 'Facturas';
    public static readonly ETIQUETA: string = '-Oficina-';

    onSelectedGastosChanged: BehaviorSubject<any>;
    selectedGastos: string[] = [];

    onGastosChanged: BehaviorSubject<any>;
    gastos: Gasto[] = [];
    
    onGastoChanged: BehaviorSubject<any>;
    gasto: Gasto = new Gasto({});

    onSearchTextChanged: Subject<any>;
    onFilterChanged: Subject<any>; 

    infoOnChanged = new BehaviorSubject({});
    info: any;

    searchText: string;
    filterBy: string;

    index: number;
    
    httpOptions: any;

    /**
     * Constructor
     *
     */
    constructor(private http: HttpClient, private cookieService: CookieService){      
        // Set the defaults
        this.onGastosChanged = new BehaviorSubject([]);
        this.onGastoChanged = new BehaviorSubject([]);

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
        };
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
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any{
        
        if ((state.url.indexOf('/proveedores/') > -1) && (route.params['id'])){            
            return new Promise((resolve, reject) => {

                Promise.all([
                    this.getGastosByProveedor(route.params['id']),
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
                this.getGastos(),
            ]).then(
                ([files]) => {

                    this.onSearchTextChanged.subscribe(searchText => {
                        this.searchText = searchText;
                        this.filterGastos();
                    });
 
                    resolve();

                },
                reject
            );
        }); 
    }

    /**
     * getGastos
     * 
     * Encargado de traer los gastos x pagina
     * 
     */
    getGastos(): Promise<any>{
         return new Promise((resolve, reject) => {
             this.createRequestObtenerGastosConFiltro() // pagina es lo que se envia 
                    .subscribe((response: any) => {
 
                        if (response == null){ // Fix en caso de null
                            response = [];
                        }
     
                        this.gastos = response.map(gasto => {                            
                            return new Gasto(gasto);
                        });

                        this.onGastosChanged.next(this.gastos);  
                        
                        resolve(this.gastos);

                    }, reject);
            }); 
    }
    
    /**
     * Encargado de traer del backen los gastos de un proveedor determinado
     * @param idProveedor 
     */
    getGastosByProveedor(idProveedor: string): Promise<any> {
        return new Promise((resolve, reject) => {
            this.createRequestGastosByProveedor(idProveedor)
                .subscribe((response: any) => {

                    if (response == null){
                        response = [];
                    }

                    this.gastos = response.map(gasto => {
                        return new Gasto(gasto);
                    });
                    
                    this.onGastosChanged.next(this.gastos);

                    resolve(this.gastos);
                }, reject);
        });
    }

    /**
     * Inicializa valores al gasto
     * @param gasto 
     */
    initGasto(gasto: Gasto): Gasto {
        gasto.categoria = ComprobantesService.CATEGORIA;
        gasto.etiqueta = ComprobantesService.ETIQUETA;
        gasto.modulo = ComprobantesService.MODULO;

        return gasto;
    }



    ////////////////////////////////////////////////////////////////////////////////////////////////////////
    // Metodos Privados
    ////////////////////////////////////////////////////////////////////////////////////////////////////////

    /**
     * filtra los gastos dependiendo del texto
     */
    private filterGastos(): void {
        let filtered: Gasto[] = [];
        if (this.searchText && this.searchText !== '') {
            filtered = FuseUtils.filterArrayByString(this.gastos, this.searchText);
            this.onGastosChanged.next(filtered);
        }
        else {
            this.onGastosChanged.next(this.gastos);
        }
    }






    ///////////////////////////////////////////////////////////////////////
    // createRequest
    ///////////////////////////////////////////////////////////////////////

    private createRequestAddGasto(gasto: Gasto): any {
        let request = JSON.stringify(gasto); // agrego un nuevo gasto. 

        return this.http.post(CRUD_URL, request, this.httpOptions);
    }

    private createRequestUpdateGasto(gasto: Gasto): any {
        let request = JSON.stringify(gasto);

        return this.http.put(CRUD_URL, request, this.httpOptions);
    }

    private createRequestRemoveGasto(gasto: Gasto): any {
        let options; 
        let params = new HttpParams();
        params = params.set('id', gasto.id );
        options = {
            headers: new HttpHeaders({
                'Authorization': this.cookieService.get('tokenAuth')
            }),
            params : params,
        };

        return this.http.delete(CRUD_URL, { params : params });
    }

    private createRequestObtenerGastos(): any {
        return this.http.get(LIST_URL, this.httpOptions); 
    }

    private createRequestObtenerGastosConFiltro(): any {
        let body = {
            'modulo'      : 'Compras',
            'categoria'   : 'Facturas',
            'etiqueta'    : '-Oficina-',
            'pagina'      : this.index,
        };

        return this.http.post(LIST_URL, body, this.httpOptions); // post debido a que la cant de parametros para filtrar es mayor a 2.
    }

    private createRequestGastosByProveedor( idProveedor: string): any {
        let httpHeaders = new HttpHeaders({
            'Authorization': this.cookieService.get('tokenAuth')
        });

        let params = {
            'proveedor': idProveedor
        };

        let options = {
            headers: httpHeaders,
            params : params
        };

        return this.http.get(LIST_URL, options);
    }



///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// De aca para abajo hay que revisar TODO 
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    

    addGasto(gasto: Gasto): Promise<any> {
        return new Promise((resolve, reject) => {

            this.createRequestAddGasto(gasto)
                .subscribe((response: any) => {
                    this.getGastos();
                });
        });
    }

    deleteGasto(gasto: Gasto): Promise<any> {
        return new Promise((resolve, reject) => {

            this.createRequestRemoveGasto(gasto)
                .subscribe(response => {
                    this.deleteContactList(gasto);
                    resolve(response);
                });
        });
    }

    deleteContactList(gasto: Gasto): void {
        const contactIndex = this.gastos.indexOf(gasto);
        if (contactIndex !== -1) {
            this.gastos.splice(contactIndex, 1);
            this.onGastosChanged.next(this.gastos);
        }
    }
    
    getGasto(id: string): Gasto {
        let gasto: Gasto;
        gasto = this.gastos.find(element =>  element.id == id  );
        return gasto;    
    }

    obtenerMasComprobantes(): any {
        this.index = this.index + 1;
        
        return new Promise((resolve, reject) => {
            this.createRequestObtenerGastosConFiltro()
                .subscribe((response: any) => {                    
        
                    if (response == null){
                        response = null;
                    }

                    let gastos = response.map(gasto => {
                        return new Gasto(gasto);
                    });

                    this.gastos = this.gastos.concat(gastos);
                    this.onGastosChanged.next(this.gastos);

                    resolve(this.gastos);

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
    updateContact(gasto: Gasto): Promise<any>
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
