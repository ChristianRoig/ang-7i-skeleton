import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { environment } from 'environments/environment';
import { ErrorService } from 'app/main/errors/error.service';
import { LoginService } from 'app/main/authentication/login-2/login-2.service';
import { Combo } from './combo.model';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Concepto } from 'app/main/configurar/conceptos/concepto.model';
import { ConceptosService } from 'app/main/configurar/conceptos.service';
import { takeUntil } from 'rxjs/operators';
import { FuseUtils } from '@fuse/utils';

const API_URL: string = environment.API;

@Injectable()
export class CombosService implements Resolve<any>
{
    private comboOrigenDep_Suc: Combo[];
    private comboOrigenExt_RRHH: Combo[];
    private comboOrigenExt: Combo[];
    private comboOrigenRRHH: Combo[];
    private comboOrigenPeriodo: Combo[];

    private comboConceptoCuantitativa: Combo[];
    private comboConceptoCualitativa: Combo[];
    private comboConceptoExternaRRHH: Combo[];
    
    private _auxAllConceptos: Concepto[];
    private _unsubscribeAll: Subject<any>;

    onComboConceptoCuantitativaChanged: BehaviorSubject<any>;
    onComboConceptoCualitativaChanged: BehaviorSubject<any>;
    onComboConceptoExternaRRHHChanged: BehaviorSubject<any>;
    
    onComboOrigenDep_SucChanged: BehaviorSubject<any>;
    onComboOrigenExt_RRHHChanged: BehaviorSubject<any>;
    onComboOrigenExtChanged: BehaviorSubject<any>;
    onComboOrigenRRHHChanged: BehaviorSubject<any>;
    onComboOrigenPeriodoChanged: BehaviorSubject<any>;

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
        private _loginService: LoginService,
        private _conceptoService: ConceptosService
    ) {
        this.onComboOrigenDep_SucChanged = new BehaviorSubject([]);
        this.onComboOrigenExt_RRHHChanged = new BehaviorSubject([]);
        this.onComboOrigenExtChanged = new BehaviorSubject([]);
        this.onComboOrigenRRHHChanged = new BehaviorSubject([]);
        this.onComboOrigenPeriodoChanged = new BehaviorSubject([]);
        this.onComboConceptoCuantitativaChanged = new BehaviorSubject([]);
        this.onComboConceptoCualitativaChanged = new BehaviorSubject([]);
        this.onComboConceptoExternaRRHHChanged = new BehaviorSubject([]);

        this.comboOrigenDep_Suc = [];
        this.comboOrigenExt_RRHH = [];
        this.comboOrigenExt = [];
        this.comboOrigenRRHH = [];
        this.comboOrigenPeriodo = [];
        this.comboConceptoCuantitativa = [];
        this.comboConceptoCualitativa = [];
        this.comboConceptoExternaRRHH = [];

        this._auxAllConceptos = [];

        this._unsubscribeAll = new Subject();
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
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
        return new Promise((resolve, reject) => {
            Promise.all([
                this._getAll()
            ]).then(
                ([files]) => {

                    this._conceptoService.onConceptosChanged
                        .pipe(takeUntil(this._unsubscribeAll))
                        .subscribe(data => {                            
                            if (!(this._compareArrConceptos(this._auxAllConceptos, data))) {                                
                                this._auxAllConceptos = data;
                                this._actualizarComboConcepto('cualitativo');
                                this._actualizarComboConcepto('cuantitativo');
                                this._actualizarComboConcepto('externa-rrhh');    
                            }
                        });

                    resolve();
                },
                (error) => {                
                    this._errorService.errorHandler(error, 'error en el servicio de combos');                   
                    resolve();
                }
            );
        });
    }



    /**
     * Devuelve el combo correspondiente, si no lo tiene lo trae del backend
     * @param {string} combo { 'dep-suc' || 'ext-rrhh' || 'ext' || 'rrhh' || 'periodos' || 'cualitativo' || 'cuantitativo' || 'externa-rrhh' }
     */
    getCombo(combo: string): Combo[]{
        let respuesta: Combo[] = [];

        this.initCombo(combo);
        
        switch (combo) {
            case 'cualitativo' : respuesta = this.comboConceptoCuantitativa; break;
            case 'cuantitativo': respuesta = this.comboConceptoCualitativa;  break;
            case 'externa-rrhh': respuesta = this.comboConceptoExternaRRHH;  break;

            case 'dep-suc'     : respuesta = this.comboOrigenDep_Suc;        break;
            case 'ext-rrhh'    : respuesta = this.comboOrigenExt_RRHH;       break;
            case 'ext'         : respuesta = this.comboOrigenExt;            break;
            case 'rrhh'        : respuesta = this.comboOrigenRRHH;           break;
            case 'periodos'    : respuesta = this.comboOrigenPeriodo;        break;
            default            : /**  No hago nada                       */  break;
        }

        return respuesta;
        
    }

    /**
     * Inicia el proceso para traer los combos del backend
     * @param {string} combo
     */
    initCombo(combo: string): any{
        let url = API_URL;      

        switch (combo) {

            // desde Conceptos
            case 'cualitativo' : url = null;                      break; //'api/combo_cualitativo'
            case 'cuantitativo': url = null;                      break; //'api/combo_cuantitativo'
            case 'externa-rrhh': url = null;                      break; //'api/combo_externa'
            
            // desde Origenes
            case 'dep-suc'     : url = url + 'equipos';           break;
            case 'ext-rrhh'    : url = url + 'sectores';          break;
            case 'ext'         : url = url + 'sectores-externos'; break;            
            case 'rrhh'        : url = url + 'sectores-rrhh';     break;
            
            // Generada internamente
            case 'periodos'    : url = null;                      break;
            default            : url = '';                        break;
        }


        if (url === ''){ // Si no es valida la url no hago nada
            return;
        }

        if (!(this._isEmpty(combo))){ // Si ya fue cargado no lo vuelvo a cargar
            return;
        }

        if (combo === 'periodos') {
            const data = this._generateComboPeriodo();

            this._updateInternalValues(combo, data);

            return;
        }

        if ((combo === 'cualitativo') || (combo === 'cuantitativo') || (combo === 'externa-rrhh')) {
            if (this._auxAllConceptos.length === 0){
               return;
            }
            
            this._actualizarComboConcepto(combo);
            
            return;
        }


        return new Promise((resolve, reject) => {        
            this._createRequest(url)            
                .subscribe(
                    (response: Combo[]) => {
                        if (response == null) {
                            response = [];
                        }

                        response = response.map(res => {
                            return new Combo(res);
                        });

                        this._updateInternalValues(combo, response);
                        resolve();
                    },
                    (err) => {
                        this._errorService.errorHandler(err, 'Lo sentimos, algo salio mal reintente nuevamente', 403);
                    });
        });
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Private methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * _getAll()
     * Metodo utilizado para cargar todos los combos
     */
    private _getAll(): void {
        if (this._auxAllConceptos.length === 0){            
            this._conceptoService.getAllConceptos(); // Fuerzo los conceptos
        }
        
        const combos = [
            'dep-suc',
            'ext-rrhh',
            'ext',
            'rrhh',
            'periodos',
            'cualitativo',
            'cuantitativo',
            'externa-rrhh',
        ];

        combos.forEach(combo => {            
            this.initCombo(combo);
        });
    }

    /**
     * Determina si el combo requerido ya fue consultado o no
     * @param {string} combo 
     */
    private _isEmpty(combo: string): boolean{
        let respuesta: boolean;
        switch (combo) {
            case 'dep-suc':
                if (this.comboOrigenDep_Suc.length > 0){
                    respuesta = false;
                }else{
                    respuesta = true;
                }

                break;

            case 'ext-rrhh':
                if (this.comboOrigenExt_RRHH.length > 0){
                    respuesta = false;
                }else{
                    respuesta = true;
                }

                break;

            case 'ext':
                if (this.comboOrigenExt.length > 0){
                    respuesta = false;
                }else{
                    respuesta = true;
                }

                break;

            case 'rrhh':
                if (this.comboOrigenRRHH.length > 0){
                    respuesta = false;
                }else{
                    respuesta = true;
                }

                break;

            case 'periodo':
                if (this.comboOrigenPeriodo.length > 0){
                    respuesta = false;
                }else{
                    respuesta = true;
                }

                break;

            case 'cualitativo':
                if (this.comboConceptoCualitativa.length > 0){
                    respuesta = false;
                }else{
                    respuesta = true;
                }
                
                break;

            case 'cuantitativo':
                if (this.comboConceptoCuantitativa.length > 0){
                    respuesta = false;
                }else{
                    respuesta = true;
                }
                
                break;

            case 'externa-rrhh':
                if (this.comboConceptoExternaRRHH.length > 0){
                    respuesta = false;
                }else{
                    respuesta = true;
                }
                
                break;

            default:
                    respuesta = true;
                break;
        }
        return respuesta;
    }

    /**
     * Actualiza la variable & el Observer correspondientes al combo deseado con la informacion traida desde el backend
     * @param {string} combo 
     * @param {Combo[]} response 
     */
    private _updateInternalValues(combo: string, response: Combo[]): void {        
        switch (combo) {
            case 'cualitativo':
                this.comboConceptoCualitativa = response;
                this.onComboConceptoCualitativaChanged.next(this.comboConceptoCualitativa);
                break;
            case 'cuantitativo':
                this.comboConceptoCuantitativa = response;
                this.onComboConceptoCuantitativaChanged.next(this.comboConceptoCuantitativa);
                break;
            case 'externa-rrhh':
                this.comboConceptoExternaRRHH = response;
                this.onComboConceptoExternaRRHHChanged.next(this.comboConceptoExternaRRHH);
                break;
            case 'dep-suc': 
                this.comboOrigenDep_Suc = response;  
                this.onComboOrigenDep_SucChanged.next(this.comboOrigenDep_Suc);
                break;
            case 'ext-rrhh': 
                this.comboOrigenExt_RRHH = response; 
                this.onComboOrigenExt_RRHHChanged.next(this.comboOrigenExt_RRHH);
                break;
            case 'ext': 
                this.comboOrigenExt = response;      
                this.onComboOrigenExtChanged.next(this.comboOrigenExt);
                break;
            case 'rrhh': 
                this.comboOrigenRRHH = response;     
                this.onComboOrigenRRHHChanged.next(this.comboOrigenRRHH);
                break;
            case 'periodos': 
                this.comboOrigenPeriodo = response;  
                this.onComboOrigenPeriodoChanged.next(this.comboOrigenPeriodo);
                break;
            default: /**    No hago nada              */  break;
        }   
    }

    /**
     * _actualizarComboConcepto()
     * Encargado de invocar a cada 'cargar' sergun el combo ingresado.
     * @param {string} combo 
     */
    private _actualizarComboConcepto(combo: string): void {
        switch (combo) {
            case 'cualitativo':
                        this._cargarCualitativo();     break;
            case 'cuantitativo':
                        this._cargarCuantitativo();    break;
            case 'externa-rrhh':
                        this._cargarExternaRRHH();     break;
            default:    /**        No hago nada    */  break;
        }
    }

    /**
     * _cargarCualitativo()
     * Filtra los conceptos y crea el combo Cualitativo desde conceptos
     */
    private _cargarCualitativo(): void {
        const aux: Concepto[] = FuseUtils.filterArrayByString(this._auxAllConceptos, 'CUALITATIVO');

        if (aux.length === 0){
            // console.log('Los conceptos filtrados por CUALITATIVO es null');
            return;
        }

        let combos: Combo[] = [];
        aux.forEach(concepto => {            
            combos.push( new Combo({
                'codigo': concepto.codNov,
                'valor' : concepto.descripcion,
            }));
        });
        
        this._updateInternalValues('cualitativo', combos);
    }


    /**
     * _cargarCuantitativo()
     * En la base esta como EQUIPO
     * Filtra los conceptos y crea el combo Cuantitativo desde conceptos
     */
    private _cargarCuantitativo(): void {
        const aux: Concepto[] = FuseUtils.filterArrayByString(this._auxAllConceptos, 'EQUIPO');

        if (aux.length === 0) {
            // console.log('Los conceptos filtrados por Cuantitativo/EQUIPO es null');
            return;
        }

        let combos: Combo[] = [];
        aux.forEach(concepto => {
            combos.push(new Combo({
                'codigo': concepto.codNov,
                'valor': concepto.descripcion,
            }));
        });
        
        this._updateInternalValues('cuantitativo', combos);
    }

    /**
     * _cargarExternaRRHH()
     * Filtra los conceptos y crea el combo ExternaRRHH desde conceptos
     */
    private _cargarExternaRRHH(): void {
        const auxE: Concepto[] = FuseUtils.filterArrayByString(this._auxAllConceptos, 'EXTERNA');
        const auxR: Concepto[] = FuseUtils.filterArrayByString(this._auxAllConceptos, 'RRHH');

        if (auxE.length === 0 && auxR.length === 0) {
            // console.log('Los conceptos filtrados por EXTERNA & RRHH son null');
            return;
        }

        let combos: Combo[] = [];

        auxE.forEach(concepto => {
            combos.push(new Combo({
                'codigo': concepto.codNov,
                'valor': concepto.descripcion,
                'valor2': concepto.codOrigen,
                'valor3': concepto.tipoNov
            }));
        });

        auxR.forEach(concepto => {
            combos.push(new Combo({
                'codigo': concepto.codNov,
                'valor': concepto.descripcion,
                'valor2': concepto.codOrigen,
                'valor3': concepto.tipoNov
            }));
        }); 
        
        this._updateInternalValues('externa-rrhh', combos);
    }

    /**
     * Realiza el llamado al backend mediante la url y token
     * @param {string} url 
     */
    private _createRequest(url: string): Observable<any> | any {
        const httpHeaders = new HttpHeaders({
            'Authorization': this._loginService.getLocalToken()
        });

        const options = { headers: httpHeaders };

        return this._httpClient.get(url, options);
    }

    /**
     * Genera de forma dinamica el combo segun la fecha actual
     */
    private _generateComboPeriodo(): Combo[]{
        const opt = {year: 'numeric', month: 'long'};
        const arrPeriodo: Combo[] = [];
        
        const today = new Date();
        
        for (let index = 0; index <= 12; index++) {      
            today.setMonth(today.getMonth() - index);

            // 'valor': today.toLocaleDateString('latn-ES', opt), // no le gusta a firefox
            
            arrPeriodo.push(new Combo({
                'codigo': this._to2digit(today.getMonth() + 1) + '-' + today.getFullYear(),
                'valor': today.toLocaleDateString('es-ES', opt),                
            }));

            today.setMonth(today.getMonth() + index);
        }
        
        return arrPeriodo;
    }

    /**
     * _compareArrConceptos()
     * Determino si los dos [] de conceptos son iguales o no.
     * @param {Concepto[]} c1 
     * @param {Concepto[]} c2 
     */
    private _compareArrConceptos(c1: Concepto[], c2: Concepto[]): boolean {
        if (c1.length !== c2.length) {
            return false;
        }

        for (let index = 0; index < c1.length; index++) {
            if (!(c1[index].compare(c2[index]))){
                return false;
            }            
        }

        return true;
    }

    private _to2digit(n: number): string {
        return ('00' + n).slice(-2);
    }

}
