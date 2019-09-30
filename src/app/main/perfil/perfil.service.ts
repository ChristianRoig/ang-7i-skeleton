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
        this.info = new Contact({});

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
            this._createRequestGetPerfil()
                .subscribe((info: any) => {                    
                    this.info = new Contact(info);                                    
                    this.infoOnChanged.next(this.info);
                    resolve(this.info);
                }, reject);
        });
    }

    private _createRequestGetPerfil(): any {
        let token = this.cookieService.get('tokenAuth');
        
        // Fix, codigo para evitar la consulta a la api sin el token
        if (token === '' || token === null || token === undefined){            
            const respuesta = new Observable((observer) => {
                observer.next(
                    new Contact({})
                );
                observer.complete();
            });
                                    
            return respuesta;
        }
        // Fix
        
        let headers = new HttpHeaders();
        headers = headers.set('Authorization' , token);
        return this._httpClient.get(API_URL + 'perfil', { headers : headers });
    }
}
