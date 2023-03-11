import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { RegisterRequest } from '../../models/register-request';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }

  private loadToken() {
    return localStorage.getItem('token');
  }

  public getUsername() {
    if (this.loadToken()) {
      try {
        var obj = JSON.parse(atob(JSON.stringify(this.loadToken()!).split('.')[1].replace('"', '')))
        return obj.sub
      } catch (e) {
        return null;
      }
    }
    return null;
  }

  public isAuthenticated()
  {
    if(this.getUsername())
    {
      return true;
    }
    return false;
  }

  login(username: string, password: string) {
    return this.http.post<any>('/api/auth/authenticate', { username, password });
  }

  register(req: RegisterRequest) {
    return this.http.post<any>('/api/auth/register-user', req);
  }

  logout()
  {
    localStorage.removeItem('token');
  }
}
