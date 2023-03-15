import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from 'src/app/review/models/user';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(private http:HttpClient) { }

  getUserInfoByUsername(username: string | null)
  {
    return this.http.get<User | null>(`api/users/info/${username}`);
  }
}
