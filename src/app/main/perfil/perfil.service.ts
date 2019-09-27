import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'environments/environment';
import { CookieService } from 'ngx-cookie-service';
import { Contact } from '../contacts/contact.model';

const API_URL = environment.API;


@Injectable()
export class PerfilService implements Resolve<any>
{
    info: any;

    public infoOnChanged: BehaviorSubject<any>;

    /**
     * Constructor
     *
     * @param {HttpClient} _httpClient
     */
    constructor(
        private cookieService: CookieService,
        private _httpClient: HttpClient
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
                this.getInfo(),
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
    getInfo(): Promise<any[]>
    {
        return new Promise((resolve, reject) => {

            this.createRequestGetPerfil()
                .subscribe((info: any) => {                    
                    this.info = new Contact(info);                                    
                    this.infoOnChanged.next(this.info);
                    resolve(this.info);
                }, reject);
        });
    }

    createRequestGetPerfil(): any {
        let headers = new HttpHeaders();
        headers = headers.set('Authorization' , this.cookieService.get('tokenAuth'));
        return this._httpClient.get(API_URL + 'perfil', { headers : headers });
    }
}
