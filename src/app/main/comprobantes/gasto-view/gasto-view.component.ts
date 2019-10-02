import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { GastosService } from '../gastos.service';
import { Gasto } from '../gasto.model';
import { Contact } from 'app/main/personas/contact.model';
import { ContactsService } from 'app/main/personas/contacts.service';

@Component({
  selector: 'gasto-view',
  templateUrl: './gasto-view.component.html',
  styleUrls: ['./gasto-view.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations   : fuseAnimations
})
export class GastoViewComponent implements OnInit {

  gasto : Gasto
  contacto : Contact

  constructor(private _gastosService: GastosService,
    private _contactService : ContactsService,
    private activatedRoute: ActivatedRoute) {
      this.activatedRoute.params.subscribe(params => {
        this.gasto = this._gastosService.getGasto(params['id'])
        this.contacto = this._contactService.getContactos().find(element => element.id == this.gasto.contacto_id);
      })
   }

  ngOnInit() {
  }

  

}
