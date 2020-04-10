import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthData } from './auth-data.model';
import { Subject } from 'rxjs';
import { environment } from '../../environments/environment';

const BACKEND_URL = environment.apiUrl + '/user';


@Injectable({ providedIn: 'root'})
export class AuthService {

  private token: string;
  private authStatusListener = new Subject<boolean>();
  private isAuthenticated = false;
  private tokenTimer: any;
  private userId: string;

  constructor(public http: HttpClient, private router: Router) {}

  getToken() {
    return this.token;
  }
  getIsAuthenticated() {
    return this.isAuthenticated;
  }

  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }

  getUserId() {
   return this.userId;
  }

  createUser(email: string, password: string) {
    const authData: AuthData = {email, password};
    this.http.post(BACKEND_URL + '/signup', authData)
      .subscribe(
        response => {
          console.log(response);
          this.router.navigate(['/']);
        },
        error => {
          console.log(error);
          this.authStatusListener.next(false); // avisar de que no estoy autenticado para que desaparezca el spiner de signup
        }
      );
  }

  login(email: string, password: string) {
    const authData: AuthData = {email, password};
    this.http.post<{ token: string, expiresIn: number, userId: string }>(BACKEND_URL + '/login', authData)
      .subscribe(
        response => {
          const token = response.token;
          if (token) {
            // manejar el logout cuando expira el token
            const expiresInDuration = response.expiresIn;
            this.setAuthTimer(expiresInDuration);


            this.token = token;
            this.isAuthenticated = true;
            this.userId = response.userId;
            this.authStatusListener.next(true);

            const now = new Date();
            const expirationDate = new Date(now.getTime() + expiresInDuration * 1000);
            this.saveAuthData(token, expirationDate, this.userId);

            this.router.navigate(['/']);
          }
        },
        error => {
          console.log(error);
          this.authStatusListener.next(false);
        }
      );
  }

  // re-autenticar el usuario si tiene los datos correctos
  autoAuthUser() {
    const authInformation = this.getAuthData();
    if (!authInformation) {
      return;
    }
    const now = new Date();
    const expiresIn = authInformation.expirationDate.getTime() - now.getTime();
    if (expiresIn > 0) {
      this.token = authInformation.token;
      this.isAuthenticated = true;
      this.userId = authInformation.userId;
      this.setAuthTimer(expiresIn / 1000);
      this.authStatusListener.next(true);
    }
  }

  logout() {
    this.token = null;
    this.isAuthenticated = false;
    this.userId = null;
    this.authStatusListener.next(false);
    clearTimeout(this.tokenTimer);
    this.clearAuthData();
    this.router.navigate(['/']);
  }

  private setAuthTimer(duration: number) {
    this.tokenTimer = setTimeout(() => {
      this.logout();
    }, duration * 1000);
  }

  private saveAuthData(token: string, expirationDate: Date, userId: string) {
    localStorage.setItem('token', token);
    localStorage.setItem('expiration', expirationDate.toISOString());
    localStorage.setItem('userId', userId);
  }

  private clearAuthData() {
    localStorage.removeItem('token');
    localStorage.removeItem('expiration');
    localStorage.removeItem('userId');
  }

  getAuthData() {
    const token = localStorage.getItem('token');
    const expirationDate = localStorage.getItem('expiration');
    const userId = localStorage.getItem('userId');
    if (!token || !expirationDate) {
      return;
    }
    return { token, expirationDate : new Date(expirationDate), userId };
  }
}
