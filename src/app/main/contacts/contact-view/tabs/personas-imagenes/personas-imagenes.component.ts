import { Component, OnInit, Input } from '@angular/core';
import { Contact } from '../../../contact.model';

@Component({
  selector: 'personas-imagenes',
  templateUrl: './personas-imagenes.component.html',
  styleUrls: ['./personas-imagenes.component.scss']
})
export class PersonasImagenesComponent implements OnInit {

  @Input() proveedor: Contact;

  constructor() { }

  ngOnInit(): void {
  }

}
