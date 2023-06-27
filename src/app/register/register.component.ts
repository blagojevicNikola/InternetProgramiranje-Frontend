import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { combineLatest } from 'rxjs';
import { AuthService } from '../share/services/auth/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {

  disabledButton = false;
  chosenAvatar:number|null=null;
  registerForm = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.pattern('^[a-zA-Z]+$'), Validators.maxLength(16)]),
    surname: new FormControl('', [Validators.required, Validators.pattern('^[a-zA-Z]+$'), Validators.maxLength(16)]),
    password: new FormControl('', [Validators.required, Validators.minLength(8)]),
    username: new FormControl('', [Validators.required, Validators.minLength(5)]),
    city: new FormControl('', [Validators.required]),
    avatar: new FormControl<number|undefined>(undefined),
    email: new FormControl('', [Validators.required, Validators.email])
  });
  hide = true;

  constructor(private authService: AuthService, private router: Router, private matSnackBar: MatSnackBar) { }

  onSubmit() {
    if (this.registerForm.invalid) {
      return;
    }
    this.disabledButton = true;
    this.authService.register({
      name: this.registerForm.controls['name'].value!,
      surname: this.registerForm.controls['surname'].value!,
      username: this.registerForm.controls['username'].value!,
      password: this.registerForm.controls['password'].value!,
      email: this.registerForm.controls['email'].value!,
      avatar: this.chosenAvatar,
      cityName: this.registerForm.controls['city'].value!
    }).subscribe({
      next: (v) => { 
        this.matSnackBar.open("You successfully registered!", "Okay", )
        this.router.navigateByUrl('/login') 
      },
      error: (e) => {
        this.disabledButton = false;
        if (e.status === 400) {
          this.matSnackBar.open("Bad data format!", "Okay", { duration: 3000 })
        }
        else {
          this.matSnackBar.open("Error while signing in!", "Okay", { duration: 3000 })
        }
      },
      complete: () => this.disabledButton = false
    })
  }

  showNameErrorMessage() {
    return this.registerForm.controls['name'].hasError('required') ? 'Characters only (maximum 16)!' : '';
  }

  showSurnameErrorMessage() {
    return this.registerForm.controls['surname'].hasError('required') ? 'Characters only (maximum 16)!' : '';
  }

  showPasswordErrorMessage() {
    if (this.registerForm.controls['password'].hasError('minlength')) {
      return 'Minimal 8 characters!'
    }
    return '';
    //return this.registerForm.controls['password'].hasError('required') ? 'Polje je obavezno!' : '';
  }

  showUsernameErrorMessage() {
    if (this.registerForm.controls['username'].hasError('minlength')) {
      return 'Minimal 5 characters!'
    }
    return ''
    //return this.registerForm.controls['username'].hasError('required') ? 'Polje je obavezno!' : '';
  }

  showCityErrorMessage() {
    return '';
    //return this.registerForm.controls['city'].hasError('required') ? 'Polje je obavezno!' : '';
  }

  showEmailErrorMessage() {
    if (this.registerForm.controls['email'].hasError('email')) {
      return 'Bad format!';
    }
    return '';
    //return this.registerForm.controls['email'].hasError('required') ? 'Polje je obavezno!' : '';
  }
}
