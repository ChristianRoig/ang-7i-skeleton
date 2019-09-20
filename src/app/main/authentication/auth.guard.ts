import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router, CanActivateChild } from '@angular/router';
import { Observable } from 'rxjs';
import { LoginService } from './login-2/login-2.service';
import { ErrorService } from '../errors/error.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanActivateChild {

  constructor(  private _loginService: LoginService,
                private _errorService: ErrorService,
                private _router: Router){}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
  
    if (this._loginService.isSetLog()){


      //////////////////////////////////////////////////////////////////////////////////////////////////////////
      // Comentar para no validar el ROL
      //////////////////////////////////////////////////////////////////////////////////////////////////////////

      let roles = next.data['roles'] as Array<string>;

      if (!(this._roleMatch(roles))) {
        let componente = '';

        next.url.forEach(element => {
          componente = componente + '/' + element;
        });

        this._errorService.errorHandler('forbidden', 'Usted NO tiene permitido entrar ' + componente, 403);
        return false;
      }

      //////////////////////////////////////////////////////////////////////////////////////////////////////////

      return true;

    }
    
    this._router.navigate(['/auth/login-2']);      
    
    return false;

  }

  canActivateChild(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    return this.canActivate(next, state);

  }

  private _roleMatch(Roles: string[]): boolean {
    let isMatch = false;
    let userRol = this._loginService.getRol();

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
