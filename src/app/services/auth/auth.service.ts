import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  baseUrl: String = environment.reqBaseUrl + 'auth/';
  authToken: any;
  user: any;
  imgUrl: string = environment.imgBaseUrl;
  private updatedUser: BehaviorSubject<any>;

  constructor(private http: HttpClient, private router: Router) {
    this.updatedUser = new BehaviorSubject<any>(localStorage.getItem('user'));
  }

  login(payload: { email: string; password: string }) {
    return this.http.post(this.baseUrl + 'login', payload, {
      observe: 'response',
    });
  }

  resetPassword(
    token: string | null,
    payload: { password: string; confirmPassword: string }
  ) {
    return this.http.post(this.baseUrl + 'reset/password/' + token, payload, {
      observe: 'response',
    });
  }

  forgotPassword(payload: { email: string }) {
    return this.http.post(this.baseUrl + 'forgot/password', payload, {
      observe: 'response',
    });
  }

  storeUserData(token?: string | null, user?: any) {
    if (token) {
      localStorage.setItem('token', token);
      this.authToken = token;
    }
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
      this.user = user;
    }
  }

  getUser(): Observable<any> {
    return this.updatedUser.asObservable();
  }
  setUser(newValue: any): void {
    this.updatedUser.next(newValue);
  }

  /**
   * this function is used in HTTP interceptor to attach token
   * to the outgoing requests.
   */
  getToken(): String | null {
    return localStorage.getItem('token');
  }

  loggedIn(): boolean {
    return localStorage.getItem('token') !== null;
  }

  logOut() {
    this.authToken = null;
    this.user = null;
    localStorage.clear();
    this.router.navigate(['/signin']);
  }
}
