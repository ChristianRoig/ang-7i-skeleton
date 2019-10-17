import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Router } from '@angular/router';

// Este servicio solo se define en el módulo de la aplicación.
// @NgModule({
//   providers: [
//     ErrorService,
//     ...
//     ],
//   ...
// })

// Para configurar el mensaje de error, simplemente inyecte el servicio y envie los parametros necesarios
// constructor(private _errorService: ErrorService) {}

// ...seccion de error 
// this.errorService.errorHandler(error, 'Custom error message', 'error_code');
// ...

const errorDefault = 404;
const mensajeDefault = 'Lo sentimos, no podemos encontrar la página que estás buscando.';

const errorIncompatible = 0;
const navIncompatible = 'Lo sentimos, este navegador no es compatible con el sistema, debe acceder con Firefox o Chrome.';

@Injectable({
  providedIn: 'root'
})
export class ErrorService {

  updateMessageSubject: BehaviorSubject<string>;
  updateErrorCodeSubject: BehaviorSubject<number>;

  Message: string;
  ErrorCode: number;

  /**
   * Constructor
   *
   * @param {Router} _router
   */
  constructor(private _router: Router) {
    // Set the defaults
    this.updateMessageSubject = new BehaviorSubject<string>('');
    this.updateErrorCodeSubject = new BehaviorSubject<number>(0);

    this.updateMessageSubject.next(mensajeDefault);
    this.updateErrorCodeSubject.next(errorDefault);

    if (!this.isBrowserCompatible()){
      this.updateMessageSubject.next(navIncompatible);
      this.updateErrorCodeSubject.next(errorIncompatible);    
    }

  }


  /**
   * errorHandler
   *
   * Metodo principal, redirecciona al sitio de error
   *
   * @param error
   * @param {string} message
   * @param {number} error_code
   */
  errorHandler(error?: any, message?: string, error_code?: number): void {    
    this.errorHandlerPrint(error);

    this._updateErrorService(error, message, error_code);

    this._router.navigate(['/error']); 
  }


  /**
   * updateErrorService
   * 
   * Setea en el servicio el mensaje y el codigo de error
   *
   * @param error
   * @param {string} message
   * @param {number} error_code
   */
  private _updateErrorService(error?, message?: string, error_code?: number): void{
    if (message === '' || message === ' ' || message === null || message === undefined){
      message = mensajeDefault;
    }

    this.updateMessageSubject.next(message);
    
    if (!(error_code)){
    
      if (!(error === undefined || error === null)){
        
        if (!(error.error instanceof ErrorEvent)) {          
          error_code = error.status;
        }  

      }else{
        error_code = errorDefault; // 404
      }

    }

    this.updateErrorCodeSubject.next(error_code);

  }

  /**
   * errorHandler
   *
   * Se encarga de mostrar el error por consola y dejar una mejor visual
   *
   * @param error
   * 
   */
  errorHandlerPrint(error): void {
    if (error !== undefined){
      let errorMessage = '';
      if (error.error instanceof ErrorEvent) {
        errorMessage = error.error.message;
      } else {
        errorMessage = `-Error Code: ${error.status}\n-Message: ${error.message}`;
      }
      console.log(errorMessage);    
    }
  }

  /**
   * isBrowserCompatible
   * 
   * Determina si el navegador es considerado compatible o no
   *
   */
  isBrowserCompatible(): boolean {
    let browser = this._browserDetect();
    // console.log(browser);
    // console.log(browser.toLowerCase());
    // console.log(browser.toLowerCase().indexOf('ie'));
    // console.log(browser.toLowerCase().indexOf('edge'));


    if ((browser.toLowerCase().indexOf('ie') > -1) || (browser.toLowerCase().indexOf('edge') > -1)) {
      console.log('navegador no compatible');
      
      return false;
    }

    return true;
  }



  /**
   * browserDetect
   * 
   * Se encarga de determinar el navegador que se esta utilizando.
   * 
   */
  private _browserDetect(): string {
    let ua = navigator.userAgent, tem,
      M = ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];

    if (/trident/i.test(M[1])) {
      tem = /\brv[ :]+(\d+)/g.exec(ua) || [];
      return 'IE ' + (tem[1] || '');
    }

    if (M[1] === 'Chrome') {
      tem = ua.match(/\b(OPR|Edge)\/(\d+)/);
      if (tem != null) { 
        return tem.slice(1).join(' ').replace('OPR', 'Opera');
      }
    }

    M = M[2] ? [M[1], M[2]] : [navigator.appName, navigator.appVersion, '-?'];

    if ((tem = ua.match(/version\/(\d+)/i)) != null){
      M.splice(1, 1, tem[1]);
    }

    return M.join(' ');
  }
}
