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
    

    /**
     * Utilizo solo un observer para todos, dependiendo 
     * las necesitdades del sistema se podria llegar a 
     * necesitar usar uno por cada combo
     */
    onComboChanged: BehaviorSubject<any>;

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
        this.onComboChanged = new BehaviorSubject([]);

        this.comboOrigenDep_Suc = [];
        this.comboOrigenExt_RRHH = [];
        this.comboOrigenExt = [];
        this.comboOrigenRRHH = [];
        this.comboOrigenPeriodo = [];
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Readme
    // Se implementa tanto con un getCombo como con un 'onChanged' para que el servicio sea flexible
    // dependiendo de las necesidades del sistema.
    // -----------------------------------------------------------------------------------------------------
    


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

            case 'periodos': url = 'api/combo_periodo';       break;
            default        : url = '';                        break;
        }

        if (url === ''){ // Si no es valida la url no hago nada
            return;
        }

        if (!(this._isEmpty(combo))){ // Si ya fue cargado no lo vuelvo a cargar
            this._updateObserver(combo);
            return;
        }

        return new Promise(() => {        
            this._createRequest(url)            
                .subscribe(
                    (response: Combo[]) => {
                        
                        response = response.map(res => {
                            return new Combo(res);
                        });

                        this._updateInternalVar(combo, response);
                        this._updateObserver(combo);
                       
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
     * Actualiza la variable correspondiente al combo deseado con la informacion traida desde el backend
     * @param {string} combo 
     * @param {Combo[]} response 
     */
    private _updateInternalVar(combo: string, response: Combo[]): void {        
        switch (combo) {
            case 'dep-suc' : this.comboOrigenDep_Suc = response;  break;
            case 'ext-rrhh': this.comboOrigenExt_RRHH = response; break;
            case 'ext'     : this.comboOrigenExt = response;      break;
            case 'rrhh'    : this.comboOrigenRRHH = response;     break;
            case 'periodos': this.comboOrigenPeriodo = response;  break;
            default        : /**    No hago nada              */  break;
        }   
    }

    /**
     * Actualiza el Observer General del servicio
     * @param {string} combo
     */
    private _updateObserver(combo: string): void{
        let comboUpdate: any;

        switch (combo) {
            case 'dep-suc' : comboUpdate = this.comboOrigenDep_Suc;  break;
            case 'ext-rrhh': comboUpdate = this.comboOrigenExt_RRHH; break;
            case 'ext'     : comboUpdate = this.comboOrigenExt;      break;
            case 'rrhh'    : comboUpdate = this.comboOrigenRRHH;     break;
            case 'periodos': comboUpdate = this.comboOrigenPeriodo;  break;
            default        : comboUpdate = [];                       break;
        }

        this.onComboChanged.next(comboUpdate);
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

}
