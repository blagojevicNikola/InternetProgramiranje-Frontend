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

  private tokenExpired(token: string | null) {
    if(token===null)
    {
      return false;
    }
    const expiry = (JSON.parse(atob(token.split('.')[1]))).exp;
    return (Math.floor((new Date).getTime() / 1000)) >= expiry;
  }

  public isAuthenticated()
  {
    if(this.getUsername() && !this.tokenExpired(this.loadToken()))
    {
      return true;
    }
    return false;
  }

  getToken()
  {
    return this.loadToken();
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
