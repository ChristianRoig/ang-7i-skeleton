import { Component, OnDestroy, OnInit, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef, MatTableDataSource } from '@angular/material';
import { DataSource } from '@angular/cdk/collections';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Router } from '@angular/router';

import { fuseAnimations } from '@fuse/animations';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';

import { ComprobantesService } from '../comprobantes.service';
// import { GastoFormDialogComponent } from '../gastos-form/gastos-form.component';
import { Gasto } from '../gasto.model';
import { PersonasService } from 'app/main/personas/personas.service';
import { GastoFormDialogComponent } from '../gastos-form/gastos-form.component';

export class Group {
    level: number = 0;
    parent: Group;
    expanded: boolean = true;
    get visible(): boolean {
      return !this.parent || (this.parent.visible && this.parent.expanded);
    }
  }

@Component({
    selector     : 'gasto-list',
    templateUrl  : './gasto-list.component.html',
    styleUrls    : ['./gasto-list.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations   : fuseAnimations
})
export class GastoListComponent implements OnInit, OnDestroy
{
    @ViewChild('dialogContent')
    dialogContent: TemplateRef<any>;

    entidad: string;
    rolPersona: string;
    
    gastos: Gasto[] = [];
    user: any;
    // dataSource: FilesDataSource | null;
    dataSource = new MatTableDataSource< Gasto | Group>([]);
    displayedColumns = ['checkbox', 'avatar', 'proveedor', 'fecha', 'descripcion', 'comprobante', 'estado', 'importe', 'buttons']; 
    groupByColumn: string[] = ['periodo'];

   // displayedColumns = ['checkbox', 'avatar', 'name', 'email', 'phone', 'jobTitle'];
    selectedContacts: any[];
    checkboxes: {};
    dialogRef: any;
    confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;

    // Private
    private _unsubscribeAll: Subject<any>;

    /**
     * Constructor
     *
     * @param {ComprobantesService} _comprobantesService
     * @param {MatDialog} _matDialog
     */
    constructor(
        private _personasService: PersonasService,
        private _comprobantesService: ComprobantesService,
        public _matDialog: MatDialog,
        private router: Router
    )
    {
      this.entidad    = ComprobantesService.ENTIDAD; 
      this.rolPersona = ComprobantesService.ROL_PERSONA; 

      // Set the private defaults
        this._unsubscribeAll = new Subject();
        
/*         this.dataSource.data = this.addGroups(Gastos.gastos, this.groupByColumn);
        this.dataSource.filterPredicate = this.customFilterPredicate.bind(this); */
    }

    ngOnInit(): void {
      this._comprobantesService.onGastosChanged
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe(gastos => {
          this.gastos = gastos;
          this.checkboxes = {};
          gastos.map(gasto => {
            this.checkboxes[gasto.id] = false;
          });
          this.dataSource.data = this.addGroups(this.gastos, this.groupByColumn);
          this.dataSource.filterPredicate = this.customFilterPredicate.bind(this);
        });
    }

    customFilterPredicate(data: Gasto | Group, filter: string): boolean {
      return (data instanceof Group) ? data.visible : this.getDataRowVisible(data);
    }

    getDataRowVisible(data: Gasto): boolean {
      const groupRows = this.dataSource.data.filter(
        row => {
          if (!(row instanceof Group)) 
              { return false; }
          
          let match = true;
          this.groupByColumn.forEach(
            column => {
              if (!row[column] || !data[column] || row[column] !== data[column]) 
                  { match = false; }
            }
          );
          return match;
        }
      );
    
      if (groupRows.length === 0) { return true; }
      if (groupRows.length > 1) { throw 'Data row is in more than one group!'; }

      const parent = <Group>groupRows[0];  // </Group> (Fix syntax coloring)
    
      return parent.visible && parent.expanded;
    }

    groupHeaderClick(row) {
      row.expanded = !row.expanded;
      this.dataSource.filter = performance.now().toString();  // hack to trigger filter refresh
    }
    
    addGroups(data: any[], groupByColumns: string[]): any[] {
      var rootGroup = new Group();
      return this.getSublevel(data, 0, groupByColumns, rootGroup);
    }

    getSublevel(data: any[], level: number, groupByColumns: string[], parent: Group): any[] {
      // Recursive function, stop when there are no more levels. 
      if (level >= groupByColumns.length) {
        return data;
      }
  
      var groups = this.uniqueBy(
        data.map(
          row => {
            var result = new Group();
            result.level = level + 1;
            result.parent = parent;
            for (var i = 0; i <= level; i++) {
              result[groupByColumns[i]] = row[groupByColumns[i]];
            }
            return result;
          }
        ),
        JSON.stringify);
  
      const currentColumn = groupByColumns[level];
    
      var subGroups = [];
      groups.forEach(group => {
        let rowsInGroup = data.filter(row => group[currentColumn] === row[currentColumn]);
        let subGroup = this.getSublevel(rowsInGroup, level + 1, groupByColumns, group);
        subGroup.unshift(group);
        subGroups = subGroups.concat(subGroup);
      });
      return subGroups;
    }
    
    uniqueBy(a, key) {
      var seen = {};
      return a.filter(function (item) {
        var k = key(item);
        return seen.hasOwnProperty(k) ? false : (seen[k] = true);
      });
    }


    seeMore(): void {
      this._comprobantesService.obtenerMasComprobantes();
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void
    {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Edit contact
     *
     * @param contact
     */
    editGasto(gasto: Gasto): void{
        this.dialogRef = this._matDialog.open(GastoFormDialogComponent, {
            panelClass: 'gasto-form-dialog',
            data      : {
                action : 'edit',
                gasto: gasto,
                // contact : contacto
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

                        this._comprobantesService.updateContact(formData.getRawValue());

                        break;
                    /**
                     * Delete
                     */
                    case 'delete':

                        this.deleteGasto(gasto);

                        break;
                }
            });
    } 

    /**
     * Delete Contact
     */
    deleteGasto(gasto): void
    {
        this.confirmDialogRef = this._matDialog.open(FuseConfirmDialogComponent, {
            disableClose: false
        });

        this.confirmDialogRef.componentInstance.confirmMessage = 'Are you sure you want to delete?';

        this.confirmDialogRef.afterClosed().subscribe(result => {
            if ( result )
            {
                this._comprobantesService.deleteGasto(gasto);
            }
            this.confirmDialogRef = null;
        });

    }

    verGasto(gasto: Gasto): void
    {
      this.router.navigate(['/gastos',gasto.id]);
    }

    /**
     * On selected change
     *
     * @param contactId
     */
    onSelectedChange(contactId): void
    {
        this._comprobantesService.toggleSelectedContact(contactId);
    }

    /**
     * Toggle star
     *
     * @param contactId
     */
    toggleStar(contactId): void
    {
        if ( this.user.starred.includes(contactId) )
        {
            this.user.starred.splice(this.user.starred.indexOf(contactId), 1);
        }
        else
        {
            this.user.starred.push(contactId);
        }

     //    this._comprobantesService.updateUserData(this.user);     
    }

    isGroup(index, item): boolean{
        return item.level;
      }

}

export class FilesDataSource extends DataSource<any>
{
    /**
     * Constructor
     *
     * @param {PersonasService} _personasService
     */
    constructor(
        private _comprobantesService: ComprobantesService
    )
    {
        super();
    }

    /**
     * Connect function called by the table to retrieve one stream containing the data to render.
     * @returns {Observable<any[]>}
     */
    connect(): Observable<any[]>
    {
        return this._comprobantesService.onGastosChanged;
    }

    /**
     * Disconnect
     */
    disconnect(): void
    {
    }
}
