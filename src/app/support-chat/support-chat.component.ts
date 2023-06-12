import { Component, OnDestroy, OnInit } from '@angular/core';
import { SidebarService } from '../share/services/sidebar/sidebar.service';
import { Message } from '../share/models/message';
import { Subscription } from 'rxjs';
import { AuthService } from '../share/services/auth/auth.service';
import { MessagesService } from '../share/services/messages/messages.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SpinnerService } from '../share/services/spinner/spinner.service';

@Component({
  selector: 'app-support-chat',
  templateUrl: './support-chat.component.html',
  styleUrls: ['./support-chat.component.scss']
})
export class SupportChatComponent implements OnInit, OnDestroy {

  messages: Message[] = []
  messagesSub: Subscription | null = null;
  sendSub: Subscription | null = null;
  formGroupMsg: FormGroup = new FormGroup({
    msg: new FormControl<string>('', [Validators.required])
  })
  constructor(private sidebarService: SidebarService, private authService: AuthService, private messagesService: MessagesService, 
    public spinnerService:SpinnerService, private snackBar: MatSnackBar) {
    this.sidebarService.disable();
  }

  ngOnInit(): void {
    let username = this.authService.getUsername();
    if (username !== undefined) {
      this.messagesSub = this.messagesService.getMessagesOfUser().subscribe({
        next: (value) => {
          this.messages = value;
        }
      })
    }
  }

  ngOnDestroy(): void {
    if (this.messagesSub) {
      this.messagesSub.unsubscribe();
    }
    if(this.sendSub)
    {
      this.sendSub.unsubscribe();
    }
  }

  sendMessage() {
    if (this.sendSub) {
      this.sendSub.unsubscribe();
    }
    if (this.formGroupMsg.valid) {
      this.sendSub = this.messagesService.sendMessage(this.formGroupMsg.get('msg')?.value).subscribe({
        next: (value) => {
          this.messages.push(value);
          this.formGroupMsg.get('msg')?.setValue('');
        },
        error: (err: HttpErrorResponse) => {
          this.snackBar.open("Error while sending a message!", "Okay", { duration: 3000 });
          this.formGroupMsg.get('msg')?.setValue('');
        }
      })
    }
  }
}
