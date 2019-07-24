import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot, Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import { environment } from 'environments/environment';
import { Perfil } from 'app/mock-db/data/perfil';



const API_URL: string = environment.API;
const token: string = environment.Cookie_Token;
const user: string = environment.Cookie_User;

@Injectable()
export class LoginService implements Resolve<any>
{
    private info: any;
    

    
    infoOnChanged: BehaviorSubject<any>;
    

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
    ) {
        // Set the defaults
        this.infoOnChanged = new BehaviorSubject({});
        
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
     * Get info
     */
    login(username: string, password: string): Promise<any[]> {
        return new Promise((resolve, reject) => {

            this.createRequest(username, password)
                .subscribe(
                    (info: ResponseLogin) => {
                                                
                        if (info.token != null && info.colaborador != null) { //se logueo 
                            this.info = info;

                            this._cookieService.set(token, info.token);
                            this._cookieService.set(user, info.colaborador.legajo);

                            this._router.navigate(['/perfil']);                                                    
                        }else {
                            this.info = null;
                        }

                        this.infoOnChanged.next(this.info);
    
                        resolve(this.info);
                    }, 
                    (err) => {
        
                        this.info = 'error';
                        this.infoOnChanged.next(this.info);                        
                        // console.log(err);
                        
                    }
                );

        });
    }

    createRequest(username: string, password: string): Observable<any> | any {
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

    getLocalUser(): string {
        const userLog = this._cookieService.get(user);

        if (!(userLog)){ this._router.navigate(['/auth/login-2']); }

        return userLog;
    }

}


export class ResponseLogin {
    token: string;
    colaborador: any; //cambiar por perfil a su debido tiempo

    /**
    * Constructor
    * @param responseLogin
    */
    constructor( responseLogin: any ){
        this.token = responseLogin.token || null;
        this.colaborador = responseLogin.responseLogin || null;
    }
}
