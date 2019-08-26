import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Observable } from 'rxjs';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { LoginService } from '../../authentication/login-2/login-2.service';

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
        private _loginService: LoginService,
        private _httpClient: HttpClient,
    )
    {
        // Set the defaults
        // this.action = _data.action;

        this.dialogTitle = 'Importar Novedades Externas';

        this.periodo = _data.periodo || '';
        this.origen = _data.origen || '';


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
            };

            fileReader.readAsText(fileList[0]);
        
            // fileReader.readAsDataURL(fileList[0]);
        }
    }

    onSubmit(): void {
        console.log(this.ImportarForm);

        console.log(this.ImportarForm.controls['texto'].value);
        
        this._createRequest()
            .subscribe((response: any) => {
                console.log(response);
                this.respuesta = response;
        });


        // this.matDialogRef.close();
    }

    private _createRequest(): Observable<any> | any {
        const httpHeaders = new HttpHeaders({
            'Authorization': this._loginService.getLocalToken()
        });

        const options = {
            headers: httpHeaders,
            responseType: 'text' as 'text'
        };
        
        const params = {
            // 'origen': this.origen,
            // 'periodo': this.periodo,
            'contenido': this.ImportarForm.controls['texto'].value,
        };
        
        const url = 'http://10.100.58.83:8083/ges-rrhh-svc/test';

        return this._httpClient.post(url, params, options);
    }
    
}
