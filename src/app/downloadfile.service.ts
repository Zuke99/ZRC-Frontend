import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DownloadfileService {


  serial:number=-1;
  color:string;
  fileNmae:string;
  indentSl:number;
  balance:number;
  call:boolean=true;
  reqSource: boolean = false;
  qty:number;
  userIndentSl:number;
  reqSourceEdit:boolean = false;
  reqSourceHomePage: boolean =false;
  requestFromMaster: boolean = false;
  forgotPassword : boolean = false;
  irptextBox : string ="";
  constructor(private http:HttpClient) { }
  // private subject = new Subject<any>();

  // sendClickEvent(){
  //   this.subject.next(1);
  // }
  // getClickEvent():Observable<any>{
  //   return this.subject.asObservable();
  // }

  setCall(data : boolean){
    this.call=data
  }
  getCall(){
    console.log("Is Request Coming from Reports Page?", this.call)
    return this.call
  }
  setSerial(data:number){
    this.serial=data;
  }
  getSerial(){
    return this.serial
  }
  getColor(){

    return this.color
  }
  setColor(data:string){

    this.color=data
  
  }
  setFileName(data:string){
    this.fileNmae=data;
  }
  getFileName(){
    return this.fileNmae
  }
  setIndentSl(data:number){
    this.indentSl=data
  }
  getIndentSl(){
    return this.indentSl
  }
  setBalance(data:any){
    this.balance=data;
  }
  getBalance(){
    return this.balance;
  }
  setRequestSource(data : any){
    this.reqSource=data;
  }

  getRequestSource() : boolean{
    console.log("Is Request Coming from USer's Requested Indents? ", this.reqSource)
    return this.reqSource
  }

  setQuantity(data : any){
    this.qty=data;
  }
  getQuantity(){
    return this.qty
  }

  setUserIndentSl(data : any){
    this.userIndentSl=data
  }

  getUserIndentSl(){
    return this.userIndentSl;
  }

  setRequestSourceEdit(data : any){
    this.reqSourceEdit=data
  }

  getRequestSourceEdit(): boolean{
    console.log("Is Request coming from Edit Indents?", this.reqSourceEdit)
    return this.reqSourceEdit;
  }

  setRequestSourceHomePage(data : any){
    this.reqSourceHomePage=data
  }

  getRequestSourceHomePage(){
    return this.reqSourceHomePage;
  }
  setRequestFromMaster( data : any){
     this.requestFromMaster= data;

  }
  getRequestFromMaster(){
      return this.requestFromMaster;
  }

  setRequestFromForgotPassword( data : any){
    this.forgotPassword=data;
  }

  getRequestFromForgotPassword(){
    return this.forgotPassword;
  }

  setIrpTextBox(data : any){
    this.irptextBox=data;
  }
  getIrpTextBox(){
    return this.irptextBox;
  }


 


  downloadFile(name: any){
    return this.http.get('http://13.126.46.248:8085/api/zrc/download'+'/'+name,{
      responseType:'blob'
    })
  }

 
}
