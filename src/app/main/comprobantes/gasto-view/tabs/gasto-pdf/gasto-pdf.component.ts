import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { PDFProgressData } from 'ng2-pdf-viewer';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-gasto-pdf',
  templateUrl: './gasto-pdf.component.html',
  styleUrls: ['./gasto-pdf.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class GastoPdfComponent implements OnInit {

  img = null;
  pdfSrc = null;
  private type = null;
  private name = null;

  default = 'assets/images/no-img.png';  

  constructor(private _cookieService: CookieService, private _httpClient: HttpClient) { }

  ngOnInit(): void {
  }

  cargarArchivo(event): void{    
    const fileList: FileList = event.target.files;
    
    if (fileList.length > 0) {
      const fileReader = new FileReader();
      const file = fileList[0];
      
      // console.log(file);
      this.type = file.type;
      this.name = file.name;

      if (this.type !== 'application/pdf') {
        fileReader.onload = (e: any) => {
          this.img = fileReader.result.toString();
          this.pdfSrc = null;

          this.enviarArchivo(); // Solo lo llamo desde aca, en el caso del pdf lo hago cuando este completa la carga
        };
        fileReader.readAsDataURL(file);        
      }else{
        fileReader.onload = (e: any) => {
          this.pdfSrc = e.target.result;
          this.img = null;
        };
        fileReader.readAsArrayBuffer(file);
      }      
    }
  }

  onError(error: any): void {
    console.log(error);
    this.pdfSrc = null;
  }

  onProgress(progressData: PDFProgressData): void {
    console.log(progressData);
    // do anything with progress data. For example progress indicator
  }

  enviarArchivo(): void {
    
    return; // Descomentar

    let fileData = null;

    if (this.pdfSrc) {
      fileData = new Blob([this.pdfSrc], { type: this.type });
    }else{
      fileData = new Blob([this.img], { type: this.type }); 
      // this.img.toString();
    }

    console.log(fileData);

    
    const url = 'http://10.100.58.83:8082/uploadFile';

    let httpHeaders = new HttpHeaders({
      'Authorization': this._cookieService.get('tokenAuth')
    });

    const formData = new FormData();
    formData.append('file', fileData, this.name);

    let body = formData;

    let options = {
      headers: httpHeaders
    };

    this._httpClient.post(url, body, options).subscribe(
      (res) => {
        console.log('jojo res');
      },
      (error) => {
        console.log(error);
      }
    );
  }





}
