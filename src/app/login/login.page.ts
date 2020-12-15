import { AuthenticationService } from './../providers/auth.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Plugins } from '@capacitor/core';
const { Storage } = Plugins;

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  constructor(
    private router: Router,
    private authService: AuthenticationService
  ) {}

  ngOnInit() {}

  login() {
    this.authService
      .facebookLogin()
      .then((res) => res && this.router.navigate(['tabs']));
  }
}
