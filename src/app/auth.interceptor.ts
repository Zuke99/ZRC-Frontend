import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private auth : AuthService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    if(this.auth.isLoggedIn()){
      //console.log("Insede Interceptor **************************")
      const token = this.auth.getToken()

      request=request.clone({
        setHeaders:{
          Authorization : `Bearer ${token}`
        }
      })
    } else {
      console.log("USER NOT LOGGED IN!!!!")
    }
   
    return next.handle(request);
  }
}
