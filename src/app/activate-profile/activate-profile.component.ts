import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '../share/services/auth/auth.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-activate-profile',
  templateUrl: './activate-profile.component.html',
  styleUrls: ['./activate-profile.component.css']
})
export class ActivateProfileComponent implements OnInit, OnDestroy{

  private activateSub:Subscription|null = null;
  pinGroup:FormGroup = new FormGroup({
    pin: new FormControl<number|undefined>(undefined, [Validators.required])
  })

  constructor(private authService:AuthService, private router:Router, private snackBar:MatSnackBar){

  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    if(this.activateSub)
    {
      this.activateSub.unsubscribe();
    }
  }

  onActivate()
  {
    if(this.authService.usernameForActivation==null)
    {
      this.snackBar.open('You need to login with valid credentials!', 'Okay', {duration:3000});
      return;
    }
    if(this.pinGroup.valid)
    {
      this.activateSub = this.authService.activate(this.authService.usernameForActivation, this.pinGroup.get('pin')?.value).subscribe({
        next:(response)=>{
          if(response.activated && response.token)
          {
            localStorage.setItem('token', response.token); 
            this.snackBar.open('Your profile is now activated!', 'Okay', {duration:3000})
            this.router.navigateByUrl('');
          }
        },
        error:()=>{
          this.snackBar.open('Activation failed! To activate your profile, you need to login again!', 'Okay', {duration:3000});
          this.router.navigateByUrl('login');
          this.authService.usernameForActivation=null;
        }
      })
    }
    
  }

}
