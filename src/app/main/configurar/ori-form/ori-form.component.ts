import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Origen } from '../origenes/origen.model';
import { PerfilService } from '../../perfil/perfil.service';
import { Perfil } from 'app/main/perfil/perfil.model';



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


    /**
     * Constructor
     *
     * @param {MatDialogRef<OrigenesFormDialogComponent>} matDialogRef
     * @param _data
     * @param {FormBuilder} _formBuilder
     */
    constructor(
        public matDialogRef: MatDialogRef<OrigenesFormDialogComponent>,
        @Inject(MAT_DIALOG_DATA) private _data: any,
        private _formBuilder: FormBuilder,        
    )
    {

        this.dialogTitle = 'Seleccionar Responsable';

        // Set the defaults
        this.action = _data.action;

        if ( this.action === 'edit' )
        {
            this.origen = _data.origen;           
        }

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
        const f: FormGroup = this._formBuilder.group({
            id: [this.origen.id],
            responsableR: (this.origen.legajoR === 'Ninguno') ? '' : this.origen.legajoR,
            responsableS: (this.origen.legajoS === 'Ninguno') ? '' : this.origen.legajoS,
        });
               
        return f;
    }

    verForm(f): void {
        console.log(f);
    }

    onSubmit(): void {
        console.log(this.OrigenForm);
        this.matDialogRef.close();
    }
 
}
