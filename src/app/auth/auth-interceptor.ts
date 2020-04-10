import { HttpInterceptor, HttpRequest, HttpHandler } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';

@Injectable() // so we can inject services into this service
export class AuthInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService) {}


  intercept(req: HttpRequest<any>, next: HttpHandler) {
    const authToken = this.authService.getToken();
    const authRequest = req.clone({
      headers: req.headers.set('Authorization', 'Bearer ' + authToken) // add token to request header, we use Bearer just for convention
    });
    return next.handle(authRequest);
  }
}
