import { HttpClient } from '@angular/common/http';
import { Component,Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { DownloadfileService } from '../downloadfile.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit{
  password:string;
  security_question:string;
  security_answer:string;

  showUsername:boolean = true;
  showSecurity : boolean = false;
  showPassword : boolean = false;
  forgotPassword : boolean =false;
  username:string;
  serial:number;
  allUsers:any[]=[];
  actualAnswer:string;
  reEnterPassword:string;
  credentials:any[]=[];
  constructor(
    public dialogRef: MatDialogRef<ChangePasswordComponent>,
   private http:HttpClient,
   private auth : AuthService,
   private router: Router,
   private service : DownloadfileService
  ) {
  }


  ngOnInit(): void {
    if(this.service.getRequestFromForgotPassword()){
      this.forgotPassword=true;
      
    } else {
    this.getUserDetails()
    }
  }


  getUserDetails(){
    console.log("User Id ",this.auth.getUserId())
    this.http.get("http://13.126.46.248:8085/api/zrc/user/usercredentials"+"/"+this.auth.getUserId()).subscribe((resultData : any) => {
      if(resultData.status === 'false'){
        alert("Error getting data")
        console.log(resultData)
      } else {
        console.log("Success",resultData.data[0].role)
        this.credentials=resultData.data
         this.security_question= resultData.data[0].security_question;
         this.security_answer= resultData.data[0].security_answer;
        // console.log(this.securityAnswer +" ans" + this.securityQuestion)
      }
    })

  }

  onNoClick(): void {
    this.dialogRef.close();
  }


  onSaveClick(): void {
    
    if(this.forgotPassword){
      this.serial=this.serial;
    } else {
      this.serial=this.auth.getUserId()
    }
    console.log("pass", this.password)
    let bodyData={
      password:this.password,
      security_question : this.security_question,
      security_answer:this.security_answer
    }
    this.http.put("http://13.126.46.248:8085/api/zrc/user/update/usercredentails"+"/"+this.serial,bodyData).subscribe((resultData : any) => {
      if(resultData.status === 'false'){
        alert("Change Password Failed")
        console.log(resultData)
      } else {
        alert("Password Successfuly Changed")
        alert("Please Login With your New Password")
        this.auth.logout();
        this.router.navigate(["login"]);
        this.forgotPassword=false;
        
      }
    })
    this.dialogRef.close(bodyData);
  
  }

  checkUsername(){

    this.http.get("http://13.126.46.248:8085/api/zrc/register/getuser"+"/"+this.username).subscribe((resultData : any) =>{
      if(resultData.status === 'false'){
        alert("Error checking username")
        console.log(resultData)
        
      } else {
        let usernameFound = false;
        this.allUsers=resultData.data;
        for(let user of this.allUsers){
          if(this.username === user.username){
            this.serial=user.serial;
            this.actualAnswer=user.security_answer;
            this.security_question=user.security_question;
            usernameFound=true;
            break;
          }
        }
        if(usernameFound){
        console.log("Success Serial" , this.serial)
          this.showUsername=false;
          this.showSecurity=true;
        } else {
          alert("No User for with Username : "+this.username);
        }
      }
    })
  
  }

  checkSecurityQuestion(){

    
    if(this.security_answer.toLowerCase() === this.actualAnswer.toLowerCase()){
      this.showSecurity=false;
      this.showPassword=true;
    } else {
      alert("Wrong Answer")
    }
  

  }

  changePassword(){
 

    if(this.password === this.reEnterPassword){
      this.onSaveClick()
    } else{
      alert("passwords Do not Match")
    }

  
}
}
