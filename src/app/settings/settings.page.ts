import { Component, OnInit } from "@angular/core";
import { ActionSheetController } from "@ionic/angular";
import { Plugins } from "@capacitor/core";
import { Router } from "@angular/router";
import { AuthenticationService } from "../providers/auth.service";
@Component({
  selector: "app-settings",
  templateUrl: "./settings.page.html",
  styleUrls: ["./settings.page.scss"],
})
export class SettingsPage implements OnInit {
  constructor(
    private router: Router,
    private actionSheetController: ActionSheetController,
    private authService: AuthenticationService
  ) {}

  ngOnInit() {}

  // logout() {
  //   console.log("logging out");
  // }
  async logout(): Promise<void> {
    this.authService.logout();
    console.log("Logging out !");
    this.router.navigate(["login"]);
  }

  async presentActionSheet() {
    const actionSheet = await this.actionSheetController.create({
      header: "Change Profile Photo",
      cssClass: "my-custom-class",
      buttons: [
        {
          text: "Use Camera",
          icon: "camera-outline",
          handler: () => {
            console.log("camera clicked");
          },
        },
        {
          text: "Select From Library",
          icon: "images-outline",
          handler: () => {
            console.log("Select From Library clicked");
          },
        },
        {
          text: "Cancel",
          icon: "close",
          role: "cancel",
          handler: () => {
            console.log("Cancel clicked");
          },
        },
      ],
    });
    await actionSheet.present();
  }
}
