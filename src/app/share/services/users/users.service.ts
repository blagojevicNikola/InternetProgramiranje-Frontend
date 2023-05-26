import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from 'src/app/review/models/user';
import { UserInfo } from 'src/app/review/models/user-info';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(private http:HttpClient) { }

  getUserPreviewByUsername(username: string | null)
  {
    return this.http.get<User | null>(`api/users/preview/${username}`);
  }

  getUserInfoByUsername(username: string | null)
  {
    return this.http.get<UserInfo | null>(`api/users/info/${username}`);
  }

  updateUser(data: UserInfo)
  {
    return this.http.put(`api/users/update`,data);
  }

  updateUserPassword(data: {currentPassword:string, newPassword:string})
  {
    return this.http.put(`api/users/update/password`, data);
  }
}
