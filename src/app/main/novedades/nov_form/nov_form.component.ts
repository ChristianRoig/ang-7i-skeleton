import { Component, Inject, ViewEncapsulation, OnDestroy } from '@angular/core';
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
import { NovedadService } from '../novedad.service';

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
export class NovedadFormDialogComponent implements OnDestroy
{   
    
    // Datos de _data
    colaborador: Perfil;
    action: string;
    novedad: Novedad;
    invocador: string;
    private codOrigen: string;
    private origen: string;
    private periodo: string;
    private periodos: [];        

    private seleccionado: any = '';

    // /Datos
    
    novXForm: FormGroup;
    dialogTitle: string;
    hideshow = true;
    
    // Combos
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
        private _combosService: CombosService,
        private _novedadService: NovedadService
    )
    {
        this._unsubscribeAll = new Subject();


        // Set the defaults
        this.action = _data.action;
        this.periodo = _data.periodo || '';
        this.periodos = _data.periodos || [];
        this.origen = _data.origen || '';
        this.codOrigen = _data.codOrigen || '';
        this.colaborador = new Perfil(_data.perfil || {});
        this.invocador = _data.invocador || '';
        
        if (this.invocador !== '' && this.invocador !== undefined && this.invocador === 'equipo'){
            // Pregunto solo por 'equipo', '' y undefined, mas que nada para no romper el manejo
            // existente que se realiza en el servicio de novedades, el cual saca de la url el invocador, el equipo no ocupa ser registrado 
            // console.log('Invocador del form: ' + this.invocador);
            this._novedadService.OnInvocadorChanged.next(this.invocador);
        }
        
        

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

        if (this.invocador === 'sector'){
            // Combo Cualitativos
            this._combosService.onComboConceptoExternaRRHHChanged
                .pipe(takeUntil(this._unsubscribeAll))
                .subscribe(data => {
                    const resFiltrado = FuseUtils.filterArrayByString(data, this.codOrigen);

                    if (resFiltrado.length === 0){
                        this.conceptosXOrigen = data;
                    }else{
                        this.conceptosXOrigen = resFiltrado;

                        if (resFiltrado.length == 1){
                            this.seleccionado = resFiltrado;
                        }

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

    /**
     * verForm()
     * Usado cuando se realiza un debug
     */
    verForm(): void {
        console.log(this.novXForm);
        console.log(this.novXForm.getRawValue());
    }

    /**
     * onSubmit()
     * Encargado de invocar el servicio una vez terminado de relizar los cambios en la novedad
     */
    onSubmit(): void {
        // console.log(this.novXForm);

        const novedad = new Novedad(this.novXForm.getRawValue());

        if (this.action === 'edit'){
            this._novedadService.updateNovedad(novedad);
        }

        if (this.action === 'new') {
            this._novedadService.addNovedad(novedad, this.invocador);
        }

        this.matDialogRef.close();
    }

    /**
     * setearCodNovedad()
     * Mecanismo para setear el codigo de novedad dependiendo del combo que se este usando
     * @param {any} param 
     * @param {string} combo 
     */
    setearCodNovedad(param: any, combo: string): void {
        let comboFiltrado = [];

        if (combo === 'cualitativos'){
            comboFiltrado = this.cualitativos;    
        }
        
        if (combo === 'cuantitativos'){
            comboFiltrado = this.cuantitativos;
        }

        if (combo === 'xSector'){
            comboFiltrado = this.conceptosXOrigen;
        }
        
        const yaFiltrado = FuseUtils.filterArrayByString(comboFiltrado, param.value);
        
        if (yaFiltrado.length !== 0){
            this.novXForm.controls['codNovedad'].setValue(yaFiltrado[0].cod);


            if (combo === 'xSector') {
                this.novXForm.controls['tipo'].setValue(yaFiltrado[0].valor3);
            }
        }
    }



    /**
     * Cambia el tipo segun el switch y setea importe en '' si es cualitativa
     */
    switchParam(): void {
        this.hideshow = !this.hideshow;

        if (this.hideshow) { // Cuantitativa
            this.novXForm.controls['tipo'].setValue('Cuantitativa');
            this.novXForm.controls.descripcion.reset('');
            this.novXForm.controls.codNovedad.reset('');
            this.novXForm.controls['importe'].setValue('0');
            this.novXForm.controls.importe.enable();
        } else { // Cualitativa
            this.novXForm.controls['tipo'].setValue('Cualitativa');
            this.novXForm.controls.descripcion.reset('');
            this.novXForm.controls.codNovedad.reset('');
            this.novXForm.controls['importe'].setValue('0');
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
                    codEmpresa: this.colaborador.codEmpresa,
                    empresa: this.colaborador.empresa,
                    codOrigen: this.codOrigen,
                    origen: this.origen,
                    sexo: this.colaborador.sexo,
                    img: this.colaborador.img,
                    nombre: this.colaborador.nombre,
                    codNovedad: '',
                    observaciones: '',

                    ///////////////////

                    legajo: this.colaborador.legajo,
                    tipo: (this.hideshow) ? 'Cuantitativa' : 'Cualitativa',
                    periodo: new FormControl({ value: this._to2digit(hoy.getMonth() + 1) + '-' + hoy.getFullYear(), disabled: true }),
                    fechaDesde: '',
                    fechaHasta: '',
                    importe: '0',
                    estado: 'CONFIRMAR',
                    descripcion: '',
                });

            }else {
                const aux: any[] = FuseUtils.filterArrayByString(this.periodos, this.periodo);
                const pSelect = (aux.length > 0) ? aux[0].cod : '';

                let auxTipo: any = '';
                let auxDescripcion: any = '';
                if (this.seleccionado !== '') {

                    // console.log(this.seleccionado);

                    if (this.seleccionado.length == 1) {
                        auxTipo = this.seleccionado[0].valor3 || '';
                        auxDescripcion = this.seleccionado[0].valor || '';
                    }
                }

                return this._formBuilder.group({
                    idNovedad: null,
                    codNovedad: '',
                    codEmpresa: '',
                    empresa: '',
                    codOrigen: this.codOrigen,
                    origen: this.origen,
                    observaciones: '',
                    sexo: '',
                    img: 'assets/images/avatars/avatarF.png',
                    nombre: '',

                    ///////////////////

                    tipo: (this.invocador === 'sector') ? auxTipo : (this.hideshow) ? 'Cuantitativa' : 'Cualitativa',
                    legajo: '',
                    periodo: new FormControl({ value: pSelect, disabled: true }),
                    fechaDesde: '',
                    fechaHasta: '',
                    importe: '0',
                    estado: 'CONFIRMAR',
                    descripcion: auxDescripcion,
                });
            }

        }

    }

    /**
     * On destroy
     */
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Private methods
    // -----------------------------------------------------------------------------------------------------
    
    /**
     * _to2digit()
     * @param {number} n 
     */
    private _to2digit(n: number): string {
        return ('00' + n).slice(-2);
    }

    /**
     * _refactorDate()
     * @param {string} date 
     */
    private _refactorDate(date: string): string{
        if (date.length < 10 || date.length > 10){
            return 'error';
        }
        const arr = date.split('-');

        return arr[1] + '-' + arr[0];
    }
}
