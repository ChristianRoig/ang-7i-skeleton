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

    private rol: string[] = [];

    infoOnChanged: BehaviorSubject<any>;
    perfilLogOnChanged: BehaviorSubject<any>;
    rolOnChanged: BehaviorSubject<any>;

    /**
     * Constructor
     *
     * @param {HttpClient} _httpClient
     * @param {CookieService} _cookieService
     * @param {Router} _router
     */
    constructor( private _router: Router, private _httpClient: HttpClient, private _cookieService: CookieService, private _fuseNavigationService: FuseNavigationService) {
        // Set the defaults

        this.infoOnChanged = new BehaviorSubject([]);
        this.perfilLogOnChanged = new BehaviorSubject([]);
        this.rolOnChanged = new BehaviorSubject([]);

        this.init();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    init(): void {

        // para mostrar o ocultar un componente del navbar
        // this._fuseNavigationService.updateNavigationItem('sector', {
        //     hidden: true
        // });  

        const userLog = this._cookieService.get(user);        

        if (userLog){
            this.perfilLog = new Perfil(JSON.parse(userLog));            
        }else{
            this.perfilLog = new Perfil({});        
        }

        this.rolOnChanged.next([]);
        this.perfilLogOnChanged.next(this.perfilLog);
    }

    /**
     * Metodo para cerra la sesion
     */
    logout(): void{
        this.infoOnChanged.next(new ResponseLogin({}));
        this.perfilLogOnChanged.next(new Perfil({}));
        this.rolOnChanged.next([]);    

        this._cookieService.deleteAll();
    }
    
    /**
     * Metodo para realizar el login
     * @param {string} username
     * @param {string} password
     */
    login(username: string, password: string): Promise<any[]> {
        this.logout();

        return new Promise(() => {
            this._obtenerLogin(username, password)
                .subscribe(
                    (info: ResponseLogin) => {
                        info = new ResponseLogin(info);                                 
                        
                        if (info.token != null){

                            this._obtenerLegajo(info.token)
                                .subscribe(
                                    (legajo) => {
                                        this._obtenerPerfilLog(legajo, info.token)
                                            .subscribe(
                                                (perf) => {

                                                    if (perf == null){                                                        
                                                        this._defineError();                                     
                                                    }else{
                                                        
                                                        this._obtenerRoles(info.token)
                                                            .subscribe(
                                                                (roles: any) => {
                                                                    if (roles == null) {
                                                                        roles = [];
                                                                    }                                        
                                                                    this._trabajoLogueo(info, perf, roles);                                                                    
                                                                },
                                                                (err: any) => {
                                                                    console.log(err);
                                                                    this._defineError();
                                                                });
                                                    }
                                                    
                                                },
                                                (err) => {
                                                    console.log(err);
                                                    this._defineError();
                                                }
                                            );
                                    },
                                    (err) => {
                                        console.log(err);
                                        this._defineError();
                                    }
                                );
                                                        
                        }else{
                            console.log('token invalido');
                            this._defineError();
                        }   
                                               
                    }, 
                    (err) => {
                        console.log(err);
                        this._defineError();
                    }
                );
        });
    }
    
    /**
      * Devuelve el usuario que esta logueado, en caso de que no pueda redirige al login
      * @return {string} perfil.legajo
      */
    getLocalUser(): string {
        if (!(this.isSetLog())) {
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

        if ((userLog) && (tokenLog)) {                      
            return true;
        } else {
            this.logout();
            return false;
        }
    }

    /**
     * retorna el/los roles que tiene el usuario
     */
    getRol(): any {    
        const httpHeaders = new HttpHeaders({
            'Authorization': this.getLocalToken()
        });

        const url = API + 'getRoles';

        if (this.rol.length > 0){
            return new Promise((resolve, reject) => {
                resolve(this.rol);
            });
        }else{            
            return this._httpClient.get(url, {
                headers: httpHeaders,
            }).toPromise();
        }
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Private methods
    // -----------------------------------------------------------------------------------------------------

    private _trabajoLogueo(info: ResponseLogin, perf: Perfil, roles: []): void{
        let expirar = new Date();
        expirar.setHours(expirar.getHours() + 16);
        
        this.rol = roles;
        this.info = info;
        this.perfilLog = new Perfil(perf);
                
        this._cookieService.set(token, info.token, expirar);
        this._cookieService.set(user, JSON.stringify(perf), expirar);

        this.rolOnChanged.next(this.rol);
        this.infoOnChanged.next(this.info);
        this.perfilLogOnChanged.next(this.perfilLog);

        this._router.navigate(['/legajo']);
    }

    /**
     * Setea el / los roles del usuario mediante el token
     * @param _token 
     */
    private _obtenerRoles(_token: string): Observable<any> | any {

        if (!(_token)) {
            console.log('token invalido');
            const respuesta = new Observable((observer) => {      
                observer.next([]);
                observer.complete();
            });
        
            return respuesta;
        }

        const httpHeaders = new HttpHeaders({
            'Authorization': _token
        });

        const url = API + 'getRoles';

        return this._httpClient.get(url, {
            headers: httpHeaders,            
        });      
      
    }

    /**
     * setea en caso de error
     */
    private _defineError(): void {
        this.rol = [];
        this.info = 'error';
        this.perfilLog = new Perfil({});

        this.rolOnChanged.next(this.rol);
        this.infoOnChanged.next(this.info);
        this.perfilLogOnChanged.next(this.perfilLog);
    }


    /**
     * Crea el llamado al servicio back de login
     * @param {string} username
     * @param {string} password
     */
    private _obtenerLogin(username: string, password: string): Observable<any> | any {
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

    /**
     * obtiene el legajo de la persona que se logueo
     * @param {string} _token 
     */
    private _obtenerLegajo(_token: string): Observable<any> | any {
        const httpHeaders = new HttpHeaders({
            'Authorization': _token
        });
        
        const url = API + 'legajo';

        return this._httpClient.get(url, {
            headers: httpHeaders,
            responseType: 'text'
        });
    }

    /**
     * obtiene el perfil de la persona que se logueo
     * @param {string} legajo 
     * @param {string} _token 
     */
    private _obtenerPerfilLog(legajo: string, _token: string): Observable<any> | any {
        const httpHeaders = new HttpHeaders({
            'Content-Type' : 'application/json',
            'Authorization': _token
        });

        const options = { headers: httpHeaders };
        
        const url = API + 'colaborador?legajo=' + legajo;

        return this._httpClient.get(url, options);
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
        this.username = responseLogin.username || null;
    }
}
