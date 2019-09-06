import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition, MatSnackBarRef } from '@angular/material/snack-bar';

/**
 * Definir en el Module
 */
// import { MatSnackBarModule } from '@angular/material';
// import { NotificacionSnackbarService } from '...?.../notificacion.snackbar.service';
// @NgModule({    
//     imports: [        
//         MatSnackBarModule
//     ],
//     providers: [
//         NotificacionSnackbarService,
//     ]
// })

/**
 * Definir CSS
 * Ejemplo .snackbar-notification .mat-simple-snackbar{ justify-content: center; }
 */

@Injectable()
export class NotificacionSnackbarService 
{
    private defaultH: MatSnackBarHorizontalPosition = 'right';
    private defaultV: MatSnackBarVerticalPosition = 'top';
    private defaultT = 1000; // Milisegundos

    private defaultOptHorizontal = ['start', 'center', 'end', 'left', 'right'];
    private defaultOptVertical = ['top', 'bottom'];

    private horizontalPosition: MatSnackBarHorizontalPosition;
    private verticalPosition: MatSnackBarVerticalPosition;
    private time: number; 

    constructor( private _snackBar: MatSnackBar ) {
        this.horizontalPosition = this.defaultH;
        this.verticalPosition = this.defaultV;
        this.time = this.defaultT;
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * openSnackBar()
     * Despliega una notificacion personalizada
     * 
     * @param {string} mensaje      
     * @param horizontalPosition (Opcional) {'' = default || 'start' || 'center' || 'end' || 'left' || 'right'}, default='right'
     * @param verticalPosition (Opcional) {'' = default || 'top' || 'bottom'}, default='top'
     * @param {number} time (Opcional) default: number = 1000
     */
    openSnackBar(mensaje: string, horizontalPosition?, verticalPosition?, time?: number): void {
        const horizontal: MatSnackBarHorizontalPosition = horizontalPosition;
        const vertical: MatSnackBarVerticalPosition = verticalPosition;

        this._defineHorizontal(horizontal);
        this._defineVertical(vertical);
        this._defineTime(time);

        this._runSnakbar(mensaje);
    }

 
    // -----------------------------------------------------------------------------------------------------
    // @ Private methods
    // -----------------------------------------------------------------------------------------------------

    private _runSnakbar(mensaje: string): void {      
        this._snackBar.open(mensaje, '', {
            duration: this.time,
            panelClass: ['snackbar-notification'],
            horizontalPosition: this.horizontalPosition,
            verticalPosition: this.verticalPosition,
        });
    }

    private _defineHorizontal(pos: MatSnackBarHorizontalPosition): void {
        if (pos && this._isValidOption(pos, 'H')){        
            this.horizontalPosition = pos;
        }else{
            this.horizontalPosition = this.defaultH;
        }
    }

    private _defineVertical(pos: MatSnackBarVerticalPosition): void {
        if (pos && this._isValidOption(pos, 'V')) {
            this.verticalPosition = pos;
        } else {
            this.verticalPosition = this.defaultV;
        }
    }

    private _isValidOption(opt, tipo: string): boolean {
        if (tipo === 'H'){
            if (this.defaultOptHorizontal.indexOf(opt) !== -1){
                return true;
            }
        }

        if (tipo === 'V'){
            if (this.defaultOptVertical.indexOf(opt) !== -1){
                return true;
            }
        }

        return false;
    }

    private _defineTime(t: number): void {
        if (t) {
            this.time = t;
        } else {
            this.time = this.defaultT;
        }
    }

}
