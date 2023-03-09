import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../share/services/auth/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  usernameValue:string = ''
  passwordValue:string = ''

  loginForm = new FormGroup({
    username: new FormControl('', [Validators.required, Validators.minLength(5)]),
    password: new FormControl('', [Validators.required, Validators.minLength(2)])
  })
  hide = true;
  constructor(private authService:AuthService, private router:Router){}

  onSubmit(){
    if(this.loginForm.invalid)
    {
      return;
    }
    this.authService.login(this.usernameValue, this.passwordValue).subscribe((data) =>{localStorage.setItem('token', data.token); this.router.navigateByUrl('')});
  }
}
