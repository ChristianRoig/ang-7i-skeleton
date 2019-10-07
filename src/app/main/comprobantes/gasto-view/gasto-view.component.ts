import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { ComprobantesService } from '../comprobantes.service';
import { Gasto } from '../gasto.model';

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

  constructor( private _comprobantesService: ComprobantesService,        
               private activatedRoute: ActivatedRoute) {                  
        this.imagen = 'assets/images/avatars/profile.jpg';    
   }

  ngOnInit(): void {
      this.activatedRoute.params.subscribe(params => {
        this.gasto = this._comprobantesService.getGasto(params['id']);

        this.imagen = this.gasto.contacto_avatar;
      });
  }

}
