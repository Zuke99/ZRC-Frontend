import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ThumbnailViewService } from '@syncfusion/ej2-angular-pdfviewer';
import { invalid } from 'moment';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit{

  users : any[]=[];
  username:string;
  password:string;
  repeatPassword:string;
  name:string;
  role:string="User";
  yesno: boolean;

  viewUsers:boolean = false;
  constructor(private http : HttpClient){}
  ngOnInit(): void {
    this.getAllUsers()
  }

  toggleViewUsers(){
    if(this.viewUsers){
      this.viewUsers=false;
    } else {
      this.viewUsers=true;
    }
  }
  validate(){
    var form = document.getElementsByClassName('needs-validation')[0] as HTMLFormElement;
    if (form.checkValidity() === false) {
    alert("enter all details");
    }
    else if(this.password != this.repeatPassword){
      alert("passwords do not match")
      var element= document.getElementById("form3Example4cd");
      
    }
    else
    {
    
      this.register()
    }
    form.classList.add('was-validated');
    
  }
  register(){
  
   
    if(this.chechUsername()){
      console.log("entered")
    
    let bodyData={
      "username":this.username,
      "password":this.password,
      "name":this.name,
      "role":this.role
    }
    this.http.post("http://13.126.46.248:8085/api/zrc/register/registeruser",bodyData).subscribe((resultData : any ) => {
      (error : any) => {
        console.log("Error Sending Resgister Details to Db", error)
      }
      console.log("REGISTER SET TOKEN")
      alert("User Added")
      this.users=resultData.data
      console.log(resultData.data)
      window.location.reload()
    })
  }
    
  }

  getAllUsers(){
    console.log("get all called")
    this.http.get("http://13.126.46.248:8085/api/zrc/register/getuser"+"/"+this.username).subscribe((resultdata : any) => {
      (error : any) => {
        console.log("error getting users", error)
      }
      this.users=resultdata.data
    })
  }

  chechUsername(): boolean{
    console.log("checkUsername called" ,)
    for(let user of this.users){
      if(user.username == this.username){
        alert("Username already exists! Please use a different UserName")
        return false
      }
    }
    return true
  }

  //Delete user form DB
  deleteUser(serial : number){
    this.http.delete("http://13.126.46.248:8085/api/zrc/user/delete/deleteuser"+"/"+serial).subscribe((resultData : any) => {
      alert(resultData.message)
      window.location.reload()
    } )
  }
}
