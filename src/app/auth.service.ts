import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private jwtHelper :JwtHelperService ) { }
  setToken(token : string){
    localStorage.setItem('token', token)
  }

  getToken() : string | null{
    return localStorage.getItem('token')
  }

  isLoggedIn() : boolean{
    //console.log("Login Token ", this.getToken())
    if(!this.getToken()){
      //console.log("token" ,this.getToken());
      return false
    }
   //console.log("Logged In")
    return true;
  }
  logout(){
    console.log("Logged Out")
    localStorage.removeItem('token')
    
  }
  getUserRole() : string {
    const token = localStorage.getItem('token');
    if(token){
      const decodedToken=this.jwtHelper.decodeToken(token)
      const {username, role } = decodedToken;
      //console.log("User Role is : "+ role.toString())
      return role.toString();

    }
    return 'null'

  }
  getUserName(): string{
    const token = localStorage.getItem('token');
    if(token){
      const decodedToken=this.jwtHelper.decodeToken(token)
      const {name,username, role } = decodedToken;
      //console.log("User's Name is ", name.toString())
      return name.toString();

    }
    return 'null'
  }
  getUserId():number{
    const token = localStorage.getItem('token');
    if(token){
      const decodedToken=this.jwtHelper.decodeToken(token)
      const {name,username, role,serial } = decodedToken;
      //console.log("User's Name is ", name.toString())
      return serial;

    }
    return 0;
  }

  getUsername() : string{
    const token = localStorage.getItem('token');
    if(token){
      const decodedToken=this.jwtHelper.decodeToken(token)
      const {name,username, role } = decodedToken;
      //console.log("User's Name is ", name.toString())
      return username.toString();

    }
    return 'null'
  }
}
