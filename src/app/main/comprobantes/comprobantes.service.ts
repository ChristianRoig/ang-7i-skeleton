import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

import { FuseUtils } from '@fuse/utils';

import { Gasto } from './gasto.model';
import { CookieService } from 'ngx-cookie-service';

import { environment } from 'environments/environment';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Contact } from '../personas/contact.model';


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

    onGastosProveedorChanged: BehaviorSubject<any>;
    gastosProveedor: Gasto[] = [];
    
    onGastoChanged: BehaviorSubject<any>;
    gasto: Gasto = new Gasto({});

    onSearchTextChanged: Subject<any>;
    onFilterChanged: Subject<any>; 

    searchText: string;
    httpOptions: any;
    filterBy: string;
    index: number;    

    /**
     * Constructor
     */
    constructor(private http: HttpClient, private cookieService: CookieService){      
        // Set the defaults
        
        this.onGastosChanged = new BehaviorSubject([]);
        this.onGastosProveedorChanged = new BehaviorSubject([]);
        this.onGastoChanged = new BehaviorSubject([]);
                        
        this.onSelectedGastosChanged = new BehaviorSubject([]);
        this.onSearchTextChanged = new Subject();
        this.onFilterChanged = new Subject();

        this.index = 0;

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
              
        return new Promise((resolve, reject) => {

            Promise.all([

                this._pasaMano(route, state),
                this._pasaMano2(route, state)

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
     * Inicializa valores al gasto
     * @param gasto 
     */
    initGasto(gasto: Gasto): Gasto {
        gasto.categoria = ComprobantesService.CATEGORIA;
        gasto.etiqueta = ComprobantesService.ETIQUETA;
        gasto.modulo = ComprobantesService.MODULO;

        return gasto;
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

                    this.gastosProveedor = response.map(gasto => {
                        return new Gasto(gasto);
                    });
                    
                    this.onGastosProveedorChanged.next(this.gastosProveedor);

                    resolve(this.gastosProveedor);
                }, reject);
        });
    }

    /**
     * Envia un gasto al backend para guardar
     * @param gasto 
     */
    addGasto(gasto: Gasto): Promise<any> {
        return new Promise((resolve, reject) => {

            this.createRequestAddGasto(gasto)
                .subscribe((response: any) => {
                    this.getGastos();
                });
        });
    }

    /**
     * Envia la peticion al back para eliminar un gasto en particular
     * @param gasto 
     * @param proveedor 
     */
    deleteGasto(gasto: Gasto, proveedor?: Contact): Promise<any> {
        return new Promise((resolve, reject) => {

            this.createRequestRemoveGasto(gasto)
                .subscribe(response => {
                    // this.deleteContactList(gasto);
                    
                    if (proveedor){
                        this.getGastosByProveedor(proveedor.id);
                    }
                    
                    this.getGastos();


                    resolve(response);
                });
        });
    }

    /**
     * Envia al backend un gasto para que sea actualizado
     *
     * @param contact
     * @returns {Promise<any>}
     */
    updateContact(gasto: Gasto, proveedor?: Contact): Promise<any> {
        return new Promise((resolve, reject) => {
            this.createRequestUpdateGasto(gasto)
                .subscribe(response => {

                    if (proveedor) {
                        this.getGastosByProveedor(proveedor.id);
                    }

                    
                    this.getGastos();


                    // resolve(response);
                });
        });
    } 

    /**
     * Realiza llamado al back para traer mas comprobantes
     */
    obtenerMasComprobantes(): any {
        this.index = this.index + 1;

        return new Promise((resolve, reject) => {
            this.createRequestObtenerGastosConFiltro()
                .subscribe((response: any) => {

                    if (response == null) {
                        response = [];
                    }

                    let _gastos = response.map(gasto => {
                        return new Gasto(gasto);
                    });

                    this.gastos = this.gastos.concat(_gastos);
                    this.onGastosChanged.next(this.gastos);

                    resolve(this.gastos);

                }, reject);
        });
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Private methods
    // -----------------------------------------------------------------------------------------------------

    // No es posible poner el if dentro del Promise.all([...])
    // https://i.imgur.com/MYt0BFt.jpg?noredirect

    // Pasa Mano para Traer Gastos de un Proveedor 
    private _pasaMano2(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): void { 
        if ((state.url.indexOf('/proveedores/') > -1) && (route.params['id'])) {
            this.getGastosByProveedor(route.params['id']);
        }
    }

    // Pasa Mano para Traer o No los Gastos
    private _pasaMano(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): void {       
        // tslint:disable-next-line: triple-equals
        if (this.gastos.length == 0){
            this.getGastos();
        }
    }

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


    private deleteContactList(gasto: Gasto): void {
        let contactIndex = this.gastos.indexOf(gasto);
        console.log(contactIndex);
        if (contactIndex !== -1) {
            this.gastos.splice(contactIndex, 1);

            console.log('eliminado de gastos');
            this.onGastosChanged.next(this.gastos);
        }

        contactIndex = this.gastosProveedor.indexOf(gasto);
        console.log(contactIndex);
        if (contactIndex !== -1) {
            console.log(this.gastosProveedor);
            this.gastosProveedor.splice(contactIndex, 1);
            console.log(this.gastosProveedor);
            console.log('eliminado de gastosProveedor');
            this.onGastosProveedorChanged.next(this.gastosProveedor);
        }
    }



    ///////////////////////////////////////////////////////////////////////
    // createRequest
    ///////////////////////////////////////////////////////////////////////

    private createRequestObtenerGastos(): any {
        return this.http.get(LIST_URL, this.httpOptions);
    }

    private createRequestAddGasto(gasto: Gasto): any {
        let request = JSON.stringify(gasto); 

        return this.http.post(CRUD_URL, request, this.httpOptions);
    }

    private createRequestUpdateGasto(gasto: Gasto): any {
        let request = JSON.stringify(gasto);

        return this.http.put(CRUD_URL, request, this.httpOptions);
    }

    private createRequestRemoveGasto(gasto: Gasto): any {
        let params = {
            'id': gasto.id,
        };

        let options = {
            headers: new HttpHeaders({
                'Authorization': this.cookieService.get('tokenAuth')
            }),
            params : params,
        };

        return this.http.delete(CRUD_URL, options);
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
    
    // Esto se tiene que cambiar por un servicio en el backend 
    getGasto(id: string): Gasto {
        let gasto: Gasto;
        gasto = this.gastos.find(element =>  element.id == id  );
        return gasto;    
    }


    /**
     * Toggle selected contact by id
     *
     * @param id
     */
    toggleSelectedContact(id): void
    {
        // First, check if we already have that contact as selected...
        // if ( this.selectedGastos.length > 0 )
        // {
        //     const index = this.selectedGastos.indexOf(id);

        //     if ( index !== -1 )
        //     {
        //         this.selectedGastos.splice(index, 1);

        //         // Trigger the next event
        //         this.onSelectedGastosChanged.next(this.selectedGastos);

        //         // Return
        //         return;
        //     }
        // } 

        // If we don't have it, push as selected
        // this.selectedGastos.push(id);

        // Trigger the next event
        // this.onSelectedGastosChanged.next(this.selectedGastos);
    }

    /**
     * Toggle select all
     */
    toggleSelectAll(): void
    {
        // if ( this.selectedGastos.length > 0 )
        // {
        //     this.deselectGastos();
        // }
        // else
        // {
        //     this.selectGastos();
        // } 
    }

    /**
     * Select contacts
     *
     * @param filterParameter
     * @param filterValue
     */
    selectGastos(filterParameter?, filterValue?): void
    {
        // this.selectedGastos = [];

        // If there is no filter, select all contacts
        // if ( filterParameter === undefined || filterValue === undefined )
        // {
        //     this.selectedGastos = [];
        //     this.gastos.map(contact => {
        //         this.selectedGastos.push(contact.id);
        //     });
        // }

        // Trigger the next event
        // this.onSelectedGastosChanged.next(this.selectedGastos);
    }

    /**
     * Deselect contacts
     */
    deselectGastos(): void
    {
        // this.selectedGastos = [];

        // Trigger the next event
        // this.onSelectedGastosChanged.next(this.selectedGastos); 
    }

    /**
     * Delete selected contacts
     */
    deleteSelectedGastos(): void
    {
        // for ( const contactId of this.selectedGastos )
        // {
        //     const contact = this.gastos.find(_contact => {
        //         return _contact.id === contactId;
        //     });
        //     const contactIndex = this.gastos.indexOf(contact);
        //     this.gastos.splice(contactIndex, 1);
        // }
        // this.onGastosChanged.next(this.gastos);
        // this.deselectGastos(); 
    }
}
