import { FuseUtils } from '@fuse/utils';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'environments/environment';
import { ErrorService } from 'app/main/errors/error.service';
import { LoginService } from 'app/main/authentication/login-2/login-2.service';
import { Combo } from './combo.model';

const API_URL: string = environment.API;

@Injectable()
export class CombosService 
{

    private comboOrigenDep_Suc: Combo[];
    private comboOrigenExt_RRHH: Combo[];
    private comboOrigenExt: Combo[];
    private comboOrigenRRHH: Combo[];
    private comboOrigenPeriodo: Combo[];
    

    // onComboChanged: BehaviorSubject<any>;
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
        // Set the defaults
        // this.onComboChanged = new BehaviorSubject([]);

        this.onComboOrigenDep_SucChanged = new BehaviorSubject([]);
        this.onComboOrigenExt_RRHHChanged = new BehaviorSubject([]);
        this.onComboOrigenExtChanged = new BehaviorSubject([]);
        this.onComboOrigenRRHHChanged = new BehaviorSubject([]);
        this.onComboOrigenPeriodoChanged = new BehaviorSubject([]);

        this.comboOrigenDep_Suc = [];
        this.comboOrigenExt_RRHH = [];
        this.comboOrigenExt = [];
        this.comboOrigenRRHH = [];
        this.comboOrigenPeriodo = [];
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Devuelve el combo correspondiente, si no lo tiene lo trae del backend
     * @param {string} combo { 'dep-suc' || 'ext-rrhh' || 'ext' || 'rrhh' || 'periodos' }
     */
    getCombo(combo: string): Combo[]{
        let respuesta: Combo[] = [];

        this.initCombo(combo);
        
        switch (combo) {
            case 'dep-suc' : respuesta = this.comboOrigenDep_Suc;  break;
            case 'ext-rrhh': respuesta = this.comboOrigenExt_RRHH; break;
            case 'ext'     : respuesta = this.comboOrigenExt;      break;
            case 'rrhh'    : respuesta = this.comboOrigenRRHH;     break;
            case 'periodos': respuesta = this.comboOrigenPeriodo;  break;
            default        : /**  No hago nada                  */ break;
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
            // case 'ext-rrhh': url = 'api/combo_ext_rrhh'; break;
            // case 'ext': url = 'api/combo_ext'; break;
            // case 'rrhh': url = 'api/combo_rrhh'; break;
            
            case 'dep-suc' : url = 'api/combo_dep_suc';       break;            
            
            case 'ext-rrhh': url = url + 'sectores';          break;
            case 'ext'     : url = url + 'sectores-externos'; break;            
            case 'rrhh'    : url = url + 'sectores-rrhh';     break;

            case 'periodos': url = 'periodos';          break;
            default        : url = '';                        break;
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

        return new Promise(() => {        
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
            case 'dep-suc' : 
                this.comboOrigenDep_Suc = response;  
                this.onComboOrigenDep_SucChanged.next(this.comboOrigenDep_Suc);
                break;
            case 'ext-rrhh': 
                this.comboOrigenExt_RRHH = response; 
                this.onComboOrigenExt_RRHHChanged.next(this.comboOrigenExt_RRHH);
                break;
            case 'ext'     : 
                this.comboOrigenExt = response;      
                this.onComboOrigenExtChanged.next(this.comboOrigenExt);
                break;
            case 'rrhh'    : 
                this.comboOrigenRRHH = response;     
                this.onComboOrigenRRHHChanged.next(this.comboOrigenRRHH);
                break;
            case 'periodos': 
                this.comboOrigenPeriodo = response;  
                this.onComboOrigenPeriodoChanged.next(this.comboOrigenPeriodo);
                break;
            default        : /**    No hago nada              */  break;
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