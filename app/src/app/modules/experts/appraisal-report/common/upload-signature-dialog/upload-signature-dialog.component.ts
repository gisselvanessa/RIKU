import { Component, ElementRef, EventEmitter, HostListener, Input, OnInit, Output, ViewChild } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-upload-signature-dialog',
  templateUrl: './upload-signature-dialog.component.html',
  styleUrls: ['./upload-signature-dialog.component.scss']
})

export class UploadSignatureDialogComponent implements OnInit {

  loading: boolean = false;
  public selectedSignatureType: string = 'choose';
  @ViewChild('signPad') signPad: ElementRef;
  @ViewChild('blank') blank: ElementRef;
  @Input('type') type: string;
  @Input('editSignInitObj') editSignInitObj: { Signature: null, InitialsOfName: null };
  @Output() getRecentSignature: EventEmitter<boolean> = new EventEmitter();
  private signPadElement: any;
  private signContext: any;
  private initialContext: any;
  private isDrawing = false;
  public currentFontFamily: string | null;
  public previewSignature: any;
  public previewInitial: any;
  public removeScroll: boolean = false;
  public contactId: Number;
  public fontFamily = ["Rochester", "Dancing Script", "Seaweed Script", "Sacramento", "Kaushan Script"];

  expertName: string | null;
  public active = 1;
  signatureImage: any;

  constructor(public activeModal: NgbActiveModal) { }

  ngOnChanges() {

  }

  ngOnInit() {
    //signature pad
    this.expertName = localStorage.getItem('expert_name');
    setTimeout(() => {
      this.signPadElement = this.signPad.nativeElement;
      this.signContext = this.signPadElement.getContext('2d');
      this.signContext.lineWidth = 1;
    }, 1000);
  }

  @HostListener('document:mouseup', ['$event'])
  private onMouseUp(e: any) {
    this.isDrawing = false;
  }

  public TouchEnd() {
    this.isDrawing = false;
    this.removeScroll = false;
  }

  public onMouseDown(e: any, type: string) {
    this.isDrawing = true;
    const coords = this.relativeCoords(e);
    if (type == 'sign') {
      this.signContext.moveTo(coords.x, coords.y);
    } else {
      this.initialContext.moveTo(coords.x, coords.y);
    }
  }

  public onTouchStart(e: any, type: string) {
    this.removeScroll = true;
    this.isDrawing = true;
    const coords = this.relativeCoordsTouch(e);
    if (type == 'sign') {
      this.signContext.moveTo(coords.x, coords.y);
    } else {
      this.initialContext.moveTo(coords.x, coords.y);
    }
  }

  public onMouseMove(e: any, type: string) {
    if (this.isDrawing) {
      const coords = this.relativeCoords(e);
      if (type == 'sign') {
        this.signContext.lineTo(coords.x, coords.y);
        this.signContext.stroke();
      }
    }
  }

  public onTouchMove(e: any, type: string) {
    if (this.isDrawing) {
      const coords = this.relativeCoordsTouch(e);
      if (type == 'sign') {
        this.signContext.lineTo(coords.x, coords.y);
        this.signContext.stroke();
      }
    }
  }

  private relativeCoords(event: any) {
    const bounds = event.target.getBoundingClientRect();
    const x = event.clientX - bounds.left;
    const y = event.clientY - bounds.top;
    return { x: x, y: y };
  }

  private relativeCoordsTouch(event: any) {
    const bounds = event.target.getBoundingClientRect();
    const x = event['changedTouches'][0].clientX - bounds.left;
    const y = event['changedTouches'][0].clientY - bounds.top;
    return { x: x, y: y };
  }

  public clearCanvas(type: string) {
    if (type == 'sign') {
      if(this.signContext){
        this.signContext.clearRect(0, 0, this.signPadElement.width, this.signPadElement.height);
        this.signContext.clearRect(0, 0, this.signPadElement.width, this.signPadElement.height);
        this.signContext.beginPath();
      }
    }

  }

  public selectSignatureType(type: string) {
    this.selectedSignatureType = type;
    this.clearCanvas('sign');
    this.currentFontFamily = null;
    this.previewSignature = null;
  }

  public onCreate() {
    if (this.selectedSignatureType == 'draw') {
      const signatureImg = this.signPadElement.toDataURL("image/png");
      this.postSignature(signatureImg);
    } else if (this.selectedSignatureType == 'choose') {
      if (this.expertName) {
        const signatureImg = this.getTextToImage(this.expertName);
        this.postSignature(signatureImg);
      }
    } else {
      this.postSignature(this.previewSignature);
    }
  }

  private getTextToImage(text: string) {
    const signPadElement = this.signPad.nativeElement;
    const signContext = signPadElement.getContext('2d');
    signContext.font = `normal 48px ${this.currentFontFamily}`;
    signContext.canvas.width = signContext.measureText(text).width + 30;
    signContext.canvas.lineHeight = signContext.measureText(text).lineHeight;
    signContext.font = `normal 48px ${this.currentFontFamily}`;
    signContext.fillStyle = 'black';
    signContext.fillText(text, 10, 100);
    return signContext.canvas.toDataURL();
  }

  public disableCreateBtn(): boolean {
    // if (this.type == 'Create') {
    if (this.selectedSignatureType == 'draw') {
      if ((this.blank.nativeElement.toDataURL("image/png") !== this.signPadElement.toDataURL("image/png"))) {
        return false;
      } else {
        return true;
      }
    } else if (this.selectedSignatureType == 'choose') {
      if (this.expertName) {
        if (this.currentFontFamily) {
          return false;
        } else {
          return true;
        }
      } else {
        return true;
      }
    } else {
      if (this.previewSignature) {
        return false;
      } else {
        return true;
      }
    }
    // } else {
    //   return false;
    // }
  }

  public uploadFile(event: any, type: any) {
    if (event.target.files && event.target.files[0]) {
      const reader: any = new FileReader();
      reader.readAsDataURL(event.target.files[0]);
      reader.onload = () => {
        const img = new Image();
        img.src = reader.result.toString();
        img.onload = () => {
          const elem = document.createElement('canvas');
          elem.width = 240;
          elem.height = 150;
          const ctx: any = elem.getContext('2d');
          ctx.drawImage(img, 0, 0, 240, 150);
          if (type == 'sign') {
            this.previewSignature = elem.toDataURL();
          } else {
            this.previewInitial = elem.toDataURL();
          }
        }
      };
    }
  }

  public postSignature(signatureImage: any) {
    this.signatureImage = signatureImage;
    this.loading = false;
    this.activeModal.close({signUrl: signatureImage, signKey:  signatureImage});
    // this.datasharingService.setShowLoader(true);
    // this.contractService.postCustomerSignature(obj).subscribe(res => {
    //   this.datasharingService.setShowLoader(false);
    //   if (res == 'Success') {
    //     this.toastr.success(`Signature ${this.type}d Successfully!`, 'Success');
    //     document.getElementById("closeModalButton").click();
    //     this.getRecentSignature.emit(true);
    //   } else {
    //     this.toastr.error('Something went wrong!', 'Error');
    //   }
    // });

  }

}
