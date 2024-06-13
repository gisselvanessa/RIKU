import {
  Component,
  OnInit,
  OnChanges
} from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { AuthService } from "./shared/services/auth.service";
import { NavigationService } from "./shared/services/navigation.service";
import { UserService } from "./shared/services/user.service";

declare var window: any;

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})

export class AppComponent implements OnInit, OnChanges {
  title = "Riku";
  isLoggedIn: boolean = false;
  userType: string;
  isProductionDomain: boolean = false;
  // @HostListener('window:popstate', ['$event'])
  // onPopState(event: any) {
  // }
  subsribeLoggedIn: any;
  constructor(
    public translate: TranslateService,
    private authService: AuthService,
    private userService: UserService,
    public navigation: NavigationService
  ) {
    translate.addLangs(["en", "es"]);
    translate.setDefaultLang("es");
  }

  ngOnInit() {
    this.subsribeLoggedIn = this.authService.isLoggedIn.subscribe((res) => {
      const isLoggedIn = res ? true : false;
      if (this.isLoggedIn != isLoggedIn) {
        this.authService.changeLoggedIn(this.isLoggedIn);
        // this.subsribeLoggedIn.unsubscribe();
      }
      this.isLoggedIn = isLoggedIn ? true : localStorage.getItem("access_token") ? true : false;
      this.userType = this.userService.getUserType();
    });
    const currentDomain = window.location.hostname;
    if (currentDomain == "qajak.internetsoft.com") {
      this.isProductionDomain = true;
      this.translate.setDefaultLang("es");
    } else if (currentDomain == "devjak.internetsoft.com") {
      this.isProductionDomain = true;
      this.translate.setDefaultLang("en");
    } else if (currentDomain == "rikusa.com") {
      this.isProductionDomain = true;
      this.translate.setDefaultLang("es");
    }
  }

  ngOnChanges(): void {
  }

  switchLang(lang: string) {
    this.translate.use(lang);
  }
}
