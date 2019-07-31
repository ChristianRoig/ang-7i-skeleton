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


}
