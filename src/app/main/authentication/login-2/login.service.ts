import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot, Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import { environment } from 'environments/environment';

const API_URL : string = environment.API;

@Injectable()
export class LoginService implements Resolve<any>
{

    info: any;

    infoOnChanged: BehaviorSubject<any>;
    username : string = '';
    token: string = '';

    /**
     * Constructor
     *
     * @param {HttpClient} _httpClient
     */
    constructor(
        private http: HttpClient,
        private cookieService: CookieService,
        private _router : Router
    )
    {
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
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any
    {
        return new Promise((resolve, reject) => {
            Promise.all([
                
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
    login(username:string, password: string): Promise<any[]>
    {
        return new Promise((resolve, reject) => {

            this.createRequest(username, password)
                .subscribe((info: any) => {
                    this.info = info;
                    if(info != null) { //se logueo 
                        this.token = info.token;
                        this.username = info.username;
                        this.cookieService.set('tokenAuth', this.token);
                        this._router.navigate(['/gastos']);
                    }
                    this.infoOnChanged.next(this.info);
                }, reject);

        });
    }

    createRequest(username: string, password: string) : Observable<any> | any {
        let url = API_URL + 'login'                
        let headers = new HttpHeaders();
        headers = headers.set('Content-Type', 'application/json' );
        let requestLogin = {    
                                "username":username,
                                "password":password
                            };
        
        return this.http.post(url, requestLogin, {headers});
    }
}