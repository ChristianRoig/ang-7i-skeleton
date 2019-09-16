import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { NovedadService } from '../novedad.service';


@Component({
    selector     : 'exportar-txt',
    templateUrl  : './exportar-txt.component.html',
    styleUrls    : ['./exportar-txt.component.scss'],
    encapsulation: ViewEncapsulation.None,
   
}) 
export class ExportarTXTComponent
{   
     
    dialogTitle: string;

    txt = 'petuto';

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
        private _formBuilder: FormBuilder,
        private _novedadService: NovedadService
    )
    {       
        this.dialogTitle = 'Exportar TXT';     
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

   
    saveFile(): void {
        // const aux = JSON.stringify(this.rank, null, '\t');
        let aux = JSON.stringify(this.txt);
        this.writeContents(this.txt, 'novedades' + '.txt', 'text/plain');
    }

    private writeContents(content, fileName, contentType): void {
        let a = document.createElement('a');
        let file = new Blob([content], { type: contentType });
        a.href = URL.createObjectURL(file);
        a.download = fileName;
        a.click();
    }
}
