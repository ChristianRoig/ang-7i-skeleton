import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Origen } from '../origenes/origen.model';
import { OrigenesService } from '../origenes.service';

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
        private _origenService: OrigenesService
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
            id: [this.origen.idOrigen],
            responsableR: [this.origen.legajoResp],
            responsableS: [this.origen.legajoSup],
        });
               
        return f;
    }

    verForm(f): void {
        console.log(f);
    }

    onSubmit(): void {
        console.log(this.OrigenForm);
        
        this.origen.legajoResp = this.OrigenForm.get('responsableR').value;
        this.origen.legajoSup = this.OrigenForm.get('responsableS').value;

        this._origenService.updateOrigen(this.origen);
        this.matDialogRef.close();
    }
 
}
