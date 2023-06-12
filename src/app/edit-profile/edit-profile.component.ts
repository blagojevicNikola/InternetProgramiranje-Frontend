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
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ApproveDialogComponent } from '../review/components/approve-dialog/approve-dialog.component';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.scss']
})
export class EditProfileComponent implements OnInit, OnDestroy {

  private userSub: Subscription | null = null;
  private updateInfoSub: Subscription | null = null;
  private updatePassSub: Subscription | null = null;
  private locationsSub: Subscription | null = null;
  hideCurrentPassword: boolean = true;
  hideNewPassword: boolean = true;
  disableInfoButton: boolean = false;
  disablePassButton: boolean = false;
  locations: Location[] = [];
  formGroupInfo: FormGroup = new FormGroup({
    name: new FormControl<string>('', [Validators.required]),
    surname: new FormControl<string>('', [Validators.required]),
    username: new FormControl<string>('', [Validators.required]),
    phoneNumber: new FormControl<string>(''),
    location: new FormControl<number>(0, [Validators.required])
  });
  formGroupPassword: FormGroup = new FormGroup({
    currPass: new FormControl<string>('', [Validators.required, Validators.min(8)]),
    newPass: new FormControl<string>('', [Validators.required, Validators.min(8)])
  })

  constructor(private router: Router, private sidebarService: SidebarService, private locationsService: LocationsService, private userService: UsersService, private authService: AuthService,
    private snackBar: MatSnackBar, private dialog: MatDialog) {
    this.sidebarService.disable();
  }

  ngOnInit(): void {
    let username = this.authService.getUsername();
    if (username !== undefined || username !== null) {
      this.locationsSub = this.locationsService.getLocations().subscribe({
        next: (value) => {
          this.locations = value;
        },
      })
      this.userSub = this.userService.getUserInfoByUsername(username).subscribe({
        next: (value) => {
          this.formGroupInfo.patchValue({
            name: value?.name,
            surname: value?.surname,
            username: value?.username,
            phoneNumber: value?.userPhoneNumber,
            location: value?.userLocationId
          })
        },
      })
    }
  }

  ngOnDestroy(): void {
    if (this.userSub) {
      this.userSub.unsubscribe();
    }
    if (this.locationsSub) {
      this.locationsSub.unsubscribe();
    }
    if (this.updateInfoSub) {
      this.updateInfoSub.unsubscribe();
    }
    if (this.updatePassSub) {
      this.updatePassSub.unsubscribe();
    }
  }

  submitInfo() {
    if (this.formGroupInfo.valid) {
      if (this.updateInfoSub) {
        this.updateInfoSub.unsubscribe();
      }
      const dialogRef = this.dialog.open(ApproveDialogComponent, { data: { message: "After updating user infomration, you will need to login again! Continue?" } });
      dialogRef.afterClosed().subscribe({
        next: (result) => {
          if (result !== true) {
            return;
          }
          this.disableInfoButton = true;
          this.updateInfoSub = this.userService.updateUser({
            name: this.formGroupInfo.get('name')?.value,
            surname: this.formGroupInfo.get('surname')?.value,
            username: this.formGroupInfo.get('username')?.value,
            userPhoneNumber: this.formGroupInfo.get('phoneNumber')?.value,
            userLocationId: this.formGroupInfo.get('location')?.value
          }).subscribe({
            next: () => {
              this.snackBar.open("Korisnicke informacije uspjesno azurirane!", "U redu", { duration: 3000 });
              this.disableInfoButton = false;
              this.authService.logout();
              this.router.navigateByUrl('login');
            },
            error: () => {
              this.snackBar.open("Greska prilikom azuriranja!", "U redu", { duration: 3000 });
              this.disableInfoButton = false;
            }
          })
        }
      })
    }
  }

  submitPassword() {
    if (this.formGroupPassword.valid) {
      if (this.updatePassSub) {
        this.updatePassSub.unsubscribe();
      }
      this.disablePassButton = true;
      this.updatePassSub = this.userService.updateUserPassword({
        currentPassword: this.formGroupPassword.get('currPass')?.value,
        newPassword: this.formGroupPassword.get('newPass')?.value
      }).subscribe({
        next: () => {
          this.snackBar.open("Password changed successfully!", "Okay", { duration: 3000 });
          this.disablePassButton = false;
        },
        error: (err: HttpErrorResponse) => {
          if (err.status === 409) {
            this.snackBar.open("Wrong current password!", "Okay", { duration: 3000 });
            this.disablePassButton = false;
            return;
          }
          this.snackBar.open("Error while updating password!", "Okay", { duration: 3000 });
          this.disablePassButton = false;
        }
      })
    }
  }

}
