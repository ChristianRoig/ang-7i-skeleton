import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { PerfilService } from './perfil.service';
import { Contact } from '../contacts/contact.model';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';


@Component({
  selector: 'perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations   : fuseAnimations
})
export class PerfilComponent implements OnInit {

  perfil : Contact;
  private _unsubscribeAll: Subject<any>;



  constructor( private perfilService: PerfilService) { 
    this._unsubscribeAll = new Subject();

  }

  ngOnInit() {

    this.perfilService.infoOnChanged.pipe(
      takeUntil(this._unsubscribeAll))
        .subscribe( info => {
          this.perfil = info;
        });
    
  }

}
