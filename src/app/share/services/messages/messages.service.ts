import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Message } from '../../models/message';

@Injectable({
  providedIn: 'root'
})
export class MessagesService {

  constructor(private http:HttpClient) { }

  getMessagesOfUser()
  {
    return this.http.get<Message[]>(`api/messages/user`);
  }

  sendMessage(data:string)
  {
    return this.http.post<Message>(`api/messages/send`,data);
  }
}
