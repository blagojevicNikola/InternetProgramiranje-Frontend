import { Component, Input } from '@angular/core';
import { Message } from 'src/app/share/models/message';

@Component({
  selector: 'app-messages-list',
  templateUrl: './messages-list.component.html',
  styleUrls: ['./messages-list.component.scss']
})
export class MessagesListComponent {

  constructor(){}

  @Input() messages:Message[] = []
}
