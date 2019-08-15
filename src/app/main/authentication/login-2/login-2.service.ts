import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import { environment } from 'environments/environment';
import { Perfil } from 'app/main/perfil/perfil.model';
import { FuseNavigationService } from '../../../../@fuse/components/navigation/navigation.service';


const API_LOG: string = environment.API_LOG;
const API: string = environment.API;


const token: string = environment.Cookie_Token;
const user: string = environment.Cookie_User;

@Injectable()
export class LoginService 
{
    private info: any;
    private perfilLog: Perfil;
    // private datos: any;

    infoOnChanged: BehaviorSubject<any>;

    perfilLogOnChanged: BehaviorSubject<any>;
    // datosOnChanged: BehaviorSubject<any>;

    /**
     * Constructor
     *
     * @param {HttpClient} _httpClient
     * @param {CookieService} _cookieService
     * @param {Router} _router
     */
    constructor(
        private _httpClient: HttpClient,
        private _cookieService: CookieService,
        private _router: Router,

        private _fuseNavigationService: FuseNavigationService

    ) {
        // Set the defaults

        this.infoOnChanged = new BehaviorSubject({});
        this.perfilLogOnChanged = new BehaviorSubject({});
        // this.datosOnChanged = new BehaviorSubject({});

        this.init();
    }

    init(): void {

        // para mostrar o ocultar un componente del navbar
        // this._fuseNavigationService.updateNavigationItem('sector', {
        //     hidden: true
        // });  

        const userLog = this._cookieService.get(user);       
        // const datos = this._cookieService.get('datos');

        if (userLog){
            this.perfilLog = new Perfil(JSON.parse(userLog));            
        }else{
            this.perfilLog = new Perfil({});        
        }

        this.perfilLogOnChanged.next(this.perfilLog);  
    }

    /**
     * Metodo para cerra la sesion
     */
    logout(): void{
        this.infoOnChanged = new BehaviorSubject({});
        this.perfilLogOnChanged = new BehaviorSubject({});
        // this.datosOnChanged = new BehaviorSubject({});

        this._cookieService.deleteAll();
    }
    
    /**
     * Metodo para realizar el login
     * @param {string} username
     * @param {string} password
     */
    login(username: string, password: string): Promise<any[]> {
        return new Promise(() => {

            this._createRequest(username, password)
                .subscribe(
                    (info: ResponseLogin) => {
                        info = new ResponseLogin(info);
                                 
                        if (info.token != null){
                            let expirar = new Date();

                            expirar.setHours(expirar.getHours() + 16);
                            // expirar.setMinutes(expirar.getMinutes() + 2);

                            this._cookieService.set(token, info.token, expirar);

                            this._obtenerLegajo(info.token)
                                .subscribe(
                                    (res) => {

                                        this._obtenerPerfilLog(res, info.token)
                                            .subscribe(
                                                (perf) => {
                                                    perf = new Perfil(perf);
                                                    this.perfilLog = perf;

                                                    this._cookieService.set(user, JSON.stringify(perf), expirar);
                                                    
                                                    this.infoOnChanged.next(this.info);
                                                    this.perfilLogOnChanged.next(this.perfilLog);

                                                    this._router.navigate(['/perfil']);  

                                                },
                                                (err) => {
                                                    this._defineError();
                                                }
                                            );
                                    },
                                    (err) => {
                                        this._defineError();
                                    }
                                );
                                                        
                        }else{
                            this._defineError();
                        }   
                                               
                    }, 
                    (err) => {                                
                        this._defineError();
                    }
                );
        });
    }
    
    private _defineError(): void {
        this.info = 'error';
        this.perfilLog = new Perfil({});
        this.infoOnChanged.next(this.info);
        this.perfilLogOnChanged.next(this.perfilLog);
    }


    /**
     * Crea el llamado al servicio back de login
     * @param {string} username
     * @param {string} password
     */
    private _createRequest(username: string, password: string): Observable<any> | any {
        // Mock
        // const respuesta = new Observable((observer) => {      
        //     observer.next({'legajo': 'FN0051', 'tokenAuth' : 'MyPrettyToken'});
        //     observer.complete();
        // });
        // return respuesta;

        const httpHeaders = new HttpHeaders({
            'Content-Type': 'application/json'            
        });

        const options = { headers: httpHeaders };

        const params = {
            'username': username,
            'password': password
        };

        return this._httpClient.post(API_LOG, params, options);

    }

    private _obtenerLegajo(t: string): Observable<any> | any {
        const httpHeaders = new HttpHeaders({
            'Authorization': t
        });
        
        const url = API + 'legajo';

        return this._httpClient.get(url, {
            headers: httpHeaders,
            responseType: 'text'
        });
    }

    private _obtenerPerfilLog(legajo: string, t: string): Observable<any> | any {
        const httpHeaders = new HttpHeaders({
            'Content-Type' : 'application/json',
            'Authorization': t
        });

        const options = { headers: httpHeaders };
        
        const url = API + 'colaborador?legajo=' + legajo;

        return this._httpClient.get(url, options);
    }



    /**
    * Devuelve el usuario que esta logueado, en caso de que no pueda redirige al login
    * @return {string} perfil.legajo
    */
    getLocalUser(): string {
        if (!(this.isSetLog())){            
            return '';
        }

        const perfil = new Perfil(JSON.parse(
                                    this._cookieService.get(user)
                                ));

        return perfil.legajo; 
    }

    /**
    * Devuelve el token que esta guardado en cache, en caso de que no pueda redirige al login
    * @return {string} Token
    */
    getLocalToken(): string {
        if (!(this.isSetLog())) {
            return '';
        }

        return this._cookieService.get(token);
    }

    /**
    * Determina si los datos de log estan disponibles
    */
    isSetLog(): boolean {
        const userLog = this._cookieService.get(user);
        const tokenLog = this._cookieService.get(token);

        if ((userLog) && (tokenLog)){
            return true;
        }else{
            this.logout();
            return false;
        }
        
    }

}


export class ResponseLogin {
    username: string;        
    token: string;

    // colaborador: Perfil;

    /**
    * Constructor
    * @param responseLogin
    */
    constructor( responseLogin ){
        this.token = responseLogin.token || null;
        // this.colaborador = responseLogin.colaborador ? new Perfil(responseLogin.colaborador) : null;
        this.username = responseLogin.username || null;
    }
}
