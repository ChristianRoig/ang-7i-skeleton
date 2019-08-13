import { Component } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';

@Component({
  selector: 'file-upload',
  templateUrl: './file-upload.component.html',
})
export class FileUploadComponent {
  title = 'test-image-upload';

  private value: string;
  private changeListener: Function;

  fileData = null;

  constructor( private http: Http) {
    
  }

  fileProgress(fileInput: any) {
    this.fileData = <File>fileInput.target.files[0];
  }
 
  onSubmit() {
    const formData = new FormData();
    formData.append('file', this.fileData, this.fileData.name);
    const headers = new Headers({});
    let options = new RequestOptions({ headers });
    this.http.post('http://10.100.58.83:8082/pymex/uploadImage', formData, {
  })
  .subscribe(events => { })
  }

  fileChange(event): void {
    const fileList: FileList = event.target.files;
    if (fileList.length > 0) {
        const file = fileList[0];
        const formData = new FormData();
        formData.append('file', file, file.name);
        const headers = new Headers({});
        let options = new RequestOptions({ headers });
        this.http.post('http://10.100.58.83:8082/pymex/uploadImage', formData, options).subscribe(res => {
          let body = res.json();
          this.value = body.filename;
    
          if (this.changeListener) {
            this.changeListener(this.value);
          }
        });
    }
  }

}
