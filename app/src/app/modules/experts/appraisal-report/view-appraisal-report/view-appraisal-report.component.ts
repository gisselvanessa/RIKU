import { Location } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { ToastrService } from 'ngx-toastr';
import { Error } from 'src/app/shared/models/error.model';
import { ExpertsService } from '../../experts.service';
import { PageName } from '../report.mode';
import { TranslateService } from '@ngx-translate/core';


@Component({
  selector: 'app-view-appraisal-report',
  templateUrl: './view-appraisal-report.component.html',
  styleUrls: ['./view-appraisal-report.component.scss']
})

export class ViewAppraisalReportComponent implements OnInit {

  @ViewChild('reportPdf')
  reportPdf!: ElementRef;
  constructor(private activatedRoute: ActivatedRoute,
    private expertService: ExpertsService, private toastr: ToastrService, private location: Location, private translate: TranslateService) { }
  appraisallDetails: any = {};
  appraisallId: any;
  selectAccordian: any = '';
  mydetails: any;
  vehicleInfo: any;
  page = PageName;
  loading = false;

  ngOnInit(): void {
    this.appraisallId = this.activatedRoute.snapshot.paramMap.get('id');
    this.getAppraisalReport();
  }

  back() {
    this.location.back()
  }

  getAppraisalReport(): void {
    this.expertService.getAppraisalDetails(this.appraisallId).subscribe({
      next: (res: any) => {
        this.loading = true;
        this.appraisallDetails = res.data;

        if (this.appraisallDetails.my_details != null) {
          this.mydetails = this.appraisallDetails.my_details
        }
        if (this.appraisallDetails.vehicle_info != null) {
          this.vehicleInfo = this.appraisallDetails.vehicle_info
        }

      },
      error: (errorRes: Error) => {
        this.loading = true;
        const error = errorRes.error;
        this.appraisallDetails = {};
        if (error?.error_code !== "APPRAISAL_REPORT_DETAILS_NOT_FOUND") {
          if (error?.error?.length) {
            this.toastr.error(error.error[0]);
          } else {
            this.toastr.error(this.translate.instant('Something Went Wrong Please Try again later'));
          }
        }
      }
    })
  }

  selectedAccordian(accordianName: any) {
    this.selectAccordian = accordianName;
  }


  download() {
    // html2canvas(this.reportPdf.nativeElement, { useCORS: true, scale: 2 }).then((successRef: any) => {
    //   // const totalPages = Math.ceil(successRef.height / 1050);
    //   var doc = new jsPDF('p', 'mm', 'a4');

    //   var img = successRef.toDataURL('image/png;base64');
    //   const bufferX = 5;
    //   const bufferY = 5;
    //   const imgProps = (<any>doc).getImageProperties(img);
    //   const pdfWidth = doc.internal.pageSize.getWidth() - 2 * bufferX;
    //   const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    //   doc.addPage([pdfWidth,
    //     pdfHeight], 'p')
    //   doc.addImage(
    //     img,
    //     'PNG',
    //     bufferX,
    //     bufferY,
    //     pdfWidth,
    //     pdfHeight,
    //     undefined,
    //     'FAST'
    //   );
    //   return doc;
    // })
    //   .then((doc: any) => doc.save(`appraisal_Report.pdf`));
    const htmlWidth = 425;
    const htmlHeight = 3500;
    const topLeftMargin = 35;
    let pdfWidth = htmlWidth + (topLeftMargin * 2);
    let pdfHeight = (pdfWidth * 1.5) + (topLeftMargin * 2);
    const canvasImageWidth = htmlWidth;
    const canvasImageHeight = htmlHeight;
    const totalPDFPages = Math.ceil(htmlHeight / pdfHeight) - 1;
    const data = this.reportPdf.nativeElement;
    html2canvas(data, { useCORS: true }).then((canvas: any) => {
      const imgData = canvas.toDataURL("image/png;base64",1.0);
      let pdf = new jsPDF('p', 'mm', [pdfWidth, pdfHeight],true);
      pdf.addImage(imgData, 'PNG', topLeftMargin, topLeftMargin, canvasImageWidth, canvasImageHeight);
      for (let i = 1; i <= totalPDFPages; i++) {
        pdf.addPage([pdfWidth, pdfHeight], 'p');
        pdf.addImage(imgData, 'PNG', topLeftMargin, - (pdfHeight * i) + (topLeftMargin * 4), canvasImageWidth, canvasImageHeight);
      }
      pdf.save(`appraisal-report-${new Date().toLocaleString()}.pdf`);
    });












  }

}
