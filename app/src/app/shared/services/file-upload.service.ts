import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})

export class FileUploadService {
  constructor(protected http: HttpClient) {}

  getPreSignedUrlForBlogImageVideo(data: any) {
    return this.http.get<any>(
      environment.apiURL + `/assets/blogs/cover-asset`,
      {
        params: data,
      }
    );
  }

  getPreSignedUrl(data: any) {
    return this.http.get<any>(
      environment.apiURL + `/assets/get/presigned-url`,
      {
        params: data,
      }
    );
  }

  uploadFile(url: string, file: any) {
    return this.http.put<any>(url, file);
  }

  getProfilePicPreSignedUrl(data: any) {
    return this.http.get<any>(
      environment.apiURL + `/assets/get/users/profile/presigned-url`,
      {
        params: data,
      }
    );
  }

  getDealerDocPreSignedUrl(data: any) {
    return this.http.get<any>(
      environment.apiURL + `/assets/get/dealer/presigned-url`,
      {
        params: data,
      }
    );
  }

  getBankRecepitPreSignedUrl(data: any) {
    return this.http.get<any>(
      environment.apiURL + `/assets/upload-bank-receipt-url`,
      {
        params: data,
      }
    );
  }

  getVehicleProcedurePreSignedUrl(data: any) {
    return this.http.get<any>(environment.apiURL + `/assets/vps`, {
      params: data,
    });
  }

  getExpertDocPreSignedUrl(data: any) {
    return this.http.get<any>(
      environment.apiURL + `/assets/expert/document/presigned-url`,
      {
        params: data,
      }
    );
  }

  //pass the url of pdf or images
  downloadFile(url: string) {
    return this.http.get(url, { responseType: 'blob' });
  }

  getExpertBankReceiptPreSignedUrl(data: any) {
    return this.http.get<any>(
      environment.apiURL + `/assets/expert-reviews/upload-bank-receipt-url`,
      {
        params: data,
      }
    );
  }

  getHomePageImagesPreSignedUrl(data: any) {
    return this.http.get<any>(
      environment.apiURL + `/assets/static/page-asset`,
      {
        params: data,
      }
    );
  }

  getLoanDocumentPreSignedUrl(data: any) {
    return this.http.get<any>(environment.apiURL + `/assets/loans/documents`, {
      params: data,
    });
  }
}
