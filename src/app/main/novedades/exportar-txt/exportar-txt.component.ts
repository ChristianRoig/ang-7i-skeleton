import { Component, Inject, ViewEncapsulation, OnInit, OnDestroy } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { NovedadService } from '../novedad.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import * as FileSaver from 'file-saver';

////////////////////////////////////////////
// Instalar 
// npm install file-saver --save
// npm install @types/file-saver --save
////////////////////////////////////////////


@Component({
    selector     : 'exportar-txt',
    templateUrl  : './exportar-txt.component.html',
    styleUrls    : ['./exportar-txt.component.scss'],
    encapsulation: ViewEncapsulation.None,
   
}) 
export class ExportarTXTComponent implements OnInit, OnDestroy
{
    
    dialogTitle: string;

    txt = '';

    private empresa: string = '-';
    private periodo: string = '';

    private _unsubscribeAll: Subject<any>;

    /**
     * Constructor
     *
     * @param {MatDialogRef<ExportarTXTComponent>} matDialogRef
     * @param _data
     * @param {FormBuilder} _formBuilder
     */
    constructor(
        public matDialogRef: MatDialogRef<ExportarTXTComponent>,
        @Inject(MAT_DIALOG_DATA) private _data: any,
        private _novedadService: NovedadService
    )
    {       
        this.dialogTitle = 'Exportar TXT';

        this.empresa = _data.empresa || '-';

        this.periodo = _data.periodo || '';
       
        this._unsubscribeAll = new Subject();

    }

    /**
     * On init
     */
    ngOnInit(): void {
        this._novedadService.onExportTXTChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(data => {
                this.txt = data || '';
            });

        this._novedadService.exportarTXT(this.empresa , this.periodo);
    }   

    /**
     * On destroy
     */
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    saveFile(): void {
        let blob = new Blob([this.txt], { type: 'text/plain;charset=utf-8', endings: 'native' });
        let auxP;

        if (this.periodo !== ''){
            auxP = this.periodo.split('-');
            if (auxP.length > 1){
                auxP = auxP[1] + '-' + auxP[0];
            }
        }else{
            auxP = '';
        }

        let nombre = 'GesRH-Tango-' + auxP + '-' + this.empresa + '.txt';

        FileSaver.saveAs(blob, nombre);

    }

}
