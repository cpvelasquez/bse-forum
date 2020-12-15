import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { map, tap, switchMap } from "rxjs/operators";
import { BehaviorSubject, from, Observable, Subject } from "rxjs";

import { Plugins, registerWebPlugin } from "@capacitor/core";
import { FacebookLogin } from "@capacitor-community/facebook-login";
import { AngularFireAuth } from "@angular/fire/auth";
import * as firebase from "firebase/app";
import { IUser } from "../models/user.model";
const { Storage } = Plugins;

declare var FB: any;
window.fbAsyncInit = function () {
  FB.init({
    appId: "406695353837678",
    cookie: true, // enable cookies to allow the server to access the session
    xfbml: true, // parse social plugins on this page
    version: "v5.0", // use graph api current version
  });
};

// Load the SDK asynchronously
(function (d, s, id) {
  var js,
    fjs = d.getElementsByTagName(s)[0];
  if (d.getElementById(id)) return;
  js = d.createElement(s);
  js.id = id;
  js.src = "https://connect.facebook.net/en_US/sdk.js";
  fjs.parentNode.insertBefore(js, fjs);
})(document, "script", "facebook-jssdk");

const TOKEN_KEY = "my-token";
const USER_KEY = "user-key";

@Injectable({
  providedIn: "root",
})
export class AuthenticationService {
  // Init with null to filter out the first value in a guard!
  isAuthenticated = new BehaviorSubject<boolean>(null);
  token = "";
  currentUser: IUser;

  constructor(private http: HttpClient, private fireAuth: AngularFireAuth) {
    this.loadFirebaseToken();
  }

  async loadFirebaseToken() {
    const isAuthenticated = this.isAuthenticated;
    this.fireAuth.authState.subscribe(async (firebaseUser) => {
      if (firebaseUser) {
        // User is signed in.
        const data = (await Storage.get({ key: USER_KEY })).value;
        this.currentUser = JSON.parse(data);
        if (this.currentUser && this.currentUser.id === firebaseUser.uid) {
          isAuthenticated.next(true);
        } else {
          isAuthenticated.next(false);
        }
      } else {
        // No user is signed in.
        this.isAuthenticated.next(false);
      }
    });
  }

  dummyLogin(): Promise<boolean> {
    Storage.set({ key: TOKEN_KEY, value: "my-jwt-token-perhaps?" });
    this.isAuthenticated.next(true);
    return Promise.resolve(true);
  }
  async facebookLogin(): Promise<boolean> {
    const FACEBOOK_PERMISSIONS = ["email", "public_profile"];

    const result = await Plugins.FacebookLogin.login({
      permissions: FACEBOOK_PERMISSIONS,
    });
    if (result && result.accessToken) {
      this.isAuthenticated.next(true);
      const credential = firebase.auth.FacebookAuthProvider.credential(
        result.accessToken.token
      );
      this.fireAuth
        .signInWithCredential(credential)
        .then(({ user }) => {
          const data: IUser = {
            id: user.uid,
            email: user.email || user.providerData[0].email,
            name: user.displayName,
            avatar:  user.photoURL,
          };
          this.currentUser = data;
          Storage.set({ key: USER_KEY, value: JSON.stringify(data) });
          const usersRef = firebase.firestore().collection("users");
          usersRef
            .doc(user.uid)
            .set(data)
            .catch((error) => {
              alert(error);
            });
        })
        .catch((error) => {
          alert(error);
        });
    } else {
      this.isAuthenticated.next(false);
    }
    console.log("EXITED HERE");
    return Promise.resolve(true);
  }

  logout(): Promise<void> {
    this.fireAuth.signOut();
    this.isAuthenticated.next(false);
    return Storage.remove({ key: USER_KEY });
  }
}

registerWebPlugin(FacebookLogin);
