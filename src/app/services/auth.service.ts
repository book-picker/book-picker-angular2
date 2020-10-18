import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as firebase from 'firebase';
export class WindowService {

  constructor() { }
  get windowRef() {
    return window
  }
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  URL = 'https://fe03b98581c2.ngrok.io'
  win = new WindowService();
  windowRef;
  loggedIn = false;
  nickname;
  token: string;
  constructor(public http_: HttpClient) {
    this.windowRef = this.win.windowRef;
  }
  ngOnInit() {
  }
  async SendOtp(ph_num, appVerifier) {    
    await firebase.auth().signInWithPhoneNumber(ph_num, appVerifier).then(result => {
      this.windowRef.recaptchaVerifier = appVerifier;
      this.windowRef.confirmationResult = result;
    }).catch(error => {
      console.log(error);
    });
  }
  VerifyOtp(otp, number): Promise<string> {
    return new Promise((resolve, reject) => {
      this.windowRef.confirmationResult.confirm(otp).then(
        user => {
          this.loggedIn = true;
          localStorage.setItem('number', number);
          this.login().subscribe(
            Response => {
              console.log(Response);
              let res = JSON.parse(JSON.stringify(Response));              
              resolve(res.nickname)
            },
            error => {
              console.log(error)
              reject(error)
            }
          )
        }
      ).catch(error => {
        window.alert("Incorrect OTP");
      })
    })
  }
  LogOut() {
    firebase.auth().signOut()
    localStorage.removeItem('IsLoggedIn');
    localStorage.removeItem('nickname');
  }
  GetToken(): Promise<string> {
    return new Promise((resolve, reject) => {
      firebase.auth().onAuthStateChanged(user => {
        if (user) {
          user.getIdToken().then(idToken => {
            resolve(idToken);
          });
        }
      },
        error => {
          console.log(error);
          reject(error);
        }
      );
    })
  }
  login() {
    console.log("login")
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' })

    return this.http_.post(this.URL + '/login', JSON.stringify({ 'mobile': localStorage.getItem('number') }), { headers: headers })

  }
}
