import { Component, OnDestroy, OnInit } from '@angular/core';
import { SidebarService } from '../share/services/sidebar/sidebar.service';
import { AuthService } from '../share/services/auth/auth.service';
import { Subscription } from 'rxjs';
import { UsersService } from '../share/services/users/users.service';
import { UserInfo } from '../review/models/user-info';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LocationsService } from '../share/services/locations/locations.service';
import { Location } from '../share/models/location';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.css']
})
export class EditProfileComponent implements OnInit, OnDestroy{

  private userSub:Subscription | null = null;
  private updateSub:Subscription | null = null;
  private locationsSub: Subscription | null = null;
  locations: Location[] = [];
  formGroup:FormGroup = new FormGroup({
    name: new FormControl<string>('', [Validators.required]),
    surname: new FormControl<string>('', [Validators.required]),
    username: new FormControl<string>('',[Validators.required]),
    phoneNumber: new FormControl<string>('', [Validators.required]),
    location: new FormControl<number>(0, [Validators.required])
  });

  constructor(private sidebarService:SidebarService, private locationsService:LocationsService, private userService:UsersService, private authService:AuthService,
    private snackBar:MatSnackBar)
  {
    this.sidebarService.disable();
  }
  
  ngOnInit(): void {
    let username = this.authService.getUsername();
    if(username !== undefined || username !== null)
    {
      this.locationsSub = this.locationsService.getLocations().subscribe({
        next: (value) => {
          this.locations = value; 
        },
      })
      this.userSub = this.userService.getUserInfoByUsername(username).subscribe({
        next:(value) => {
          this.formGroup.setValue({
            name:value?.name,
            surname:value?.surname,
            username:value?.username,
            phoneNumber:value?.phoneNumber,
            location:value?.locationId
          })
        },
      })
    }
  }

  ngOnDestroy(): void {
    if(this.userSub)
    {
      this.userSub.unsubscribe();
    }
    if(this.updateSub)
    {
      this.updateSub.unsubscribe();
    }
  }

  submit()
  {
    if(this.formGroup.valid)
    {
      this.updateSub = this.userService.updateUser({
        name: this.formGroup.get('name')?.value,
        surname: this.formGroup.get('surname')?.value,
        username: this.formGroup.get('username')?.value,
        phoneNumber: this.formGroup.get('phoneNumber')?.value,
        locationId: this.formGroup.get('location')?.value
      }).subscribe({
        next:() => { this.snackBar.open("Korisnicke informacije uspjesno azurirane!", "U redu", {duration:3000})},
        error:() =>{ this.snackBar.open("Greska prilikom azuriranja!", "U redu", {duration:3000})}
      })
    }
  }

}
