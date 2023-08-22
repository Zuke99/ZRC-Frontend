import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { ChangePasswordComponent } from '../change-password/change-password.component';
import { MatDialog } from '@angular/material/dialog';
import { DownloadfileService } from '../downloadfile.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  username: string;
  password: string;
  constructor(
    private http: HttpClient,
    private router: Router,
    private auth: AuthService,
    public dialog: MatDialog,
    private service :DownloadfileService
  ) {}
  ngOnInit(): void {
    // Making sure User is logged out before getting into login Page
    this.auth.logout();
  }

  //Validating Credentials and Logging In
  login() {
    let bodyData = {
      username: this.username,
      password: this.password,
    };
    this.http
      .post('http://13.126.46.248:8085/api/zrc/login/loginuser', bodyData)
      .subscribe((resultData: any) => {
        (error: any) => {
          console.log('Error sending login data', error);
        };

        if (resultData.message === 'nouser') {
          alert('No User Found with Username ' + this.username);
        } else if (resultData.status == false) {
          //console.log("this here "+resultData.status+" this password " + this.password)
          alert('Password Incorrect');
        } else {
          localStorage.setItem('token', resultData.token);
          console.log('Login Successsful, Token : ');
          this.router.navigate(['/search-bar']);
          //console.log("this here "+resultData.data+" this password " + this.password)
        }
      });
  }

  openDialog(): void {
    this.service.setRequestFromForgotPassword(true)
    try{
    const dialogRef = this.dialog.open(ChangePasswordComponent, {
      width: '600px',
      height: 'fit-content',
      data: { input1: '', input2: '' }
    });
    dialogRef.afterClosed().subscribe((result) => {
      console.log('The dialog was closed');
      console.log('Result:', result);
      // Perform any desired actions with the returned data
    });
  } catch(error) {
    console.log("SOME ERROR")
  }
  }
}
