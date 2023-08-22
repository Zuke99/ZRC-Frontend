import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';

@Component({
  selector: 'app-add-masterlist',
  templateUrl: './add-masterlist.component.html',
  styleUrls: ['./add-masterlist.component.css']
})
export class AddMasterlistComponent {
  product_name:string;
  ph_number:number;


  constructor(private http:HttpClient){}


  //Numbers Allowed Validation
onlyNumbers(event:any):boolean{
  const charCode=(event.which)?event.which:event.keyCode;

  if(charCode>31 && (charCode < 48 || charCode > 57)){
    console.log('Only Numbers Allowed'+charCode)
    return false;
  }

  return true;
}


validate(){
  var form = document.getElementsByClassName('needs-validation')[0] as HTMLFormElement;
  if (form.checkValidity() === false) {
  alert("enter all details");
  }
  else{
  
    this.submit();
  }
  form.classList.add('was-validated');
  
}

submit(){
  let bodyData={
    "product_name":this.product_name,
    "ph_number":this.ph_number
  }
  this.http.post("http://13.126.46.248:8085/api/zrc/master/addmaster",bodyData).subscribe((resultData : any) => {
    (error : any) =>{
      console.log("Error Sending Master List Data")
    } 
      alert("Adding Successful")
      console.log(resultData.data)
    
  })

}



}
