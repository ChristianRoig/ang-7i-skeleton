import { Component, OnInit, TemplateRef, ViewEncapsulation, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { PersonasService } from '../personas.service';
import { Contact } from '../contact.model';
import { ContactsContactFormDialogComponent } from 'app/main/personas/contact-form/contact-form.component';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import { FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material';
import { ComprobantesService } from 'app/main/comprobantes/comprobantes.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'contact-view',
  templateUrl: './contact-view.component.html',
  styleUrls: ['./contact-view.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations   : fuseAnimations
})
export class ContactViewComponent implements OnInit {

    @ViewChild('dialogContent')
    dialogContent: TemplateRef<any>;
    dialogRef: any;
    confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;
    
    proveedor: Contact;
    
    comprobantesTabName: String = 'Gastos';

    private _unsubscribeAll: Subject<any>;

    constructor(public _matDialog: MatDialog, private router: Router, private _personasService: PersonasService,
                private _comprobantesService: ComprobantesService, private activatedRoute: ActivatedRoute) {
        this._unsubscribeAll = new Subject();
    }

  ngOnInit(): void {
    this._personasService.onProveedorChanged
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe(data => {
            
            if (data == null) {
                this.proveedor = new Contact({}); // lo inicializo para que no de error al querer cargar los datos                
                this.router.navigate(['/proveedores']);
            }else{
                this.proveedor = data;
            }
        });

  }

  editContact(): void{
      this.dialogRef = this._matDialog.open(ContactsContactFormDialogComponent, {
          panelClass: 'contact-form-dialog',
          data      : {
              contact: this.proveedor,
              action : 'edit'
          }
      });

      this.dialogRef.afterClosed()
          .subscribe(response => {
              if ( !response )
              {
                  return;
              }
              const actionType: string = response[0];
              const formData: FormGroup = response[1];
              switch ( actionType )
              {
                  /**
                   * Save
                   */
                  case 'save':

                      this._personasService.updateContact(formData.getRawValue());

                      break;
                  /**
                   * Delete
                   */
                  case 'delete':

                      this.deleteContact();

                      break;
              }
          });
  }

  deleteContact(): void{
      this.confirmDialogRef = this._matDialog.open(FuseConfirmDialogComponent, {
          disableClose: false
      });

      this.confirmDialogRef.componentInstance.confirmMessage = '¿Esta Seguro que desea ELIMINAR?';

      this.confirmDialogRef.afterClosed().subscribe(result => {
          if ( result )
          {
              this._personasService.deleteContact(this.proveedor);
              this.router.navigate(['/proveedores']);
          }
          this.confirmDialogRef = null;
      });

  }

}
