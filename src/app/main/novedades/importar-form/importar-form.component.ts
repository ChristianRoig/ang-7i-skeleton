import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

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

    /**
     * Constructor
     *
     * @param {MatDialogRef<ImportarFormDialogComponent>} matDialogRef
     * @param _data
     * @param {FormBuilder} _formBuilder
     */
    constructor(
        public matDialogRef: MatDialogRef<ImportarFormDialogComponent>,
        // @Inject(MAT_DIALOG_DATA) private _data: any,
        private _formBuilder: FormBuilder
    )
    {
        // Set the defaults
        // this.action = _data.action;

        this.dialogTitle = 'Importar Novedades Externas';
        // this.contact = _data.contact;

        // if ( this.action === 'edit' )
        // {
        //     this.dialogTitle = 'Editar Novedad';
        //     this.contact = _data.contact;
        // }
        // else
        // {
        //     this.dialogTitle = 'Nueva Novedad';
        //     this.contact = _data.contact || new Contact({});
            
        // }

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
                // console.log(data);
                this.ImportarForm.controls['texto'].setValue(data);
            }

            fileReader.readAsText(fileList[0]);
        
            // fileReader.readAsDataURL(fileList[0]);
        }
    }

    onSubmit(): void {
        console.log(this.ImportarForm);
        this.matDialogRef.close();
    }
}
