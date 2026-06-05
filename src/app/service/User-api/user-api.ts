import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from './userInterFace';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserApi {
  url = 'https://budget-backend-rmb9.onrender.com/users';
  loginUrl = 'https://budget-backend-rmb9.onrender.com/login';

  constructor(private http: HttpClient) {}
  getUsers() {
    return this.http.get<User[]>(this.url);
  }
  loginUser(data: Pick<User, 'email' | 'password'>): Observable<User> {
    return this.http.post<User>(this.loginUrl, data);
  }
  signUpUser(data: User): Observable<User> {
    return this.http.post<User>(this.url, data);
  }

}
