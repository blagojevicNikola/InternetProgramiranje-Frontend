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

  registerForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    surname: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required, Validators.minLength(8)]),
    username: new FormControl('', [Validators.required, Validators.minLength(5)]),
    city: new FormControl('', [Validators.required]),
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
      avatar: null,
      cityName: this.registerForm.controls['city'].value!
    }).subscribe({
      next: (v) => { 
        this.matSnackBar.open("You successfully registered!", "Okay", )
        this.router.navigateByUrl('/login') 
      },
      error: (e) => {
        this.disabledButton = false;
        if (e.status === 400) {
          this.matSnackBar.open("Neispravni podaci!", "U redu", { duration: 3000 })
        }
        else {
          this.matSnackBar.open("Greska na serveru!", "U redu", { duration: 3000 })
        }
      },
      complete: () => this.disabledButton = false
    })
  }

  showNameErrorMessage() {
    return this.registerForm.controls['name'].hasError('required') ? 'Polje je obavezno!' : '';
  }

  showSurnameErrorMessage() {
    return this.registerForm.controls['surname'].hasError('required') ? 'Polje je obavezno!' : '';
  }

  showPasswordErrorMessage() {
    if (this.registerForm.controls['password'].hasError('minlength')) {
      return 'Potrebno minimalno 8 karaktera!'
    }
    return this.registerForm.controls['password'].hasError('required') ? 'Polje je obavezno!' : '';
  }

  showUsernameErrorMessage() {
    if (this.registerForm.controls['username'].hasError('minlength')) {
      return 'Potrebno minimalno 5 karaktera!'
    }
    return this.registerForm.controls['username'].hasError('required') ? 'Polje je obavezno!' : '';
  }

  showCityErrorMessage() {
    return this.registerForm.controls['city'].hasError('required') ? 'Polje je obavezno!' : '';
  }

  showEmailErrorMessage() {
    if (this.registerForm.controls['email'].hasError('email')) {
      return 'Neispravan format!';
    }
    return this.registerForm.controls['email'].hasError('required') ? 'Polje je obavezno!' : '';
  }
}
