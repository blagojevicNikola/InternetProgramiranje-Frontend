import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {

  registerForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    surname: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required, Validators.minLength(8)]),
    username: new FormControl('', [Validators.required, Validators.minLength(5)]),
    city: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email])
  });
  hide = true;
  

  showNameErrorMessage()
  {
    return this.registerForm.controls['name'].hasError('required') ? 'Polje je obavezno!' : '';
  }

  showSurnameErrorMessage()
  {
    return this.registerForm.controls['surname'].hasError('required') ? 'Polje je obavezno!' : '';
  }

  showPasswordErrorMessage()
  {
    if(this.registerForm.controls['password'].hasError('minlength'))
    {
      return 'Potrebno minimalno 8 karaktera!'
    }
    return this.registerForm.controls['password'].hasError('required')? 'Polje je obavezno!' : '';
  }

  showUsernameErrorMessage()
  {
    if(this.registerForm.controls['username'].hasError('minlength'))
    {
      return 'Potrebno minimalno 5 karaktera!'
    }
    return this.registerForm.controls['username'].hasError('required')? 'Polje je obavezno!' : '';
  }

  showCityErrorMessage()
  {
    return this.registerForm.controls['city'].hasError('required')? 'Polje je obavezno!' : '';
  }

  showEmailErrorMessage()
  {
    if(this.registerForm.controls['email'].hasError('email'))
    {
      return 'Neispravan format!';
    }
    return this.registerForm.controls['email'].hasError('required') ? 'Polje je obavezno!' : '';
  }
}
