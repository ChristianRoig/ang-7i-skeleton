import { Component, Inject, ViewEncapsulation, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef,  } from '@angular/material';

import { Gasto } from '../gasto.model';
import { Contact } from 'app/main/personas/contact.model';
import { PersonasService } from 'app/main/personas/personas.service';
import { ComprobantesService } from '../comprobantes.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { FuseUtils } from '@fuse/utils';

export interface Estado {
    value: string;
    viewValue: string;
}

@Component({
    selector     : 'gasto-form-dialog',
    templateUrl  : './gasto-form.component.html',
    styleUrls    : ['./gasto-form.component.scss'],
    encapsulation: ViewEncapsulation.None
})

export class GastoFormDialogComponent
{
    contacto: Contact;
    action: string;
    gasto: Gasto;
    gastoForm: FormGroup;
    dialogTitle: string;
    estados: Estado[] = [
        {value: 'Pagado', viewValue: 'Pagado'},
        {value: 'Pendiente', viewValue: 'Pendiente'},
        {value: 'A Completar', viewValue: 'A Completar'}
    ];
    pago_formas: Estado[] = [
        { value: 'Efectivo', viewValue: 'Efectivo'},
        { value: 'Bancaria', viewValue: 'Bancaria'},
        { value: 'Cheque', viewValue: 'Cheque'},
        { value: 'Tarjeta', viewValue: 'Tarjeta'},
        { value: 'Cta. Cte.', viewValue: 'Cta. Cte'},
        { value: 'Otra', viewValue: 'Otra'}
    ];       
    copy: boolean;
    gastos_contact: any[];
    selected_gasto: Gasto;
    contactos: Contact[];
    date: Date;
    verMas: boolean;
    @ViewChild('dialogcontent') target: ElementRef;


    private _unsubscribeAll: Subject<any>;

    /**
     * Constructor
     *
     * @param {MatDialogRef<GastoFormDialogComponent>} matDialogRef
     * @param _data
     * @param {FormBuilder} _formBuilder
     */
    constructor(
        private contactsService: PersonasService,
        private gastosService: ComprobantesService, 
        public matDialogRef: MatDialogRef<GastoFormDialogComponent>,
        @Inject(MAT_DIALOG_DATA) private _data: any,
        private _formBuilder: FormBuilder
    ){
        this._unsubscribeAll = new Subject();
        
        this.gastosService.onGastosChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(data => {
                if (data == null) {
                    this.gastos_contact = [];
                } else {
                    this.gastos_contact = data;
                }
            });

        this.contacto = new Contact({});

        this.verMas = true;
        // Set the defaults
        this.action = _data.action;
        
        this.contactsService.onContactsChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(data => {

                if (data == null) {
                    this.contactos = [];
                } else {
                    this.contactos = data;
                }
            });


        if ( this.action === 'edit' ){
            this.dialogTitle = 'Editar '.concat(ComprobantesService.ENTIDAD);
            this.gasto = _data.gasto;
            this.contactos.forEach(element => {
                
                // tslint:disable-next-line: triple-equals
                if (element.id == this.gasto.contacto_id){ // no poner ===
                    this.contacto = element;
                }
            });
            
            if (this.contacto.id === null){
                console.log('no lo encontro');
                this.contacto.id = this.gasto.contacto_id;
                this.contacto.nombre = this.gasto.contacto_nomb;
                this.contacto.nombre_corto = this.gasto.contacto_corto;

                this.contactos.push(this.contacto);
            }

                       
        }
        else{
            this.dialogTitle = 'Nuevo '.concat(ComprobantesService.ENTIDAD);
            this.date = new Date();
            this.gasto = gastosService.initGasto(new Gasto({}));
                        
            this.contacto = _data.contact;
        }

        this.gastoForm = this.createContactForm(); 

        
    }



    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Create contact form
     *
     * @returns {FormGroup}
     */
    createContactForm(): FormGroup
    {
        return this._formBuilder.group({

            descripcion : [this.gasto.descripcion], 
            comprobante : [this.gasto.comprobante],
            nro : [this.gasto.nro],
            fecha : [this.gasto.fecha],
            pago_estado : [this.gasto.pago_estado], 
            importe : [this.gasto.importe],
            id: [this.gasto.id],
            proveedor: [this.contacto],
            propietario : [this.gasto.propietario],
            modulo : [this.gasto.modulo],
            categoria : [this.gasto.categoria],
            etiqueta : [this.gasto.etiqueta],
            nombre : [this.gasto.nombre],
            notas : [this.gasto.notas],
            file_link : [this.gasto.file_link],
            orden : [this.gasto.orden],
            pago_forma : [this.gasto.pago_forma],
            rubro: [this.gasto.rubro],
            periodo: [this.gasto.periodo],           
            contacto_id : [this.gasto.contacto_id],
            contacto_corto : [this.gasto.contacto_corto],
            contacto_nomb: [this.gasto.contacto_nomb],            
        });
    }

    selectionChange(): void {
        Object.assign(this.gasto, this.selected_gasto);
        this.gastoForm = this.createContactForm();
    }

    selectionContactoChange(event): void {
        this.contacto = event.value;
        this.gastoForm.controls['contacto_id'].setValue(this.contacto.id);
        this.gastoForm.controls['contacto_corto'].setValue(this.contacto.nombre_corto);
        this.gastoForm.controls['contacto_nomb'].setValue(this.contacto.nombre);
        this.gastoForm.controls['proveedor'].setValue(this.contacto);
    }

    showMore(): void {
        this.verMas = !this.verMas;
        setTimeout(() => {  
            this.target.nativeElement.scrollTop = this.target.nativeElement.scrollHeight;  //
        }, 280);        
    }
    
    ver(): void {
        console.log(this.gastoForm);
    }

}
