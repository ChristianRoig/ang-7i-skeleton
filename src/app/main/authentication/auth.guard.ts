import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { LoginService } from './login-2/login-2.service';
import { ErrorService } from '../errors/error.service';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router, CanActivateChild } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanActivateChild {

  constructor( private _loginService: LoginService, private _errorService: ErrorService, private _router: Router){}

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {  
    if (this._loginService.isSetLog()) {
      return new Promise((resolve, reject) => {
        this._loginService.getRol().then((userRol: any) => {
          this._loginService.rolOnChanged.next(userRol);
          resolve(this._youPassOrNot(next, userRol));
        });
      });      
    }

    this._router.navigate(['/auth/login']);

    return false;

  }

  canActivateChild(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.canActivate(next, state);
  }

  private _youPassOrNot(next: ActivatedRouteSnapshot, userRol: string[]): boolean{
      let roles = next.data['roles'] as Array<string>;

      if (!(this._roleMatch(roles, userRol))) {
        let componente = '';

        next.url.forEach(element => {
          componente = componente + '/' + element;
        });

        this._errorService.errorHandler('forbidden', 'Usted NO tiene permitido entrar ' + componente, 403);
        return false;
      }

      return true;
  }

  private _roleMatch(Roles: string[], userRol: string[]): boolean {
    let isMatch = false;    

    if (Roles == null){
      return true;
    }

    Roles.forEach( element => {
      if (userRol.indexOf(element) > -1){
        isMatch = true;
      }
    });

    return isMatch;
  }
  
}
