import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot, Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import { environment } from 'environments/environment';
import { Perfil } from 'app/mock-db/data/perfil';



// const API_URL: string = environment.API;

@Injectable()
export class LoginService implements Resolve<any>
{

    info: any;
    perfil: Perfil;

    infoOnChanged: BehaviorSubject<any>;
    PerfilLogOnChanged: BehaviorSubject<any>;


    /**
     * Constructor
     *
     * @param {HttpClient} _httpClient
     */
    constructor(
        private http: HttpClient,
        private cookieService: CookieService,
        private _router: Router,        
    ) {
        // Set the defaults
        this.infoOnChanged = new BehaviorSubject({});
        this.PerfilLogOnChanged = new BehaviorSubject({});
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
                .subscribe((info: any) => {
                    this.info = info;

                    if (info != null) { //se logueo 
                        this.cookieService.set('tokenAuth', info.tokenAuth);
                        this.cookieService.set('user', info.legajo);

                        this._router.navigate(['/perfil']);
                    }

                    this.infoOnChanged.next(this.info);

                    resolve(this.info);
                }, reject);

        });
    }

    createRequest(username: string, password: string): Observable<any> | any {

        // mock
        username = "admin";
        password = "admin";        

        // // let url = API_URL + 'loginPymex'
        // let headers = new HttpHeaders();
        // headers.append('Content-Type', 'application/json');
        // let requestLogin = {
        //     "username": username,
        //     "password": password
        // };

        const respuesta = new Observable((observer) => {      
            observer.next({'legajo': 'FC0356', 'tokenAuth' : 'MyPrettyToken'});
            observer.complete();
        });


        return respuesta;
        // return this.http.post(url, requestLogin, { headers });


    }

    getLocalUser(): string {
        const user = this.cookieService.get('user');

        if (!(user)){
            this._router.navigate(['/auth/login-2']);
        }

        return user;
    }

}
