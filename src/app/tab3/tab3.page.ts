import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { AuthenticationService } from "../providers/auth.service";

@Component({
  selector: "app-tab3",
  templateUrl: "tab3.page.html",
  styleUrls: ["tab3.page.scss"],
})
export class Tab3Page {
  constructor(
    private router: Router,
    public authService: AuthenticationService
  ) {}

  viewSettings() {
    this.router.navigate(["settings"]);
  }
}
