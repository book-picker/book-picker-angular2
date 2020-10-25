import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { GlobalVar } from '../global-var';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import * as firebase from 'firebase'


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

  constructor(private route: Router,
    public authService: AuthService,
    public _http: HttpClient,
    public gv: GlobalVar) { }


  @Input() display;
  otp_sent: boolean = false;
  windowRef: any;
  otp: string;
  user: any;
  number: string
  nickname;
  nick_div = false;

  win = new WindowService();
  cities: City[] = [
    // {value: 'Select City', viewValue: 'Select City'},
    { value: 'Aurangabad', viewValue: 'Aurangabad' },
    { value: 'Mumbai', viewValue: 'Mumbai' },
    { value: 'Pune', viewValue: 'Pune' },
    { value: 'Delhi', viewValue: 'Delhi' }
  ];



  ngOnInit(): void {
    this.gv.bar = false
    if (localStorage.getItem('logOut') === 'true') {
      this.authService.LogOut()
    }
    if (localStorage.getItem('IsLoggedIn') === null || localStorage.getItem('IsLoggedIn') === 'undefined') {
    } else if (localStorage.getItem('change_nickname') === 'true') {
      this.nick_div = true
    } else {
      this.route.navigate(['/home'])
    }
    this.windowRef = this.win.windowRef
    this.windowRef.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container', { 'size': "invisible" })

    this.windowRef.recaptchaVerifier.render()
  }
  async SendOtp() {
    console.log(this.number)
    if (this.number === undefined || this.number.toString().length < 10) {
      window.alert("please enter valid number")
      return
    }
    this.gv.bar = true
    const appVerifier = this.windowRef.recaptchaVerifier;
    await this.authService.SendOtp('+91' + this.number, appVerifier);
    if (this.authService.windowRef.confirmationResult) {
      this.otp_sent = true;
      this.gv.bar = false
      
    } else {
      this.gv.bar = false
      window.alert("Check your internet Conection")
    }
  }
  async VerifyOtp() {
    if (this.otp === undefined || this.otp.toString().length < 6) {
      window.alert("please enter valid number")
      return
    }
    this.gv.bar = true
    await this.authService.VerifyOtp(this.otp, this.number).then(
      nickname => {
        this.gv.bar = false
        if (nickname === "" || nickname === undefined) { this.nick_div = true } else {
          //not first time login, go to home
          this.nick_div = false
          localStorage.setItem('nickname', nickname)
          localStorage.setItem('IsLoggedIn', 'true');
          console.log("to home")
          this.route.navigate(['/home'])
        }
      },
      error => {
        console.log(error)
        this.nick_div = false
        this.otp_sent = false
        this.gv.bar = false
        window.alert("Check your internet Conection")
      }
    )
  }
  setNickname() {
    this.gv.bar = true
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' })
    this._http.post(this.gv.URL + '/addNickname', JSON.stringify({ 'mobile': this.number, 'nickname': this.nickname }), { headers: headers }).subscribe(
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
