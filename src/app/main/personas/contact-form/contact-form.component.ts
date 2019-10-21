import { Component, Inject, ViewEncapsulation, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

import { Contact } from 'app/main/personas/contact.model';
import { PersonasService } from '../personas.service';

export interface Option {
    value: string;
    viewValue: string;
}

@Component({
    selector     : 'contacts-contact-form-dialog',
    templateUrl  : './contact-form.component.html',
    styleUrls    : ['./contact-form.component.scss'],
    encapsulation: ViewEncapsulation.None
})

export class ContactsContactFormDialogComponent
{
    contactForm: FormGroup;
    action: string;
    dialogTitle: string;
    contactName: string;
    copy: boolean = false;
    contact: Contact;
    verMas: boolean;

    estados: Option[] = [
        { value: 'Responsable Inscripto', viewValue: 'Responsable Inscripto' },
        { value: 'Monotributista',   viewValue: 'Monotributista' },
        { value: 'Consumidor Final', viewValue: 'Consumidor Final' },
        { value: 'Exento', viewValue: 'Exento' },
        { value: 'Otra',   viewValue: 'Otra' }
    ];

    generos: Option[] = [
        { value: 'Neutro',  viewValue: 'Neutro' },
        { value: 'Hombre',  viewValue: 'Hombre' },
        { value: 'Mujer',   viewValue: 'Mujer' },
        { value: 'Empresa', viewValue: 'Empresa' },
    ];

    @ViewChild('dialogcontent') target: ElementRef;
    
    /**
     * Constructor
     *
     * @param {MatDialogRef<ContactsContactFormDialogComponent>} matDialogRef
     * @param _data
     * @param {FormBuilder} _formBuilder
     */
    constructor(
        public matDialogRef: MatDialogRef<ContactsContactFormDialogComponent>,
        @Inject(MAT_DIALOG_DATA) private _data: any,
        private _personasService: PersonasService,
        private _formBuilder: FormBuilder
    ) {
        // Set the defaults
        this.action = _data.action;
        this.verMas = true;

        if (this.action === 'edit') {
            this.dialogTitle = 'Editar '.concat(PersonasService.ENTIDAD);
            this.contact = _data.contact;
            this.contactForm = this.createContactForm();
        }
        else {
            this.dialogTitle = 'Nuevo '.concat(PersonasService.ENTIDAD);
            this.contact = new Contact({});
            this._personasService.initContacto(this.contact);
            this.contactForm = this.createContactForm();
            this._personasService.crearRequestNewCodigoProveedor()
                .subscribe((response: any) => {
                    this.contact.cod = response;
                    this.contactForm.controls['cod'].setValue(this.contact.cod); // setea el cod que 
                });
            /*             this._personasService.getGastosByName(this.proveedor.nombre_corto).then((value) => {
                            this.gastos = value;
                            });  */
        }

    }

    ngOnInit(): void {
        this.contactName = this.contact.nombre_corto;
    }

    NameOnChanges(newValue: string): void {
        this.contactName = newValue;
    }

    uploadImage(event): void {
        const fileList: FileList = event.target.files;
        if (fileList.length > 0) {
            const fileReader = new FileReader();
            const file = fileList[0];
            fileReader.onload = (e) => {
                console.log(fileReader.result);
                const img = fileReader.result;
                this.contact.file_link = img.toString();
                this.contactForm.controls['file_link'].setValue(img.toString());
            };
            fileReader.readAsDataURL(file);
        }
    }
    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Create contact form
     *
     * @returns {FormGroup}
     */
    createContactForm(): FormGroup {
        return this._formBuilder.group({
            id: [this.contact.id],
            cod: [this.contact.cod],
            propietario: [this.contact.propietario],
            modulo: [this.contact.modulo],
            categoria: [this.contact.categoria],
            etiqueta: [this.contact.etiqueta],
            nombre_corto: [this.contact.nombre_corto],
            nombre: [this.contact.nombre],
            correo: [this.contact.correo],
            telefono: [this.contact.telefono],
            domicilio: [this.contact.domicilio],
            localidad: [this.contact.localidad],
            cond_iva: [this.contact.cond_iva],
            doc_nro: [this.contact.doc_nro],
            genero: [this.contact.genero],
            notas: [this.contact.notas],
            file_link: [this.contact.file_link],
            estado: [this.contact.estado],
            doc_tipo: [this.contact.doc_tipo]
        });
    }

    showMore(): void {
        this.verMas = !this.verMas;
        setTimeout(() => {
            this.target.nativeElement.scrollTop = this.target.nativeElement.scrollHeight;  //
        }, 280);
    }
}
