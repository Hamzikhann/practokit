import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  baseUrl: string = environment.reqBaseUrl + 'users/';

  constructor(private http: HttpClient) {}

  updateProfile(payload: { firstName: string; lastName: string }) {
    return this.http.put(this.baseUrl + 'profile/edit', payload, {
      observe: 'response',
    });
  }

  resetPassword(payload: {
    oldPassword: string;
    password: string;
    password_confirmation: string;
  }) {
    return this.http.put(this.baseUrl + 'reset/password', payload, {
      observe: 'response',
    });
  }
}
