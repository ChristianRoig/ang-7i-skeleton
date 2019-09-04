import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { Perfil } from 'app/main/perfil/perfil.model';
import { FuseUtils } from '@fuse/utils';
import { Novedad } from '../novedad.model';
import { CombosService } from '../../common/combos/combos.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

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
    selector     : 'nov-form-dialog',
    templateUrl  : './nov_form.component.html',
    styleUrls    : ['./nov_form.component.scss'],
    encapsulation: ViewEncapsulation.None,
    providers: [
        { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
        { provide: MAT_DATE_FORMATS, useValue: dia_mes_año },
    ],
}) 
export class NovedadFormDialogComponent
{        
    colaborador: Perfil;
    unidad = '';

    action: string;
    novXForm: FormGroup;
    dialogTitle: string;
    novedad: Novedad;
    invocador: string;
    origen: string;

    hideshow = true;
    
    private periodo: string;
    private periodos: [];        

    cuantitativos = [];
    cualitativos = [];
    conceptosXOrigen = [];

    protected _unsubscribeAll: Subject<any>;

    /**
     * Constructor
     *
     * @param {MatDialogRef<NovedadFormDialogComponent>} matDialogRef
     * @param _data
     * @param {FormBuilder} _formBuilder
     */
    constructor(
        public matDialogRef: MatDialogRef<NovedadFormDialogComponent>,
        @Inject(MAT_DIALOG_DATA) private _data: any,
        private _formBuilder: FormBuilder,
        private _combosService: CombosService
    )
    {
        // Set the defaults
        this.action = _data.action;
        this.periodo = _data.periodo || '';
        this.periodos = _data.periodos || [];
        this.invocador = _data.invocador || '';

        this._unsubscribeAll = new Subject();

        // Combo Cuantitativos
        this._combosService.onComboConceptoCuantitativaChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(data => {
                this.cuantitativos = data;
            });

        // Combo Cualitativos
        this._combosService.onComboConceptoCualitativaChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(data => {
                this.cualitativos = data;
            });


        if (this.invocador === 'equipo') {
            this.colaborador = new Perfil(_data.perfil || {});
        }

        if (this.invocador === 'sector'){
            this.origen = _data.origen || ''; // se tiene que enviar en NovXSector
        
            // Combo Cualitativos
            this._combosService.onComboConceptoExternaChanged
                .pipe(takeUntil(this._unsubscribeAll))
                .subscribe(data => {
                    const resFiltrado = FuseUtils.filterArrayByString(data, this.origen);

                    if (resFiltrado.length === 0){
                        this.conceptosXOrigen = data;
                    }else{
                        this.conceptosXOrigen = resFiltrado;
                    }

                });
        }

        if ( this.action === 'edit' ){
            this.dialogTitle = 'Editar Novedad';       
            this.novedad = _data.novedad;
            this.colaborador = new Perfil(_data.novedad);
        }
        else{
            this.dialogTitle = 'Nueva Novedad';                  
        }

        this.novXForm = this.createForm();
    }

   
    
    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    verForm(): void {
        console.log(this.novXForm);
    }

    onSubmit(): void {
        console.log(this.novXForm);
        this.matDialogRef.close();
    }

    /**
     * Cambia el tipo segun el switch y setea importe en '' si es cualitativa
     */
    switchParam(): void {
        this.hideshow = !this.hideshow;

        if (this.hideshow) { // Cuantitativa
            this.novXForm.controls['tipo'].setValue('Cuantitativa');
            this.novXForm.controls.descripcion.reset('');                       
            this.novXForm.controls['importe'].setValue('');
            this.novXForm.controls.importe.enable();
        } else { // Cualitativa
            this.novXForm.controls['tipo'].setValue('Cualitativa');
            this.novXForm.controls.descripcion.reset('');                       
            this.novXForm.controls['importe'].setValue('');
            this.novXForm.controls.importe.disable();            
        }
    }

    /**
     * Create colaborador form
     *
     * @returns {FormGroup}
     */
    createForm(): FormGroup
    {
        
        if (this.action === 'edit') {
            this.hideshow = (this.novedad.tipo === 'Cuantitativa') ? true : false;

            let aux = false;
            let auxImg = '';
            if (this.novedad.img === ''){
                if (this.novedad.sexo === 'Femenino') {
                    auxImg = 'assets/images/avatars/avatarF.png';
                    aux = true;
                } else {
                    auxImg = 'assets/images/avatars/avatarM.png';
                    aux = true;
                }      
            }
            
            let isCtrlNov = false;
            if (this.invocador === 'ControlNovedades'){
                isCtrlNov = true;
            }


            return this._formBuilder.group({
                idNovedad: this.novedad.idNovedad,
                empresa: this.novedad.empresa,                
                codNovedad: this.novedad.codNovedad,
                codEmpresa: this.novedad.codEmpresa,
                codOrigen: this.novedad.codOrigen,
                observaciones: this.novedad.observaciones,
                origen: this.novedad.origen,

                ///////////////////
                tipo: this.novedad.tipo,
                img: (aux) ? auxImg : this.novedad.img,
                sexo: this.novedad.sexo,
                nombre: this.novedad.nombre,
                legajo: new FormControl({ value: this.novedad.legajo, disabled: true }),
                periodo: new FormControl({ value: this._refactorDate(this.novedad.periodo), disabled: true }),
                fechaDesde: (this.novedad.fechaDesde === 'null') ? '' : this.novedad.fechaDesde,                
                fechaHasta: (this.novedad.fechaHasta === 'null') ? '' : this.novedad.fechaHasta,
                estado: this.novedad.estado,
                descripcion: (isCtrlNov) ? new FormControl({ value: this.novedad.descripcion, disabled: true }) : this.novedad.descripcion,
                importe: this.novedad.importe,

            });



        }else {
            const hoy = new Date;

            if (this.invocador === 'equipo') {                
                return this._formBuilder.group({
                    idNovedad: null,
                    codNovedad: '',
                    codEmpresa: this.colaborador.codEmpresa,
                    empresa: this.colaborador.empresa,
                    codOrigen: '',
                    origen: '',
                    observaciones: '',
                    sexo: this.colaborador.sexo,
                    img: this.colaborador.img,
                    nombre: this.colaborador.nombre,

                    ///////////////////

                    legajo: this.colaborador.legajo,
                    tipo: '',
                    periodo: new FormControl({ value: this._to2digit(hoy.getMonth() + 1) + '-' + hoy.getFullYear(), disabled: true }),
                    fechaDesde: '',
                    fechaHasta: '',
                    importe: '',
                    estado: 'CONFIRMAR',
                    descripcion: '',
                });

            }else {
                const aux: any[] = FuseUtils.filterArrayByString(this.periodos, this.periodo);
                const pSelect = (aux.length > 0) ? aux[0].cod : '';

                return this._formBuilder.group({
                    idNovedad: null,
                    codNovedad: '',
                    codEmpresa: '',
                    empresa: '',
                    codOrigen: '',
                    origen: '',
                    observaciones: '',
                    sexo: '',
                    img: 'assets/images/avatars/avatarF.png',
                    nombre: '',

                    ///////////////////

                    tipo: '',
                    legajo: '',
                    periodo: new FormControl({ value: pSelect, disabled: true }),
                    fechaDesde: '',
                    fechaHasta: '',
                    importe: '',
                    estado: 'CONFIRMAR',
                    descripcion: '',
                });
            }


            

        }

    }

    // -----------------------------------------------------------------------------------------------------
    // @ Private methods
    // -----------------------------------------------------------------------------------------------------
    
    private _to2digit(n: number): string {
        return ('00' + n).slice(-2);
    }

    private _refactorDate(date: string): string{
        if (date.length < 10 || date.length > 10){
            return 'error';
        }
        const arr = date.split('-');

        return arr[1] + '-' + arr[0];
    }
}
