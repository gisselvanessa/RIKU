import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from '../app/app-routing.module';
import { HttpClient, HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BsDatepickerModule, BsLocaleService } from 'ngx-bootstrap/datepicker';
import { defineLocale } from 'ngx-bootstrap/chronos';
import { esLocale } from 'ngx-bootstrap/locale';
import { ToastrModule } from 'ngx-toastr';
import { HomeComponent } from './modules/home/home.component';
import { NgxIntlTelInputModule } from 'ngx-intl-tel-input';
import { NgOtpInputModule } from 'ng-otp-input';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { NgSelectModule } from '@ng-select/ng-select';
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { GooglePlaceModule } from 'ngx-google-places-autocomplete';
import { ShareButtonsModule } from 'ngx-sharebuttons/buttons';
import { ShareIconsModule } from 'ngx-sharebuttons/icons';
import { CommonModule } from '@angular/common';
import { NgxCaptchaModule } from 'ngx-captcha';
import { SwiperModule } from 'swiper/angular';

import { AdminModule } from './modules/admin/admin.module';
import { SharedModule } from './shared/shared.module';

import { JwtTokenCheckInterceptorInterceptor } from "./interceptors/jwt-token-check-interceptor.interceptor";
import { AuthGuard } from "./guards/auth.guard";

import { UserPermissionService } from './shared/services/user-permission.service';
import { AuthService } from "./shared/services/auth.service";

import { AppComponent } from './app.component';
import { NotFoundComponent } from './modules/not-found/not-found.component';

import { HeaderComponent } from './layout/header/header.component';
import { SidebarComponent } from './layout/sidebar/sidebar.component';
import { FooterComponent } from './layout/footer/footer.component';
import { NotificationComponent } from './layout/notification/notification.component';

import { AboutUsComponent } from './modules/about-us/about-us.component';
import { IWantToSellComponent } from './modules/i-want-to-sell/i-want-to-sell.component';
import { ComingSoonComponent } from './modules/coming-soon/coming-soon.component';
import { FilterHomeComponent } from './modules/home/filter-home/filter-home/filter-home.component';
defineLocale('es', esLocale);

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    NotFoundComponent,
    FooterComponent,
    HeaderComponent,
    SidebarComponent,
    AboutUsComponent,
    IWantToSellComponent,
    NotificationComponent,
    ComingSoonComponent,
    FilterHomeComponent,
  ],
  imports: [
    BrowserModule,
    GooglePlaceModule,
    AppRoutingModule,
    NgSelectModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    BsDatepickerModule.forRoot(),
    ToastrModule.forRoot(),
    NgxIntlTelInputModule,
    NgOtpInputModule,
    FontAwesomeModule,
    NgbModule,
    SwiperModule,
    AdminModule,
    ShareButtonsModule,
    ShareIconsModule,
    CommonModule,
    NgxCaptchaModule,
    SharedModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: httpTranslateLoader,
        deps: [HttpClient]
      }
    })
  ],
  providers: [AuthService, UserPermissionService, AuthGuard, { provide: HTTP_INTERCEPTORS, useClass: JwtTokenCheckInterceptorInterceptor, multi: true }],
  bootstrap: [AppComponent],
})

export class AppModule {
  constructor(private bsLocaleService: BsLocaleService) {
    this.bsLocaleService.use('es'); //fecha en español, datepicker
  }
}

// AOT compilation support
export function httpTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http);
}
