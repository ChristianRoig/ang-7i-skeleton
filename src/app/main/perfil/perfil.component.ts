import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { PerfilService } from './perfil.service';
import { Contact } from '../contacts/contact.model';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { MatDialog } from '@angular/material';
import { PerfilFormDialogComponent } from './perfil-form/perfil-form.component';
import { FormGroup } from '@angular/forms';


@Component({
  selector: 'perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations   : fuseAnimations
})
export class PerfilComponent implements OnInit {

  perfil: Contact;

  private dialogRef: any;
  private _unsubscribeAll: Subject<any>;

  constructor( private perfilService: PerfilService,
               private _matDialog: MatDialog, ) { 
    this._unsubscribeAll = new Subject();
  }
  
  ngOnInit(): void {
    this.perfilService.infoOnChanged.pipe(
      takeUntil(this._unsubscribeAll))
        .subscribe( info => {
          this.perfil = info;
        }); 
  }

  editarPerfil(): void{
    this.dialogRef = this._matDialog.open(PerfilFormDialogComponent, {
      panelClass: 'perfil-form-dialog',
      data: {
        perfil: this.perfil,
        action: 'edit'
      }
    });

    this.dialogRef.afterClosed()
      .subscribe(response => {
        if (!response) {
          return;
        }
        const actionType: string = response[0];
        const formData: FormGroup = response[1];
        switch (actionType) {
          /**
           * Save
           */
          case 'save':

            // this._contactsService.updateContact(formData.getRawValue());

            break;
        }
      });
  }

}
