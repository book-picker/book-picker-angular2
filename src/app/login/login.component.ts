import { Component, Input, OnInit } from '@angular/core';
import * as firebase from 'firebase';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { stringify } from 'querystring';
import { FormControl, FormGroup } from '@angular/forms';

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
  @Input() display;
  otp_sent : boolean = false;
  windowRef : any;
  otp: string;
  user : any;
  number : string
  nickname;
  nick_div = false;
  URL = 'https://727ba2a379fc.ngrok.io'
  
  win = new WindowService();
  cities: City[] = [
    // {value: 'Select City', viewValue: 'Select City'},
    {value: 'Aurangabad', viewValue: 'Aurangabad'},
    {value: 'Mumbai', viewValue: 'Mumbai'},
    {value: 'Pune', viewValue: 'Pune'},
    {value: 'Delhi', viewValue: 'Delhi'}
  ];

  constructor( private route : Router, public authService : AuthService, public _http : HttpClient) {

   }

  ngOnInit(): void {
    if (localStorage.getItem('logOut') ==='true'){
      firebase.auth().signOut();
      localStorage.removeItem('IsLoggedIn')
      localStorage.removeItem('logOut')
      localStorage.removeItem('nickname')
    }
    if (localStorage.getItem('IsLoggedIn') ===null || localStorage.getItem('IsLoggedIn') === 'undefined' ) {
    }else if(localStorage.getItem('nickname') === null || localStorage.getItem('IsLoggedIn') === 'undefined') {
      this.nick_div = true
    }else {
      this.route.navigate(['/home'])
    }
    this.windowRef = this.win.windowRef
    this.windowRef.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container', {'size':"invisible"})

    this.windowRef.recaptchaVerifier.render()
  }
  async SendOtp(){
    console.log(this.number)
    if (this.number === undefined || this.number.toString().length < 10){
      window.alert("please enter valid number")
      return
    }
    this.bar = true
    const appVerifier = this.windowRef.recaptchaVerifier;
    await this.authService.SendOtp('+91'+this.number, appVerifier);
    if (this.authService.windowRef.confirmationResult){
      this.otp_sent = true;
      this.bar = false
    } else {
      this.bar = false
    }
    // localStorage.setItem('number', this.number)
    // this.authService.login()
    // if(this.authService.nickname === "" ){
    //   this.nick_div = true
    // } else{
    //   localStorage.setItem('nickname',this.authService.nickname)
    //   this.route.navigate(['/home'])
    // }
  }
  async VerifyOtp() {
    if (this.otp === undefined || this.otp.toString().length < 6){
      window.alert("please enter valid number")
      return
    }
    this.bar = true
    await this.authService.VerifyOtp(this.otp,this.number);
    if (this.authService.loggedIn === true ) {
      this.bar = false
      // localStorage.setItem('number', this.number)
    }
    if(this.authService.nickname === "" ){
      this.nick_div = true
    } else if(this.authService.nickname === undefined){
      this.nick_div = true
    }
    else{
      this.nick_div = false
      localStorage.setItem('nickname',this.authService.nickname)
      console.log("to home")
      this.route.navigate(['/home'])
    }
  }
  setNickname(){
    
    let headers = new HttpHeaders({'Content-Type':'application/json'})
    this._http.post(this.URL + '/addNickname', JSON.stringify({'mobile':this.number,'nickname':this.nickname}), {headers:headers}).subscribe(
      Response => {
        
        console.log(Response)
        let res = JSON.parse(JSON.stringify(Response))
        if(res.status === false){
          console.log('not unique')
          window.alert('This nickname is already taken. Please enter something else')
          this.nickname = ""
        } else if(res.status === true){
          localStorage.setItem('nickname', this.nickname)
          this.route.navigate(['/home'])
        }
      },
      Error => {
        localStorage.setItem('nickname', this.nickname)
        this.route.navigate(['/home'])
      }
    )
  }
}
