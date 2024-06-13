import { NgModule } from '@angular/core';
import { OnlyNumber, PriceDirective } from './directives/only-number.directive';
import { AlphaNumeric } from './directives/alpha-numeric.directive';
import { FilterPipe } from './pipes/filter.pipe';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgxIntlTelInputModule } from 'ngx-intl-tel-input';
import { NgOtpInputModule } from 'ng-otp-input';
import { NgSelectModule } from '@ng-select/ng-select';
import { ToastrModule } from 'ngx-toastr';
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { DeleteConfirmationComponent } from './modals/delete-confirmation/delete-confirmation.component';
import { EmailPopupComponent } from './modals/email-popup/email-popup.component';
import { ForgotPasswordComponent } from './modals/forgot-password/forgot-password.component';
import { OtpVerificationComponent } from './modals/otp-verification/otp-verification.component';
import { ResetPasswordComponent } from './modals/reset-password/reset-password.component';
import { SuccessfullComponent } from './modals/successfull/successfull.component';
import { ValidateUserComponent } from './modals/validate-user/validate-user.component';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { RejectVehicleConfirmationComponent } from './modals/admin/reject-vehicle-confirmation/reject-vehicle-confirmation.component';
import { OrderByPipe } from './pipes/order-by.pipe';
import { SafePipe } from './pipes/safe.pipe';
import { SwiperGalleryComponent } from './modals/swiper-gallery/swiper-gallery.component';
import { SwiperModule } from 'swiper/angular';
import { OnlyAlphabetsWithoutSpace } from './directives/only-alphabets-without-space.directive';
import { OnlyAlphabets } from './directives/only-alphabets.directive';
import { OnlyDecimalNumber } from './directives/only-decimal-number.directive';
import { TwoDigitDecimaNumberDirective } from './directives/two-digit-decimal.directive';
import { DeleteUsertypeComponent } from './modals/admin/delete-usertype/delete-usertype.component';
import { UCWordsPipe } from './pipes/uc-words.pipe';
import { PaginationComponent } from './elements/pagination/pagination.component';
import { LoaderComponent } from './modals/loader/loader.component';
import { UserDetailsComponent } from './component/user-details/user-details.component';
import { EditConfirmationComponent } from './modals/edit-confirmation/edit-confirmation.component';
import { ChangePasswordComponent } from './modals/change-password/change-password.component';
import { EditProfileComponent } from './component/edit-profile/edit-profile.component';
import { ChangeEmailAndMobileComponent } from './modals/change-email-and-mobile/change-email-and-mobile.component';
import { OtpVerificationEditProfileComponent } from './modals/otp-verification-edit-profile/otp-verification-edit-profile.component';
import { NumberPlatePipe } from './pipes/number-plate.pipe';
import { ChatUserComponent } from './component/chat-user/chat-user.component';
import { CallComponent } from './component/call/call.component';
import { AddUpdateVehicleProcedureComponent } from './component/add-update-vehicle-procedure/add-update-vehicle-procedure.component';
import { DeleteDocumentDialogComponent } from './component/add-update-vehicle-procedure/delete-document-dialog/delete-document-dialog.component';
import { CancelProcedureDialogComponent } from './component/add-update-vehicle-procedure/cancel-procedure-dialog/cancel-procedure-dialog.component';

import { NgbDropdownModule, NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';
import { AlphaNumericWithoutSpace } from './directives/alpha-numeric-without-space.directive';
import { ExpertReviewComponent } from './component/expert-review/expert-review.component';
import { ProductServicesComponent } from './component/expert-review/product-services/product-services.component';
import { FindExpertComponent } from './component/expert-review/find-expert/find-expert.component';
import { ContactInformationComponent } from './component/expert-review/contact-information/contact-information.component';
import { SummaryComponent } from './component/expert-review/summary/summary.component';
import { PaymentComponent } from './component/expert-review/payment/payment.component';
import { VehicleInformationComponent } from './component/expert-review/vehicle-information/vehicle-information.component';
import { ExpertReviewDetailsComponent } from './component/expert-review-details/expert-review-details.component';
import { ExpertReviewListComponent } from './component/expert-review-list/expert-review-list.component';
import { CancelExpertReviewDetailsDialogComponent } from './component/expert-review-details/cancel-expert-review-details-dialog/cancel-expert-review-details-dialog.component';
import { DeleteVehicleDialogComponent } from './modals/delete-vehicle-dialog/delete-vehicle-dialog.component';
import { RemoveUnderscorePipe } from './pipes/remove-underscore.pipe';
import { LicensePipe } from './pipes/license.pipe';
import { CmsPageComponent } from './component/cms-page/cms-page.component';
import { TranslateModule } from '@ngx-translate/core';
import { ApplicantDocumentsComponent } from './component/applicant-documents/applicant-documents.component';
import { UsedVehicleProcedureComponent } from './component/add-update-vehicle-procedure/used-vehicle-procedure/used-vehicle-procedure.component';
import { NewVehicleProcedureComponent } from './component/add-update-vehicle-procedure/new-vehicle-procedure/new-vehicle-procedure.component';
import { ComingSoonComponent } from './modals/coming-soon/coming-soon.component';
import { SpanishNumber } from './pipes/spanish-number-format.pipe';
import { BecomeBuyerSellerComponent } from './modals/become-buyer-seller/become-buyer-seller.component';
import { PaymentConfirmationDialogComponent } from './modals/payment-confirmation-dialog/payment-confirmation-dialog.component';
import { CardPaymentInformationComponent } from './component/card-payment-information/card-payment-information.component';
import { PlanCardComponent } from './component/plan-card/plan-card.component';
import { PaymentDepositTransferComponent } from './component/payment-deposit-transfer/payment-deposit-transfer.component';

@NgModule({
  declarations: [
    ValidateUserComponent,
    ResetPasswordComponent,
    DeleteConfirmationComponent,
    EmailPopupComponent,
    ForgotPasswordComponent,
    OtpVerificationComponent,
    SuccessfullComponent,
    RejectVehicleConfirmationComponent,
    CmsPageComponent,
    ApplicantDocumentsComponent,
    UsedVehicleProcedureComponent,
    NewVehicleProcedureComponent,
    ComingSoonComponent,
    BecomeBuyerSellerComponent,
    PaymentConfirmationDialogComponent,
    SwiperGalleryComponent,
    DeleteUsertypeComponent,
    PaginationComponent,
    LoaderComponent,
    UserDetailsComponent,
    EditConfirmationComponent,
    ChangePasswordComponent,
    EditProfileComponent,
    ChangeEmailAndMobileComponent,
    OtpVerificationEditProfileComponent,
    ChatUserComponent,
    CallComponent,
    AddUpdateVehicleProcedureComponent,
    DeleteDocumentDialogComponent,
    CancelProcedureDialogComponent,
    ExpertReviewComponent,
    ProductServicesComponent,
    FindExpertComponent,
    ContactInformationComponent,
    SummaryComponent,
    PaymentComponent,
    VehicleInformationComponent,
    ExpertReviewDetailsComponent,
    ExpertReviewListComponent,
    CancelExpertReviewDetailsDialogComponent,
    DeleteVehicleDialogComponent,
    OnlyNumber,
    TwoDigitDecimaNumberDirective,
    AlphaNumeric,
    FilterPipe,
    OrderByPipe,
    SafePipe,
    OnlyAlphabetsWithoutSpace,
    OnlyAlphabets,
    OnlyDecimalNumber,
    UCWordsPipe,
    NumberPlatePipe,
    AlphaNumericWithoutSpace,
    RemoveUnderscorePipe,
    LicensePipe,
    SpanishNumber,
    PriceDirective,
    CardPaymentInformationComponent,
    PlanCardComponent,
    PaymentDepositTransferComponent
  ],
  exports: [
    OnlyNumber,
    TwoDigitDecimaNumberDirective,
    AlphaNumeric,
    FilterPipe,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    ValidateUserComponent,
    NgxIntlTelInputModule,
    NgOtpInputModule,
    NgSelectModule,
    BsDatepickerModule,
    ToastrModule,
    NgbModule,
    OrderByPipe,
    SafePipe,
    OnlyAlphabetsWithoutSpace,
    OnlyAlphabets,
    OnlyDecimalNumber,
    UCWordsPipe,
    PaginationComponent,
    LoaderComponent,
    UserDetailsComponent,
    EditProfileComponent,
    ChangePasswordComponent,
    NumberPlatePipe,
    CallComponent,
    ChatUserComponent,
    NgbDropdownModule,
    AddUpdateVehicleProcedureComponent,
    AlphaNumericWithoutSpace,
    ExpertReviewComponent,
    ProductServicesComponent,
    DeleteVehicleDialogComponent,
    RemoveUnderscorePipe,
    SpanishNumber,
    LicensePipe,
    PriceDirective,
    CmsPageComponent,
    ApplicantDocumentsComponent,
    UsedVehicleProcedureComponent,
    NewVehicleProcedureComponent,
    ComingSoonComponent,
    PaymentConfirmationDialogComponent,
    CardPaymentInformationComponent,
    PlanCardComponent
  ],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    NgxIntlTelInputModule,
    NgOtpInputModule,
    NgSelectModule,
    BsDatepickerModule,
    ToastrModule,
    NgbModule,
    NgbDropdownModule,
    NgbTypeaheadModule,
    SwiperModule,
    TranslateModule
  ]
})

export class SharedModule {
}
