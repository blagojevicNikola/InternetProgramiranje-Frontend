import { Component } from '@angular/core';
import { SidebarService } from '../share/services/sidebar/sidebar.service';

@Component({
  selector: 'app-support-chat',
  templateUrl: './support-chat.component.html',
  styleUrls: ['./support-chat.component.css']
})
export class SupportChatComponent {

  constructor(private sidebarService:SidebarService)
  {
    this.sidebarService.disable();
  }
}
