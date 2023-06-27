import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthService } from '../share/services/auth/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  disabledButton = false;
  usernameValue: string = ''
  passwordValue: string = ''

  loginForm = new FormGroup({
    username: new FormControl('', [Validators.required, Validators.minLength(5)]),
    password: new FormControl('', [Validators.required, Validators.minLength(8)])
  })
  hide = true;
  constructor(private authService: AuthService, private router: Router, private matSnackBar: MatSnackBar) {}

  onSubmit() {
    if (this.loginForm.invalid) {
      return;
    }
    this.disabledButton = true;
    this.authService.login(this.usernameValue, this.passwordValue).subscribe({
      next: (data) => { 
        if(data.activated===true)
        {
          localStorage.setItem('token', data.token); 
          this.router.navigateByUrl('');
        }else
        {
          this.authService.usernameForActivation=this.usernameValue;
          this.router.navigateByUrl('activate');
        }
      },
      error: (e) => {
        this.disabledButton = false;
        if (e.status === 400 || e.status === 401) {
          this.matSnackBar.open("Bad credentials. Try again!", "Okay", { duration: 3000 })
        }
        else {
          this.matSnackBar.open("Error while logging in!", "Okay", { duration: 3000 })
        }
      },
      complete: () => this.disabledButton = false
    });
  }

  showPasswordErrorMessage() {
    if (this.loginForm.controls['password'].hasError('minlength')) {
      return 'Minimal 8 characters!'
    }
    return '';
    //return this.registerForm.controls['password'].hasError('required') ? 'Polje je obavezno!' : '';
  }

  showUsernameErrorMessage() {
    if (this.loginForm.controls['username'].hasError('minlength')) {
      return 'Minimal 5 characters!'
    }
    return ''
    //return this.registerForm.controls['username'].hasError('required') ? 'Polje je obavezno!' : '';
  }
}
