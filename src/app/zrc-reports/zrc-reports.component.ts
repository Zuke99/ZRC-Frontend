import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { DownloadfileService } from '../downloadfile.service';
import { Router } from '@angular/router';
import * as saveAs from 'file-saver';

@Component({
  selector: 'app-zrc-reports',
  templateUrl: './zrc-reports.component.html',
  styleUrls: ['./zrc-reports.component.css']
})
export class ZrcReportsComponent implements OnInit{
  dropDownValues:any[]=[];
  zrc_fy:string="";
  zrcData:any[]=[]
  months:number[]=[];
  month:number;

  constructor(private http:HttpClient, private service : DownloadfileService, private router: Router){}

  ngOnInit(): void {
    this.loadZrcFyDropDown()
    this.generateMonths()
    
    
  }

  loadZrcFyDropDown(){
    this.http.get("http://13.126.46.248:8085/api/zrc/tracker/zrcfyload").subscribe(( resultData : any) => {
        (error : any) => {
          console.log("error getting data from tracker for zrcfy DropDown "+error)
        }
        this.dropDownValues=resultData.data
        console.log("data from tracker success",this.dropDownValues)
        const currentMonth=new Date().getMonth()
        let currentFY:string="";
        if(currentMonth >= 3){
          // adding financial year to database
          let currentYear=new Date().getFullYear();
          currentFY=currentYear.toString() +" - "+ ((currentYear%100)+1).toString()
          console.log("current FY",currentFY)

        } else {
          let currentYear=new Date().getFullYear()-1;
          currentFY=currentYear.toString() +" - "+ ((currentYear%100)+1).toString()
          console.log("current FY",currentFY)

        }
        
        this.zrc_fy=currentFY
        console.log("cyrr fy",currentFY +" and zrcfy" + this.zrc_fy)
        this.loadZrcData()
    })
  }


  loadZrcData(){
  


  console.log("zrc_fy insise LOAD ZRC",this.zrc_fy)
  let str: string = encodeURIComponent(this.zrc_fy.toString());
  
    this.http.get("http://13.126.46.248:8085/api/zrctable/"+this.zrc_fy).subscribe((resultData : any) => {
      (error : any) => {
        console.log("error getting data from zrc table",error)
      }
      this.zrcData=resultData.data;
      console.log(this.zrcData)
    })

  }
  viewZRC(file : any){
    this.service.downloadFile(file).subscribe((data:Blob | MediaSource)=>{
      (error : any) => {
        alert("File not Found")
        console.log("error downloading file",error)
      }
      let downloadURL=window.URL.createObjectURL(data)
      saveAs(downloadURL)
    })
  }

  getRowColor(zrcValidUpto: Date): string {
    const currentDate = new Date();
    const validUptoDate = new Date(zrcValidUpto);
    
    // Compare the current date with the ZRC Valid Upto date
    if (currentDate > validUptoDate) {
      // Past date, set color to red
      console.log("red");
      return 'expired-row';
    } else {
      // Future date, set color to green
      console.log("green");
      return 'valid-row';
    }
  }

  getBalanceRowColor(zrcBalance:number):string{
    if(zrcBalance>0){
      return 'valid-balance-row'
    } else {
      return 'expired-balance-row'
    }
  }

  generateMonths(){
    let index =0
    for(let i=1;i<=12;i++){
        this.months[index]=i;
        index++;
    }
  }

  expiringZrcs(){
    this.http.get("http://13.126.46.248:8085/api/zrc/expiring/expirydate"+"/"+this.month).subscribe((resultData : any) => {
      (error : any)=>{
          console.log("error getting data from DB",error)
      } 
      this.zrcData=resultData.data
      console.log("expiring zrc data from db",this.zrcData)
      
    })
  }
}
