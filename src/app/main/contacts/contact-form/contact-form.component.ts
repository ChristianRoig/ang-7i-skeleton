import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

import { Contact } from 'app/main/contacts/contact.model';
import { ContactsService } from '../contacts.service';

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
    action: string;
    contact: Contact;
    contactForm: FormGroup;
    dialogTitle: string;
    contactName: string;
    copy: boolean = false;

    estados: Option[] = [
        { value: 'Responsable Inscripto', viewValue: 'Responsable Inscripto' },
        { value: 'Monotributista', viewValue: 'Monotributista' },
        { value: 'Consumidor Final', viewValue: 'Consumidor Final' },
        { value: 'Exento', viewValue: 'Exento' },
        { value: 'Otra', viewValue: 'Otra' }
    ];

    generos: Option[] = [
        { value: 'Neutro', viewValue: 'Neutro' },
        { value: 'Hombre', viewValue: 'Hombre' },
        { value: 'Mujer', viewValue: 'Mujer' },
        { value: 'Empresa', viewValue: 'Empresa' },
    ];

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
        private _contactsService: ContactsService,
        private _formBuilder: FormBuilder
    ) {
        // Set the defaults
        this.action = _data.action;


        if (this.action === 'edit') {
            this.dialogTitle = 'Editar Proveedor';
            this.contact = _data.contact;
            this.contactForm = this.createContactForm();
        }
        else {
            this.dialogTitle = 'Nuevo Proveedor';
            this.contact = new Contact({});
            this._contactsService.initContacto(this.contact);
            this.contactForm = this.createContactForm();
            this._contactsService.crearRequestNewCodigoProveedor("7ideas", "Proveedores")
                .subscribe((response: any) => {
                    this.contact.cod = response;
                    this.contactForm.controls['cod'].setValue(this.contact.cod); //setea el cod que 
                });
            /*             this._contactsService.getGastosByName(this.proveedor.nombre_corto).then((value) => {
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
            let fileReader = new FileReader();
            let file = fileList[0];
            fileReader.onload = (e) => {
                console.log(fileReader.result);
                let img = fileReader.result;
                this.contact.file_link = img.toString();
                this.contactForm.controls['file_link'].setValue(img.toString());
            }
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
            cuit: [this.contact.doc_nro],
            genero: [this.contact.genero],
            notas: [this.contact.notas],
            file_link: [this.contact.file_link],
/*             activo: [this.contact.activo],
 */            predefinido: [this.contact.predefinido],
            estado: [this.contact.estado]
        });
    }
}
