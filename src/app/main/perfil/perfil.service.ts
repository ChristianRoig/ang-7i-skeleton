import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { ErrorService } from '../errors/error.service';
import { LoginService } from '../authentication/login-2/login-2.service';
import { Perfil } from './perfil.model';
import { CookieService } from 'ngx-cookie-service';

@Injectable()
export class PerfilService implements Resolve<any>
{
    info: Perfil;
    infoLog: Perfil; 

    infoOnChangedLog: BehaviorSubject<any>;
    infoOnChanged: BehaviorSubject<any>;

    /**
     * Constructor
     *
     * @param {HttpClient} _httpClient
     * @param { ErrorService } _errorService
     */
    constructor(
        private _httpClient: HttpClient,
        private _errorService: ErrorService,
        private _loginService: LoginService,
    )
    {
        // Set the defaults
        this.infoOnChanged = new BehaviorSubject({});
        this.infoOnChangedLog = new BehaviorSubject({});


    }

    init(): void{
        const leg = this._loginService.getLocalUser();

        if (leg){
            this.getInfo(null);
        }else{
            this.info = new Perfil({});
            this.infoLog = new Perfil({});

            this.infoOnChanged.next(this.info);
            this.infoOnChangedLog.next(this.infoLog);
        }        
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
                this.getInfo(route.params.id),                
            ]).then(
                () => {
                    resolve();
                },
                (error) => {
                    this.info = new Perfil({});
                    this.infoOnChanged.next(this.info);

                    this._errorService.errorHandler(error, "No se encontro la página para el perfil de " + route.params.id);

                    resolve(this.info);  
                }
            );
        });
    }

    /**
     * Get info
     */
    getInfo(id): Promise<any[]>
    {
        // console.log("id del getInfo "+id);
        return new Promise((resolve, reject) => {
            // console.log(this.getLocalStorage());            
            this.llamadoHTTP(resolve, reject, id);       
        });
    }

    private llamadoHTTP(resolve, reject, user): void {
        let local = false;
        
        if (!user){
            user = 'api/perfil-' + this.getUserLog(); 
            local = true;
        }else{
            user = 'api/perfil-' + user;
            local = false;
        }

        if (user == 'api/perfil-null' || user == 'api/perfil-') {
            const respuesta = new Observable((observer) => {

                // observable execution
                observer.next(
                    new Perfil({})
                );
                observer.complete();
            });

            respuesta.subscribe(
                (info: Perfil) => {
                    this.info = info;
                    this.infoOnChanged.next(this.info);
                    this.infoOnChangedLog.next(this.info);
                   
                    resolve(this.info);
                    resolve(this.info);

                }, reject);

        }else {
            this._httpClient.get(user)
                .subscribe((info: any) => {
                    if (local) {
                        this.info = info;
                        this.infoOnChanged.next(this.info);
                        this.infoLog = info;
                        this.infoOnChangedLog.next(this.infoLog);
                        resolve(this.infoLog);
                        resolve(this.info);
                    } else {
                        this.info = info;
                        this.infoOnChanged.next(this.info);
                        resolve(this.info);
                    }
                }, reject);
        }
  
    }

    getUserLog(): string{
        return this._loginService.getLocalUser();
    }

}
