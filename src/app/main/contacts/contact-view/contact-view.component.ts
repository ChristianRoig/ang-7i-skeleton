import { Component, OnInit, TemplateRef, ViewEncapsulation, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { ContactsService } from '../contacts.service';
import { Contact } from '../contact.model';
import { ContactsContactFormDialogComponent } from 'app/main/contacts/contact-form/contact-form.component';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import { FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material';
import { GastosService } from 'app/main/gastos/gastos.service';

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
  gastos: any;

  constructor(
    public _matDialog: MatDialog,
    private _contactsService: ContactsService,
    private gastosService: GastosService,
    private activatedRoute: ActivatedRoute) {
      
      this.activatedRoute.params.subscribe(params => {
        this.proveedor = this._contactsService.getProveedor(params['id']);
        this.gastosService.getGastosByName(this.proveedor.id).then((value) => {
        this.gastos = value;
        }); 
      });
   }

  ngOnInit(): void {
  }

  editContact(): void
  {
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

                      this._contactsService.updateContact(formData.getRawValue());

                      break;
                  /**
                   * Delete
                   */
                  case 'delete':

                      this.deleteContact(this.proveedor);

                      break;
              }
          });
  }

  deleteContact(contact): void
  {
      this.confirmDialogRef = this._matDialog.open(FuseConfirmDialogComponent, {
          disableClose: false
      });

      this.confirmDialogRef.componentInstance.confirmMessage = 'Are you sure you want to delete?';

      this.confirmDialogRef.afterClosed().subscribe(result => {
          if ( result )
          {
              this._contactsService.deleteContact(contact);
          }
          this.confirmDialogRef = null;
      });

  }

}
