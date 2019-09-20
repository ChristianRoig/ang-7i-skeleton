import { Component, Inject, ViewEncapsulation, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { ConceptosService } from 'app/main/configurar/conceptos.service';
import { Concepto } from '../conceptos/concepto.model';
import { CombosService } from '../../common/combos/combos.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';


@Component({
    selector     : 'conc-form-dialog',
    templateUrl  : './conc-form.component.html',
    styleUrls    : ['./conc-form.component.scss'],
    encapsulation: ViewEncapsulation.None,
    providers: [
    
    ],
}) 
export class ConceptosFormDialogComponent implements OnInit
{
    action: string;    

    tipos = ['EXTERNA', 'RRHH'];

    isRRHH = false;

    origenesRRHH = null;
    origenesExterno = null;
    
    concepto: Concepto;

    ConceptoForm: FormGroup;
    
    dialogTitle: string;

    private _unsubscribeAll: Subject<any>;

    // candidatos: any;

    /**
     * Constructor
     *
     * @param {MatDialogRef<ConceptosFormDialogComponent>} matDialogRef
     * @param _data
     * @param {FormBuilder} _formBuilder     
     */
    constructor(
        public matDialogRef: MatDialogRef<ConceptosFormDialogComponent>,
        @Inject(MAT_DIALOG_DATA) private _data: any,
        private _formBuilder: FormBuilder,
        protected _conceptosService: ConceptosService,
        private _combosService: CombosService,
    )
    {

        this.dialogTitle = 'Seleccionar Tipo & Origen';

        // Set the defaults
        // this.action = _data.action;

        this.concepto = _data.concepto;

        if (this.concepto.tipoNov === 'RRHH'){
            this.isRRHH = true;
        }
       
        this.ConceptoForm = this.createConceptoForm();

        this._unsubscribeAll = new Subject();
        
    }


    ngOnInit(): void {
        this.origenesRRHH = this._combosService.getCombo('rrhh');
        this._combosService.onComboOrigenRRHHChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(data => {
                this.origenesRRHH = data;                
            });

        this.origenesExterno = this._combosService.getCombo('ext');
        this._combosService.onComboOrigenExtChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(data => {
                this.origenesExterno = data;                
            });
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Create contact form
     *
     * @returns {FormGroup}
     */
    createConceptoForm(): FormGroup
    {
        return this._formBuilder.group({
            'idConcepto': [this.concepto.idConcepto],
            'tipoNov' : [this.concepto.tipoNov],
            'codNov' : [this.concepto.codNov],
            'descripcion' : [this.concepto.descripcion],
            'codOrigen' : [this.concepto.codOrigen],
            'observaciones' : [this.concepto.observaciones],
        });
    }

    /**
     * Actualiza el concepto
     */
    onSubmit(): void {
        // console.log(this.ConceptoForm);
        let concepto = new Concepto(this.ConceptoForm.getRawValue());        
        this._conceptosService.updateConcepto(concepto);
        this.matDialogRef.close();
    }

    /**
     * Cambia el tipoNov del formulario
     */
    swithOrigenList(): void {
        this.ConceptoForm.controls['codOrigen'].reset();

        this.isRRHH = !this.isRRHH;

        if (this.isRRHH) {
            this.ConceptoForm.controls['tipoNov'].reset('RRHH');
        }else{
            this.ConceptoForm.controls['tipoNov'].reset('EXTERNA');
        }
    }

    verForm(F): void {
        console.log(F.value);
    }
}
