import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDatepicker } from '@angular/material/datepicker';


import * as _moment from 'moment';

import { Moment } from 'moment';
import { Perfil } from 'app/main/perfil/perfil.model';


const moment = _moment;


export const dia_mes_año = {
    parse: {
        dateInput: 'DD/MM/YYYY',
    },
    display: {
        dateInput: 'DD/MM/YYYY',
        monthYearLabel: 'DD MMM YYYY',
        dateA11yLabel: 'LL',
        monthYearA11yLabel: 'DDDD MMMM YYYY',
    },
};


@Component({
    selector     : 'colaboradores-colaborador-form-dialog',
    templateUrl  : './colaborador-form.component.html',
    styleUrls    : ['./colaborador-form.component.scss'],
    encapsulation: ViewEncapsulation.None,
    providers: [
        { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
        { provide: MAT_DATE_FORMATS, useValue: dia_mes_año },
    ],
}) 
export class ColaboradoresContactFormDialogComponent
{
    // date = new FormControl(moment());
    
    action: string;
    colaborador: Perfil;
    colaboradorForm: FormGroup;
    dialogTitle: string;

    hideshow = true;
 
    unidad = '';

    cuantitativos = [
        {
            value: 'Falta Injustificada',
            tipo: 'cuantitativo',
            unidad: 'dias',
            viewValue: 'Falta Injustificada'
        },
        {
            value: 'Feriado Trabajado(Horas)',
            tipo: 'cuantitativo',
            unidad: 'horas',
            viewValue: 'Feriado Trabajado(Horas)'
        },
        {
            value: 'Horas Extras 100%',
            tipo: 'cuantitativo',
            unidad: 'horas',
            viewValue: 'Horas Extras 100%'
        },
        {
            value: 'Horas Extras 50%',
            tipo: 'cuantitativo',
            unidad: 'horas',
            viewValue: 'Horas Extras 50%'
        },
        {
            value: 'Lic.Por Enfermedad',
            tipo: 'cuantitativo',
            unidad: 'dias',
            viewValue: 'Lic.Por Enfermedad'
        },
        {
            value: 'Lic.Por Excedencia',
            tipo: 'cuantitativo',
            unidad: 'dias',
            viewValue: 'Lic.Por Excedencia'
        },
        {
            value: 'Lic.Por Fliar Enfermo',
            tipo: 'cuantitativo',
            unidad: 'dias',
            viewValue: 'Lic.Por Fliar Enfermo'
        },
        {
            value: 'Lic.Por Maternidad',
            tipo: 'cuantitativo',
            unidad: 'dias',
            viewValue: 'Lic.Por Maternidad'
        },
        {
            value: 'Lic.Por Matrimonio',
            tipo: 'cuantitativo',
            unidad: 'dias',
            viewValue: 'Lic.Por Matrimonio'
        },
        {
            value: 'Vacaciones(Días)',
            tipo: 'cuantitativo',
            unidad: 'dias',
            viewValue: 'Vacaciones(Días)'
        },
    ];

    cualitativos = [
        {
            value: 'Adicional Caj.Prop. - No Habitual',
            tipo: 'cualitativo',
            viewValue: 'Adicional Caj.Prop. - No Habitual'
        },
        {
            value: 'Adicional Cajero - No Habitual',
            tipo: 'cualitativo',
            viewValue: 'Adicional Cajero - No Habitual'
        },
        {
            value: 'Alta Cuota Sindical',
            tipo: 'cualitativo',
            viewValue: 'Alta Cuota Sindical'
        },
        {
            value: 'Alta Fliar.Adicional Sindicato',
            tipo: 'cualitativo',
            viewValue: 'Alta Fliar.Adicional Sindicato'
        },
        {
            value: 'Baja Cuota Sindical',
            tipo: 'cualitativo',
            viewValue: 'Baja Cuota Sindical'
        },
        {
            value: 'Baja Fliar.Adicional Sindicato',
            tipo: 'cualitativo',
            viewValue: 'Baja Fliar.Adicional Sindicato'
        },
        {
            value: 'Días De Estudio',
            tipo: 'cualitativo',
            viewValue: 'Días De Estudio'
        },
        {
            value: 'Ingreso A Rem.Variable',
            tipo: 'cualitativo',
            viewValue: 'Ingreso A Rem.Variable'
        },
        {
            value: 'Licencias Especiales',
            tipo: 'cualitativo',
            viewValue: 'Licencias Especiales'
        },
        {
            value: 'Plus Asesor Junior Experto',
            tipo: 'cualitativo',
            viewValue: 'Plus Asesor Junior Experto'
        },
        {
            value: 'Plus Master',
            tipo: 'cualitativo',
            viewValue: 'Plus Master'
        },
    ];

    /**
     * Constructor
     *
     * @param {MatDialogRef<ColaboradoresContactFormDialogComponent>} matDialogRef
     * @param _data
     * @param {FormBuilder} _formBuilder
     */
    constructor(
        public matDialogRef: MatDialogRef<ColaboradoresContactFormDialogComponent>,
        @Inject(MAT_DIALOG_DATA) private _data: any,
        private _formBuilder: FormBuilder
    )
    {
        // Set the defaults
        this.action = _data.action;

        if ( this.action === 'edit' )
        {
            this.dialogTitle = 'Editar Novedad';
            this.colaborador = _data.colaborador;
        }
        else
        {
            this.dialogTitle = 'Nueva Novedad';
            this.colaborador = _data.colaborador || new Perfil({});
            
        }

        this.colaboradorForm = this.createContactForm();
    }

    switchParam(): void {        
        this.hideshow = !this.hideshow;

        if (this.hideshow){
            this.colaboradorForm.controls.cantidad.enable();
            this.colaboradorForm.controls.concepto_cuantitativos.enable();
            this.colaboradorForm.controls.concepto_cualitativos.disable();
        }else{ 
            this.colaboradorForm.controls.concepto_cualitativos.enable();
            this.colaboradorForm.controls.cantidad.disable();
            this.colaboradorForm.controls.concepto_cuantitativos.disable();
        }
            
    }


    changeUnidad(e): void {
        // console.log(e);
        this.cuantitativos.forEach(element => {

            if (element.value === e.value){
                this.unidad = element.unidad;                    
            }
            return;            
        });
    }

    verForm(f): void {
        console.log(f);
    }

    onSubmit(): void {
        console.log(this.colaboradorForm);
        this.matDialogRef.close();
    }
    
    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Create colaborador form
     *
     * @returns {FormGroup}
     */
    createContactForm(): FormGroup
    {
        const hoy = new Date;

        return this._formBuilder.group({
            id                       : [this.colaborador.idColaborador],
            legajo                   : [this.colaborador.legajo],
            name                     : [this.colaborador.nombre],            
            avatar                   : [this.colaborador.img],            
            company                  : [this.colaborador.empresa],
            datePeriodo              : new FormControl({ value: this._to2digit(hoy.getMonth() + 1) + '/' + hoy.getFullYear(), disabled: true }),
            dateDesde                : '',
            dateHasta                : '',
            cantidad                 : '',
            concepto_cuantitativos   : '',
            concepto_cualitativos    : '',            
        });
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Private methods
    // -----------------------------------------------------------------------------------------------------

    private _to2digit(n: number): string {
        return ('00' + n).slice(-2);
    } 
}
