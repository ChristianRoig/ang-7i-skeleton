import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Origen } from '../origenes/origen.model';
import { ColaboradoresService } from 'app/main/colaboradores/colaboradores.service';
import { Colaborador } from 'app/main/colaboradores/colaborador.model';


@Component({
    selector     : 'ori-form-dialog',
    templateUrl  : './ori-form.component.html',
    styleUrls    : ['./ori-form.component.scss'],
    encapsulation: ViewEncapsulation.None,
    providers: [
    
    ],
}) 
export class OrigenesFormDialogComponent
{
    action: string;

    origen: Origen;
    
    OrigenForm: FormGroup;
    
    dialogTitle: string;

    candidatos: any;

    /**
     * Constructor
     *
     * @param {MatDialogRef<OrigenesFormDialogComponent>} matDialogRef
     * @param _data
     * @param {FormBuilder} _formBuilder
     * @param {ColaboradoresService} _colaboradoresService
     */
    constructor(
        public matDialogRef: MatDialogRef<OrigenesFormDialogComponent>,
        @Inject(MAT_DIALOG_DATA) private _data: any,
        private _formBuilder: FormBuilder,
        protected _colaboradoresService: ColaboradoresService,
    )
    {

        this.dialogTitle = 'Seleccionar Responsable';

        // Set the defaults
        this.action = _data.action;

        if ( this.action === 'edit' )
        {
            this.origen = _data.origen;           
        }

        this.candidatos = this.getContactos();
        this.OrigenForm = this.createOrigenForm();
        
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Create contact form
     *
     * @returns {FormGroup}
     */
    createOrigenForm(): FormGroup
    {
        let r = new Colaborador({});
        let s = new Colaborador({});

        console.log(this.origen);
       
        let f: FormGroup = this._formBuilder.group({
            id: [this.origen.id],
            responsableR: '',
            responsableS: '',
        });

        if ((this.origen.responsableR !== '') && (this.origen.responsableR !== 'Ninguno')){                        
            r = this.getContacto(this.origen.legajoR);

            f.controls['responsableR'].setValue(r);
        }
        
        if ((this.origen.responsableS !== '') && (this.origen.responsableS !== 'Ninguno')) {
            s = this.getContacto(this.origen.legajoS);

            f.controls['responsableS'].setValue(s);
        }
        
        return f;
    }

    verForm(f): void {
        console.log(f);
    }

    onSubmit(): void {
        console.log(this.OrigenForm);
        this.matDialogRef.close();
    }

    getContactos(): any[] {
        return this._colaboradoresService.getVanilaContact();
    }

    getContacto(legajo: string): Colaborador{        
        for (let index = 0; index < this.candidatos.length; index++) {
            const element: Colaborador = this.candidatos[index];
            if ((element.legajo)  === legajo){
            // if ((element.company + element.docket)  === legajo){
                return element;
            }
        }
        
        return null;
    }
}
