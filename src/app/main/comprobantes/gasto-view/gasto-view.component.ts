import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { ComprobantesService } from '../comprobantes.service';
import { Gasto } from '../gasto.model';
// import { Contact } from 'app/main/personas/contact.model';
// import { PersonasService } from 'app/main/personas/personas.service';

@Component({
  selector: 'gasto-view',
  templateUrl: './gasto-view.component.html',
  styleUrls: ['./gasto-view.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations   : fuseAnimations
})
export class GastoViewComponent implements OnInit {

  gasto: Gasto;
  imagen: string;
  
  // private contacto: Contact;

  constructor(
        private _comprobantesService: ComprobantesService,
        // private _contactService: PersonasService,
        private activatedRoute: ActivatedRoute) {                  
          this.imagen = 'assets/images/avatars/profile.jpg';    
   }

  ngOnInit(): void {
      this.activatedRoute.params.subscribe(params => {
        this.gasto = this._comprobantesService.getGasto(params['id']);
  
        // Esto esta re contra mal!! tendria que tener un join en el back que anide la imagen al gasto
        // this.contacto = this._contactService.getContactos().find(element => element.id === this.gasto.contacto_id);
  
  
  
        // if (this.contacto) {
        //   this.imagen = this.contacto.file_link;
        // }
  
      });
  }

}
