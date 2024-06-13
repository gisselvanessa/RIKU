import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { DeleteDocumentDialogComponent } from 'src/app/shared/component/add-update-vehicle-procedure/delete-document-dialog/delete-document-dialog.component';
import { getFileType } from 'src/app/shared/helpers/file-helper';
import { FileUploadService } from 'src/app/shared/services/file-upload.service';

@Component({
  selector: 'app-documents',
  templateUrl: './documents.component.html',
  styleUrls: ['./documents.component.scss']
})
export class DocumentsComponent implements OnInit {

  @Input() vehicleProcedureData: any;
  @Input() vehicleProcedureId: string;
  @Input() isCompleted: boolean = true;
  @Input() stepsStepper: any;
  @Input() step: any;
  @Output() deletedData: EventEmitter<any> = new EventEmitter();
  constructor(
    private http: HttpClient,
    private toastr:ToastrService,
    private modalService: NgbModal,
    private fileUploadService:FileUploadService,
    private translate:TranslateService
  ) { }

  ngOnInit(): void {
  }

  getFileType(url: string) {
    return getFileType(url);
  }

  public deleteDocument(id:string, index:number){

    const modalRef = this.modalService.open(DeleteDocumentDialogComponent, {
      windowClass: 'delete-document-modal',
      backdrop: 'static',
      keyboard: false
    })

    modalRef.componentInstance.vehicleProcedureId = this.vehicleProcedureId;
    modalRef.componentInstance.documentType = this.stepsStepper[this.step].stepValue;
    modalRef.componentInstance.documentId = id;

    modalRef.result.then((isDeleted) => {
      this.deletedData.emit(this.vehicleProcedureData.assets);
      if (isDeleted) {
        this.vehicleProcedureData.assets.splice(index, 1);
        if(this.vehicleProcedureData.assets.length){
          this.deletedData.emit(this.vehicleProcedureData);
        }else{
          this.deletedData.emit([]);
        }
        const message = this.translate.instant("Document deleted successfully!!")
        this.toastr.success(message);
      }
    }).catch((error: any) => {
    });
  }

  fileName(image:string){
    return image.substring(image.lastIndexOf('/')+1)
  }

  downloadFile(url:string){
    const filename = this.fileName(url);
    this.fileUploadService.downloadFile(url).subscribe((response: any) => {
      const blob: any = new Blob([response], { type: 'application/octet-stream' });
      const a = document.createElement('a');
      const objectUrl = URL.createObjectURL(blob);
      a.href = objectUrl;
      a.download = filename;
      a.click();
      URL.revokeObjectURL(objectUrl);
    });
  }
}
