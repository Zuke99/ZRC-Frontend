import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-updatefile',
  templateUrl: './updatefile.component.html',
  styleUrls: ['./updatefile.component.css']
})
export class UpdatefileComponent implements OnInit {
  serial:any;
  images:any;
  fileName:string;
    //FileViewEvent
    @ViewChild('singleInput', { static: false })
    singleInput!: ElementRef;
  constructor(@Inject(MAT_DIALOG_DATA) public data:any,private http:HttpClient,private dialogRef: MatDialogRef<UpdatefileComponent>){}

  ngOnInit(): void {
    this.serial=this.data.id;
  }

  //select Image Event
  selectImage(event:any){
    if(event.target.files.length > 0){
      const file=event.target.files[0]
      console.log(file)
      this.images=file
      this.fileName=this.images.name

    }
  }

  validate(){
    var form = document.getElementsByClassName('needs-validation')[0] as HTMLFormElement;
    if (form.checkValidity() === false) {
    alert("enter all details");
    }
    else{
    
      this.updateFile()
    }
    form.classList.add('was-validated');
    
  }
  updateFile(){
   const formData=new FormData();
   formData.append('file',this.images)

   this.http.put("http://13.126.46.248:8085/api/zrc/updatefile"+"/"+this.serial,formData).subscribe((resultData:any)=>{
    console.log(resultData);
    alert("File Update Completed")
    console.log("closing dialog"+this.fileName)
    this.dialogRef.close(this.fileName)

   
   })
  }
  close(){
    this.dialogRef.close()
  }

}
