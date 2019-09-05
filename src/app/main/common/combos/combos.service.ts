import { FuseUtils } from '@fuse/utils';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { environment } from 'environments/environment';
import { ErrorService } from 'app/main/errors/error.service';
import { LoginService } from 'app/main/authentication/login-2/login-2.service';
import { Combo } from './combo.model';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

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
    private comboConceptoExterna: Combo[];
    
    onComboConceptoCuantitativaChanged: BehaviorSubject<any>;
    onComboConceptoCualitativaChanged: BehaviorSubject<any>;
    onComboConceptoExternaChanged: BehaviorSubject<any>;
    
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
        private _loginService: LoginService
    ) {
        this.onComboOrigenDep_SucChanged = new BehaviorSubject([]);
        this.onComboOrigenExt_RRHHChanged = new BehaviorSubject([]);
        this.onComboOrigenExtChanged = new BehaviorSubject([]);
        this.onComboOrigenRRHHChanged = new BehaviorSubject([]);
        this.onComboOrigenPeriodoChanged = new BehaviorSubject([]);
        this.onComboConceptoCuantitativaChanged = new BehaviorSubject([]);
        this.onComboConceptoCualitativaChanged = new BehaviorSubject([]);
        this.onComboConceptoExternaChanged = new BehaviorSubject([]);

        this.comboOrigenDep_Suc = [];
        this.comboOrigenExt_RRHH = [];
        this.comboOrigenExt = [];
        this.comboOrigenRRHH = [];
        this.comboOrigenPeriodo = [];
        this.comboConceptoCuantitativa = [];
        this.comboConceptoCualitativa = [];
        this.comboConceptoExterna = [];
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
     * @param {string} combo { 'dep-suc' || 'ext-rrhh' || 'ext' || 'rrhh' || 'periodos' || 'cualitativo' || 'cuantitativo' || 'externa' }
     */
    getCombo(combo: string): Combo[]{
        let respuesta: Combo[] = [];

        this.initCombo(combo);
        
        switch (combo) {
            case 'cualitativo' : respuesta = this.comboConceptoCuantitativa; break;
            case 'cuantitativo': respuesta = this.comboConceptoCualitativa;  break;
            case 'externa'     : respuesta = this.comboConceptoExterna;      break;

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

            // Harcodeados
            case 'cualitativo' : url = 'api/combo_cualitativo';   break;
            case 'cuantitativo': url = 'api/combo_cuantitativo';  break;
            case 'externa'     : url = 'api/combo_externa';       break;        
            
            // Backend
            case 'dep-suc'     : url = url + 'equipos';           break;
            case 'ext-rrhh'    : url = url + 'sectores';          break;
            case 'ext'         : url = url + 'sectores-externos'; break;            
            case 'rrhh'        : url = url + 'sectores-rrhh';     break;
            case 'periodos'    : url = 'periodos';                break;
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
        const combos = [
            'cualitativo',
            'cuantitativo',
            'externa',
            'dep-suc',
            'ext-rrhh',
            'ext',
            'rrhh',
            'periodos',
        ];

        combos.forEach(combo => {
            // console.log(combo);
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
                if (this.comboConceptoCualitativa .length > 0){
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

            case 'externa':
                if (this.comboConceptoExterna.length > 0){
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
            case 'externa':
                this.comboConceptoExterna = response;
                this.onComboConceptoExternaChanged.next(this.comboConceptoExterna);
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

            arrPeriodo.push(new Combo({
                'codigo': this._to2digit(today.getMonth() + 1) + '-' + today.getFullYear(),
                'valor': today.toLocaleDateString('latn-ES', opt),
            }));

            today.setMonth(today.getMonth() + index);
        }
        
        return arrPeriodo;
    }

    private _to2digit(n: number): string {
        return ('00' + n).slice(-2);
    }

}
