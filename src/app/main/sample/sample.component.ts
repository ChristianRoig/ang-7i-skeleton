import { Component } from '@angular/core';

import { AuthService } from '../authentication/services/auth.service';

@Component({
    selector   : 'sample',
    templateUrl: './sample.component.html',
    styleUrls  : ['./sample.component.scss']
})
export class SampleComponent
{
    /**
     * Constructor
     *
     */
    constructor( public auth: AuthService )
    {        
    }
}
