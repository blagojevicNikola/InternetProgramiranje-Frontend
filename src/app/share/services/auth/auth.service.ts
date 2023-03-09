import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { RegisterRequest } from '../../models/register-request';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }

  login(username: string, password:string)
  {
    return this.http.post<any>('/api/auth/authenticate', {username, password});
  }

  register(req: RegisterRequest)
  {
    return this.http.post<string>('/api/auth/register-user', req);
  }
}
