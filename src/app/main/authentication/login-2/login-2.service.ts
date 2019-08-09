import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot, Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import { environment } from 'environments/environment';
import { Perfil } from 'app/main/perfil/perfil.model';
import { FuseNavigationService } from '../../../../@fuse/components/navigation/navigation.service';


const API_URL: string = environment.API;
const token: string = environment.Cookie_Token;
const user: string = environment.Cookie_User;

@Injectable()
export class LoginService implements Resolve<any>
{
    private info: any;
    private perfilLog: Perfil;
    private datos: any;

    infoOnChanged: BehaviorSubject<any>;

    // revisar si es mejor tener solo el info y consultar o especificar
    perfilLogOnChanged: BehaviorSubject<any>;
    datosOnChanged: BehaviorSubject<any>;

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
        this.datosOnChanged = new BehaviorSubject({});

        this.init();
    }

    init(): void {

        // para mostrar o ocultar un componente del navbar
        // this._fuseNavigationService.updateNavigationItem('sector', {
        //     hidden: true
        // });
    

        const userLog = this._cookieService.get(user);
        // const tokenLog = this._cookieService.get(token);
        // const datos = this._cookieService.get('datos');

        if (userLog){
            this.perfilLog = new Perfil(JSON.parse(userLog));            
        }else{
            this.perfilLog = new Perfil({});        
        }
        this.perfilLogOnChanged.next(this.perfilLog);  
    }

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
                // this.login()
            ]).then(
                () => {
                    resolve();
                },
                reject
            );
        });
    }

    /**
     * Metodo para realizar el login
     * @param {string} username
     * @param {string} password
     */
    login(username: string, password: string): Promise<any[]> {
        return new Promise((resolve, reject) => {

            this._createRequest(username, password)
                .subscribe(
                    (info: ResponseLogin) => {
                        info = new ResponseLogin(info);
                                                
                        // los datos van a venir en un futuro

                        if (info.token != null && info.colaborador != null) { // se logueo 
                            this.info = info;

                            this.perfilLog = info.colaborador;
                            this.datos = null; // Cuando traiga datos generales para las busquedas va ir aqui

                            let expirar = new Date();

                            expirar.setHours(expirar.getHours() + 16);
                            // expirar.setMinutes(expirar.getMinutes() + 2);

                            this._cookieService.set(token, info.token, expirar);   
                                                                               
                            this._cookieService.set(user, JSON.stringify(info.colaborador), expirar);

                            this._router.navigate(['/perfil']);                                                    
                        }else {
                            this.info = null;
                            this.perfilLog = null;
                            this.datos = null;
                        }

                        this.infoOnChanged.next(this.info);
                        this.perfilLogOnChanged.next(this.perfilLog);
                        this.datosOnChanged.next(this.datos);
    
                        resolve(this.info);
                    }, 
                    (err) => {
        
                        this.info = 'error';
                        this.infoOnChanged.next(this.info);                        
                        
                    }
                );

        });
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

        const url = API_URL + 'login';

        const params = {
            'username': username,
            'password': password
        };

        return this._httpClient.post(url, params, options);

    }

    /**
    * Devuelve el usuario que esta logueado, en caso de que no pueda redirige al login
    * @return {string} perfil.legajo
    */
    getLocalUser(): string {
        if (!(this.isSetLog())){
            // this._router.navigate(['/auth/login-2']);
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
            // this._router.navigate(['/auth/login-2']);
            return '';
        }

        const Token = this._cookieService.get(token);

        return Token;
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
            this._reset();
            return false;
        }
        
    }

    /**
    * Borra las cookies del sitio y resetea los datos
    */
    private _reset(): void {
        this.infoOnChanged = new BehaviorSubject({});
        this.perfilLogOnChanged = new BehaviorSubject({});
        this.datosOnChanged = new BehaviorSubject({});
        this._cookieService.deleteAll();
    }

}


export class ResponseLogin {
    token: string;
    colaborador: Perfil;

    /**
    * Constructor
    * @param responseLogin
    */
    constructor( responseLogin ){
        this.token = responseLogin.token || null;
        this.colaborador = responseLogin.colaborador ? new Perfil(responseLogin.colaborador) : null;
    }
}
