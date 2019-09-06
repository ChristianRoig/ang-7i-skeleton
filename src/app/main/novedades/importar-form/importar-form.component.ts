import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { NovedadService } from '../novedad.service';


@Component({
    selector     : 'importar-form-dialog',
    templateUrl  : './importar-form.component.html',
    styleUrls    : ['./importar-form.component.scss'],
    encapsulation: ViewEncapsulation.None,
   
}) 
export class ImportarFormDialogComponent
{   
    // action: string;
    ImportarForm: FormGroup;
    dialogTitle: string;

    private periodo = '';
    private origen = '';

    respuesta = '';
    /**
     * Constructor
     *
     * @param {MatDialogRef<ImportarFormDialogComponent>} matDialogRef
     * @param _data
     * @param {FormBuilder} _formBuilder
     */
    constructor(
        public matDialogRef: MatDialogRef<ImportarFormDialogComponent>,
        @Inject(MAT_DIALOG_DATA) private _data: any,
        private _formBuilder: FormBuilder,
        private _novedadService: NovedadService
    )
    {       
        this.dialogTitle = 'Importar Novedades Externas';
        this.periodo = _data.periodo || '';
        this.origen = _data.origen || '';

        this.ImportarForm = this.createImportarForm();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Create contact form
     *
     * @returns {FormGroup}
     */
    createImportarForm(): FormGroup
    {
        return this._formBuilder.group({
            texto : '',            
        });
    }

    uploadFile(event): void {
        const fileList: FileList = event.target.files;

        if (fileList.length > 0) {
            const fileReader = new FileReader();
        
            fileReader.onload = (e) => {          
                const data = fileReader.result.toString();                
                this.ImportarForm.controls['texto'].setValue(data);
            };

            fileReader.readAsText(fileList[0]);
        
            // fileReader.readAsDataURL(fileList[0]);
        }
    }

    onSubmit(): void {
        // console.log(this.ImportarForm);
        // console.log(this.ImportarForm.controls['texto'].value);

        // this.respuesta = 'Novedades importadas: 112 de 114. Errores: 2. Chekcsum = 14.253,15'; // Mock
        this.respuesta = this._novedadService.importar(
            this.origen,
            this.periodo,
            this.ImportarForm.controls['texto'].value
        );

        // this.matDialogRef.close();
    }
    
}
