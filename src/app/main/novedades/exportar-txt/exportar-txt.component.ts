import { Component, Inject, ViewEncapsulation, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { NovedadService } from '../novedad.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';


@Component({
    selector     : 'exportar-txt',
    templateUrl  : './exportar-txt.component.html',
    styleUrls    : ['./exportar-txt.component.scss'],
    encapsulation: ViewEncapsulation.None,
   
}) 
export class ExportarTXTComponent implements OnInit
{
    
    dialogTitle: string;

    txt = '';

    private empresa: string = '-';

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
        
        this._unsubscribeAll = new Subject();

    }

    ngOnInit(): void {
        this._novedadService.onExportTXTChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(data => {
                this.txt = data || '';
            });

        this._novedadService.exportarTXT();
    }   

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    saveFile(): void {
        console.log('salvar');
    }

   
    // No funciona en firefox
    // saveFile(): void {
    //     // const aux = JSON.stringify(this.rank, null, '\t');
    //     let aux = JSON.stringify(this.txt);
    //     this.writeContents(this.txt, 'novedades' + '.txt', 'text/plain');
    // }

    // private writeContents(content, fileName, contentType): void {
    //     let a = document.createElement('a');
    //     let file = new Blob([content], { type: contentType });
    //     a.href = URL.createObjectURL(file);
    //     a.download = fileName;
    //     a.click();
    // }
}
