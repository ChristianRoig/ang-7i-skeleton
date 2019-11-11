import { Component, Inject, ViewEncapsulation, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { NovedadService } from '../novedad.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';


@Component({
    selector     : 'importar-form-dialog',
    templateUrl  : './importar-form.component.html',
    styleUrls    : ['./importar-form.component.scss'],
    encapsulation: ViewEncapsulation.None,
   
}) 
export class ImportarFormDialogComponent implements OnInit, OnDestroy
{   
    // action: string;
    ImportarForm: FormGroup;
    dialogTitle: string;

    private periodo = '';
    private origen = '';
    private _unsubscribeAll: Subject<any>;

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
        this._unsubscribeAll = new Subject();
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
        this._novedadService.importar(
            this.origen,
            this.periodo,
            this.ImportarForm.controls['texto'].value
        );

        // this.matDialogRef.close();
    }
    

    /**
     * On init
     */
    ngOnInit(): void {
        this._novedadService.onResultadoImportarChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(data => {
                this.respuesta = data;
            });
    }   

    /**
     * On destroy
     */
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }
}
