import { Component, Input, OnInit } from '@angular/core';
import * as firebase from 'firebase';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { GlobalVar } from '../global-var';

export class WindowService {

  constructor() { }
  get windowRef() {
    return window
  }
}
interface City {
  value: string;
  viewValue: string;
}
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.sass']
})
export class LoginComponent implements OnInit {

  bar = false;
  otp_sent : boolean = false;
  windowRef : any;
  otp: string;
  user : any;
  number : string;
  nickname;
  nick_div = false;

  win = new WindowService();
  cities: City[] = [
    // {value: 'Select City', viewValue: 'Select City'},
    {value: 'Aurangabad', viewValue: 'Aurangabad'},
    {value: 'Mumbai', viewValue: 'Mumbai'},
    {value: 'Pune', viewValue: 'Pune'},
    {value: 'Delhi', viewValue: 'Delhi'}
  ];


  constructor( private route : Router, public authService : AuthService, public _http : HttpClient, public gv : GlobalVar) {

   }

  ngOnInit(): void {
    this.gv.bar = false
    if (localStorage.getItem('logOut') === 'true') {
      this.authService.LogOut()
    }
    if (localStorage.getItem('IsLoggedIn') ===null || localStorage.getItem('IsLoggedIn') === 'undefined') {
    }else {
      this.route.navigate(['/home'])
    }
    this.windowRef = this.win.windowRef
    this.windowRef.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container', {'size':"invisible"})

    this.windowRef.recaptchaVerifier.render()
  }
  async SendOtp(){
    if (this.number === undefined || this.number.toString().length < 10){
      window.alert("please enter valid number")
      return
    }
    this.gv.bar = true
    console.log(this.gv.bar)
    const appVerifier = this.windowRef.recaptchaVerifier;
    await this.authService.SendOtp('+91'+this.number, appVerifier);
    if (this.authService.windowRef.confirmationResult){
      this.otp_sent = true;
      this.gv.bar = false
    } else {
      this.gv.bar = false
    }
  }
  async VerifyOtp() {
    if (this.otp === undefined || this.otp.toString().length < 6){
      window.alert("please enter valid number")
      return
    }
    this.gv.bar = true
    await this.authService.VerifyOtp(this.otp);
    if (this.authService.loggedIn === true ) {
      this.gv.bar = false
      this.nick_div = true
      localStorage.setItem('number', this.number)
    }
  }
  setNickname() {
    if(localStorage.getItem('nickname') != null || localStorage.getItem('nickname') != undefined) {
      this.nickname = localStorage.getItem('nickname')
    }
    this.gv.bar = true
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' })
    this._http.post(this.URL + '/addNickname', JSON.stringify({ 'mobile': this.number, 'nickname': this.nickname }), { headers: headers }).subscribe(
      Response => {

        console.log(Response)
        let res = JSON.parse(JSON.stringify(Response))
        if (res.status === false) {
          console.log('not unique')
          window.alert('This nickname is already taken. Please enter something else')
          this.nickname = ""
          this.gv.bar = false
        } else if (res.status === true) {
          this.gv.bar = false
          localStorage.setItem('IsLoggedIn', 'true');
          localStorage.setItem('nickname', this.nickname)
          this.route.navigate(['/home'])
        }
      },
      Error => {
        this.gv.bar = false
        localStorage.setItem('IsLoggedIn', 'true');
        localStorage.setItem('nickname', this.nickname)   //for times when server is off; remove afterwards
        this.route.navigate(['/home'])
      }
    )
  }
}
