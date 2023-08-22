import { Component, OnInit, ViewChild } from '@angular/core';
import { DownloadfileService } from '../downloadfile.service';
import { HttpClient } from '@angular/common/http';
import { Router, RouterLinkWithHref } from '@angular/router';
import * as moment from 'moment-timezone';
import { IndentLetterComponent } from '../indent-letter/indent-letter.component';
import { AuthService } from '../auth.service';
import { __await } from 'tslib';

@Component({
  selector: 'app-indent',
  templateUrl: './indent.component.html',
  styleUrls: ['./indent.component.css']
})
 export  class  IndentComponent implements OnInit{

  isResultLoaded=false;
  zrcArray:any[]=[];
  editIndentArray:any[]=[];


  qty:number;
  result:number=0;
  num2=0;

  today_date=new Date()

  indents_sl:any;

  ph_number:number;
  product_name:string="";
  balance_available:number;
  qty_required:number=0;
  zrc_number:string="";
  zrc_valid_from:Date;
  zrc_valid_upto:Date;
  qty_annual_indent:number;
  qty_pcmd:number;
  qty_indented:number;
  qty_recd:number=0;
  qty_indented_supl:number=0;
  qty_recd_supl:number=0;
  qty_indented_supl_date= new Date();
  qty_recd_supl_date= new Date();
  balance_hand:number=0;
  fresh_stock_date:string="Fresh stock required immediately";
  remarks:string="Item is indented as and when required for use at CH/LGD";
  last_indent_date: Date | null;  
  qty_last_indent:number=0;
  zrc_serial:number;
  date_of_indent=this.today_date;
  zrc_fy:Date;
  extra_remarks:string="NA";
  zrc_balance:number;
  po_status:number=0;
  supply_status:number=0;

  indent_ami:string='yes';
  irpYesNo:string;
  irpTextBox:string="Non Proprietary";
  qty_expended:number=0;
  qty_expended_date= new Date()
  qty_additional:string="Not Applicable";
  equal_substitute:string='no';

  indentArray:any[]=[];
  curr_indentArray:any={};

  financialYear:string;


  old_qty:number;

  status:string="Pending";

  thisGetResourceEdit:boolean =false;

  @ViewChild(IndentLetterComponent) indentLetterComponent : IndentLetterComponent

  constructor(private service:DownloadfileService,private http:HttpClient,private router:Router, private auth : AuthService){
  
    }
  
  ngOnInit(): void{
    

    if(this.service.getRequestSourceEdit()){
      this.thisGetResourceEdit=true;
      this.service.setRequestSourceEdit(false)

      
      this.getEditIndents()
    }
    else {
      console.log("IN ELSE")
    this.zrc_serial=this.service.getSerial()
   this.search()
   this.searchIndents()
   this.getIndentSl()
   this.calculateDates()
   this.service.setBalance(this.zrc_balance)
   this.financialYear = this.generateFinancialYear();
   this.qty_required=this.service.getQuantity()
   this.service.setQuantity(0)
   this.irpTextBox=this.service.getIrpTextBox()
   if(this.irpTextBox === 'Non Proprietary'){
    this.irpYesNo='no'
} else {
  this.irpYesNo='yes'
}
    }

   
  

  }
  onlyNumbers(event:any):boolean{
    const charCode=(event.which)?event.which:event.keyCode;
  
    if(charCode>31 && (charCode < 48 || charCode > 57)){
      console.log('Only Numbers Allowed'+charCode)
      return false;
    }
   
  
    return true;
  }
  searchIndents(){
    this.http.get("http://13.126.46.248:8085/api/zrc/getallindents-by-zrc-serial"+"/"+this.zrc_serial).subscribe((resultData:any)=>{
    this.indentArray=resultData.data;
    if(this.indentArray.length > 0){
      console.log("all indents array",this.indentArray)
     this.curr_indentArray=this.indentArray[this.indentArray.length-1];
     this.last_indent_date=this.curr_indentArray.date_of_indent;
     this.qty_last_indent=this.curr_indentArray.qty_required;
    }
    
  })

  }

  //Checking for previous PO SUPPLY STATUS
  checkPoStatus(): boolean{
   
    
    if(this.zrcArray){
        if(this.zrcArray[0].po_status == 1){
          return true;
        }
        else {
          alert("Previous PO is still Pending, Cannot Place Indent")
          return false;
        }
    }
    return false;
  }

  checkSupplyStatus() : boolean{
  
    if(this.zrcArray){
      if(this.zrcArray[0].supply_status == 1){
        return true;
      } else {
        alert("Previous Supply is still Pending, Cannot Place Indent");
        return false;
      }
    }
    return false;

  }

  //SEarching from ZRC Table for AutoFill values
  search(): Promise <void>{
    return new Promise((resolve , reject) =>{
      this.http.get("http://13.126.46.248:8085/api/zrc/indent"+"/"+this.zrc_serial)
      .subscribe((resultData:any)=>
      {
        this.isResultLoaded=true;

        this.zrcArray=resultData.data;
      // console.log("zrcArray Result "+this.zrcArray[0].qty)
  
      this.qty_indented=this.zrcArray[0].qty_indented
        this.qty=this.zrcArray[0].qty
        this.ph_number=this.zrcArray[0].ph_number
        this.product_name=this.zrcArray[0].product_name
        this.balance_available=this.zrcArray[0].Balance
        this.zrc_number=this.zrcArray[0].zrc_number
        this.zrc_valid_from=this.zrcArray[0].zrc_valid_from
        this.zrc_valid_upto=this.zrcArray[0].zrc_valid_upto
        this.zrc_balance=this.zrcArray[0].Balance
        this.qty_annual_indent=this.zrcArray[0].qty
        this.qty_pcmd=this.zrcArray[0].qty
        this.zrc_fy=this.zrcArray[0].zrc_fy
  
        //setting balance to get it in letter
        this.service.setBalance(this.zrc_balance)
   
        
  
        if(this.qty_indented > 0)
        this.result=this.qty_indented;
       
        if(this.zrcArray.length===0){
          alert("No Data Available with Serial Number "+this.zrc_serial);
        }
        resolve()
      },
      (error: any) =>{
        reject(error)
      }
      )
      // if(this.studentArray.length===0)
      // {
      //   alert("No Data Available with PH Number"+this.ph_number);
      // }
    })
   
    
  }

  //Calculating Quantity Results
  // calculateResult(event : any){
  //   this.result=this.qty_indented
  //  this.result=this.result+this.qty_required;

  // }
  validate(data : any){
    var form = document.getElementsByClassName('needs-validation')[0] as HTMLFormElement;
    if (form.checkValidity() === false) {
    alert("enter all details");
    }
    else{

      if(this.thisGetResourceEdit){ //if this page got redirected from edit indent then it should update it instead of submitting
          this.updateIndent(data)
      }

      this.checkRole()

    
    }
    form.classList.add('was-validated');
    
  }

 async submit(){
   await this.search()
    if(this.balanceCheck()==true && this.checkPoStatus() && this.checkSupplyStatus()){
      if(this.qty_required==0){
        alert("Quantity for Indent Cannot be 0")
      }
      else {
      if(!this.last_indent_date){
        console.log("blank date****************************")
        this.last_indent_date=new Date()
        this.last_indent_date.setFullYear(1000)

        
      }
      

      const datetime1=new Date(this.zrc_valid_from)
      const datetime2=new Date(this.zrc_valid_upto)
      const datetime3=new Date(this.qty_indented_supl_date)
      const datetime4=new Date(this.qty_recd_supl_date)
      const datetime5=new Date(this.last_indent_date)
      const datetime6=new Date(this.date_of_indent)
      const datetime7=new Date(this.qty_expended_date)



      console.log("before converting ",datetime1)
      console.log("before converting ",datetime2)
      console.log("before converting ",datetime3)
      console.log("before converting ",datetime4)
      console.log("before converting ",datetime5)
      console.log("before converting ",datetime6)
      console.log("before converting ",datetime7)



      const formattedDateTime1 = moment(datetime1).tz('Asia/Kolkata').format('YYYY-MM-DDTHH:mm:ss');
      const formattedDateTime2 = moment(datetime2).tz('Asia/Kolkata').format('YYYY-MM-DDTHH:mm:ss');
      const formattedDateTime3 = moment(datetime3).tz('Asia/Kolkata').format('YYYY-MM-DDTHH:mm:ss');
      const formattedDateTime4 = moment(datetime4).tz('Asia/Kolkata').format('YYYY-MM-DDTHH:mm:ss');
      const formattedDateTime5 = moment(datetime5).tz('Asia/Kolkata').format('YYYY-MM-DDTHH:mm:ss');
      const formattedDateTime6 = moment(datetime6).tz('Asia/Kolkata').format('YYYY-MM-DDTHH:mm:ss');
      const formattedDateTime7 = moment(datetime7).tz('Asia/Kolkata').format('YYYY-MM-DDTHH:mm:ss');



      const formattedDateTimeWithZeroTime1 = moment(formattedDateTime1).startOf('day').format('YYYY-MM-DDTHH:mm:ss');
      const formattedDateTimeWithZeroTime2 = moment(formattedDateTime2).startOf('day').format('YYYY-MM-DDTHH:mm:ss');
      const formattedDateTimeWithZeroTime3 = moment(formattedDateTime3).startOf('day').format('YYYY-MM-DDTHH:mm:ss');
      const formattedDateTimeWithZeroTime4 = moment(formattedDateTime4).startOf('day').format('YYYY-MM-DDTHH:mm:ss');
      const formattedDateTimeWithZeroTime5 = moment(formattedDateTime5).startOf('day').format('YYYY-MM-DDTHH:mm:ss');
      const formattedDateTimeWithZeroTime6 = moment(formattedDateTime6).startOf('day').format('YYYY-MM-DDTHH:mm:ss');
      const formattedDateTimeWithZeroTime7 = moment(formattedDateTime7).startOf('day').format('YYYY-MM-DDTHH:mm:ss');
    


      console.log("Sending Date ",formattedDateTimeWithZeroTime1)
      console.log("Sending Date ",formattedDateTimeWithZeroTime2)
      console.log("Sending Date ",formattedDateTimeWithZeroTime3)
      console.log("Sending Date ",formattedDateTimeWithZeroTime4)
      console.log("Sending Date ",formattedDateTimeWithZeroTime5)
      console.log("Sending Date ",formattedDateTimeWithZeroTime6)
      console.log("Sending Date ",formattedDateTimeWithZeroTime7)
      


    let bodyData={
      ph_number:this.ph_number,
product_name:this.product_name,
balance_available:this.balance_available,
qty_required:this.qty_required,
zrc_number:this.zrc_number,
zrc_valid_from:formattedDateTimeWithZeroTime1,
zrc_valid_upto:formattedDateTimeWithZeroTime2,
indent_ami:this.indent_ami,
qty_annual_indent:this.qty_annual_indent,
qty_pcmd:this.qty_pcmd,
qty_indented:this.result,
qty_recd:this.qty_recd,
qty_indented_supl:this.qty_indented_supl,
qty_recd_supl:this.qty_recd_supl,
qty_indented_supl_date:formattedDateTimeWithZeroTime3,
qty_recd_supl_date:formattedDateTimeWithZeroTime4,
balance_hand:this.balance_hand,
fresh_stock_date:this.fresh_stock_date,
remarks:this.remarks,
last_indent_date:formattedDateTimeWithZeroTime5,
qty_last_indent:this.qty_last_indent,
zrc_serial:this.zrc_serial,
date_of_indent:formattedDateTimeWithZeroTime6,
zrc_fy:this.zrc_fy,
indents_sl:this.indents_sl,
extra_remarks:this.extra_remarks,
po_status:this.po_status,
supply_status:this.supply_status,
qty_expended:this.qty_expended,
qty_expended_date:formattedDateTimeWithZeroTime7,
irpTextBox:this.irpTextBox,
qty_additional:this.qty_additional,
equal_substitute:this.equal_substitute,
fy:this.financialYear




    }
console.log("DATA GOING  " , bodyData)
    this.http.post("http://13.126.46.248:8085/api/zrc/addindent",bodyData).subscribe((resultData:any)=>{
  
      
      
      //this.router.navigate(['indent-letter'])
      this.service.setIndentSl(this.indents_sl)
      this.zrcUpdate()
      this.updateIndentSl()
      this.service.setCall(true)
      alert("Indent Placed")
      if(this.service.getRequestSource()){
          this.updateUserIndent()
      }
      this.service.setSerial(-1)
      this.router.navigate(['indent-letter'])

   
      
      
    })
  }
}
  }

  //Updatwe Status of User Indent In USer_indents Table

  updateUserIndent(){
    let serial =this.service.getUserIndentSl()
    let bodyData={
      approval_status:'Approved',
      executive:this.auth.getUserName()
    }
    this.http.put("http://13.126.46.248:8085/api/zrc/userindent/updatestatus"+"/"+serial,bodyData).subscribe((resultData : any) => {
  
      this.service.setRequestSource(false)
    })
  }



  //Update balance and Qty Indented in ZRC TABLE
  zrcUpdate(){
 
    this.zrc_balance=this.zrc_balance-this.qty_required
    this.qty_indented=this.result+this.qty_required
    
    let bodyData={
      zrc_balance:this.zrc_balance,
      qty_indented:this.qty_indented,
      po_status:this.po_status,
      supply_status:this.supply_status
    }
    this.http.put("http://13.126.46.248:8085/api/zrc/balanceUpdate"+"/"+this.zrc_serial,bodyData).subscribe((resultData:any)=>{
      console.log("Balance AND PO status updated in ZRC Table")
    }
    )
  
  }

  balanceCheck():boolean {
    if(this.qty_required > this.zrc_balance){
    alert("Quantity Required Cannot be greater than Balance");
    return false;
    }
    return true;
  }

  getIndentSl(){
    this.http.get("http://13.126.46.248:8085/api/zrc/tracker/indentsl").subscribe((resultData:any)=>{
      this.indents_sl=resultData.data[0].last_indent_sl;
      console.log("SERIAL " ,resultData.data[0].last_indent_sl)
      this.service.setIndentSl(this.indents_sl)
    
    })

  }
  updateIndentSl(){
    let num=this.indents_sl+1;
    let bodyData={
      last_indent_sl:num
    }
    this.http.put("http://13.126.46.248:8085/api/zrc/tracker/updatelastsl",bodyData).subscribe((resultData : any) =>{
      console.log("update sl indent succesful")
    })
  }

  //CALCULATING FINANCIAL YEAR DATES
  calculateDates(){
    // this.today_date.setDate(1)
    // this.today_date.setMonth(3)
    // this.today_date.setFullYear(2028)
    if(this.today_date.getMonth()>=3){
      this.qty_indented_supl_date.setDate(1);
      this.qty_indented_supl_date.setMonth(3);
      this.qty_indented_supl_date.setFullYear(this.today_date.getFullYear())
      this.qty_recd_supl_date=this.qty_indented_supl_date
      this. qty_expended_date=this.qty_indented_supl_date
    }
    else{
      this.qty_indented_supl_date.setDate(1);
      this.qty_indented_supl_date.setMonth(3);
      this.qty_indented_supl_date.setFullYear(this.today_date.getFullYear()-1)
      this.qty_recd_supl_date=this.qty_indented_supl_date
      this. qty_expended_date=this.qty_indented_supl_date
    }
  }

  generateFinancialYear(): string {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();
  
    // Determine the starting year of the financial year
    let financialYearStart;
    if (currentMonth >= 3) {
      financialYearStart = currentYear;
    } else {
      financialYearStart = currentYear - 1;
    }
  
    // Determine the ending year of the financial year
    const financialYearEnd = financialYearStart + 1;
  
    // Format the financial year string
    const financialYear = financialYearStart + ' - ' + financialYearEnd;
  
    return financialYear;
  }

  checkRole(){
    const role= this.auth.getUserRole()
    if(role === 'User'){
      this.userSubmit()
    }
    else {
      this.submit()
    }
  }

  userSubmit(){
    if(this.balanceCheck()==true){
      if(this.qty_required==0){
        alert("Quantity for Indent Cannot be 0")
      } else {
        const datetime1=new Date(this.zrc_valid_from)
        const datetime2=new Date(this.zrc_valid_upto)
        const datetime6=new Date(this.date_of_indent)

        console.log("before converting ",datetime1)
        console.log("before converting ",datetime2)
        console.log("before converting ",datetime6)

        const formattedDateTime1 = moment(datetime1).tz('Asia/Kolkata').format('YYYY-MM-DDTHH:mm:ss');
        const formattedDateTime2 = moment(datetime2).tz('Asia/Kolkata').format('YYYY-MM-DDTHH:mm:ss');
        const formattedDateTime6 = moment(datetime6).tz('Asia/Kolkata').format('YYYY-MM-DDTHH:mm:ss');


        const formattedDateTimeWithZeroTime1 = moment(formattedDateTime1).startOf('day').format('YYYY-MM-DDTHH:mm:ss');
        const formattedDateTimeWithZeroTime2 = moment(formattedDateTime2).startOf('day').format('YYYY-MM-DDTHH:mm:ss');
        const formattedDateTimeWithZeroTime6 = moment(formattedDateTime6).startOf('day').format('YYYY-MM-DDTHH:mm:ss');

        console.log("Sending Date ",formattedDateTimeWithZeroTime1)
        console.log("Sending Date ",formattedDateTimeWithZeroTime2)
        console.log("Sending Date ",formattedDateTimeWithZeroTime6)

        
        let bodyData={
        ph_number:this.ph_number,
        product_name:this.product_name,
        balance_available:this.balance_available,
        qty_required:this.qty_required,
        zrc_number:this.zrc_number,
        zrc_valid_from:formattedDateTimeWithZeroTime1,
        zrc_valid_upto:formattedDateTimeWithZeroTime2,
        zrc_serial:this.zrc_serial,
        date_of_indent:formattedDateTimeWithZeroTime6,
        user_name:this.auth.getUserName(),
        status:this.status,
        balance_hand:this.balance_hand,
        fresh_stock_date:this.fresh_stock_date,
        remarks:this.remarks,
        indents_sl:this.indents_sl,
        zrc_fy:this.zrc_fy,
        fy:this.financialYear,
        irpTextBox:this.irpTextBox,
        
        acknowledge:0

        }

        console.log("Going Dqata" ,bodyData)

        this.http.post("http://13.126.46.248:8085/api/zrc/indent/userindent",bodyData).subscribe((resultData : any) => {
          if(resultData.status === false){
          alert("Error Placing Indent")
          console.log(resultData)
          } else {
          alert("Indent Submitted")
          this.router.navigate(['indent-letter'])
          this.service.setSerial(-1)
          }
        })
      }

    }
  }
  
  getUserRole(){
   return this.auth.getUserRole()
  }


  getRequestSourceEdit(){

    return this.thisGetResourceEdit
  }

  //***************************** UPDATING INDENT **************************************/

    getEditIndents(){
      this.http.get("http://13.126.46.248:8085/api/zrc/indents/getindentbyserial"+"/"+this.service.getIndentSl()).subscribe((resultData : any) => {
        if(resultData.message === 'error'){
          alert(resultData.message)
          console.log(resultData.data)
        } else {
          console.log("edit Indent array",resultData.data)
          this.editIndentArray=resultData.data
          this.old_qty=this.editIndentArray[0].qty_required
          if(this.editIndentArray[0].irpTextBox === 'Non Proprietary'){
              this.irpYesNo='no'
          } else {
            this.irpYesNo='yes'
          }
        }
      })
    }

    updateIndent(data : any){
      console.log("Inside update Indent")
      if(this.balanceCheckEdit(data)==true ){
        if(data.qty_required==0){
          alert("Quantity for Indent Cannot be 0")
        }
        else {
        if(!data.last_indent_date){
          console.log("blank date****************************")
          data.last_indent_date=new Date()
          data.last_indent_date.setFullYear(1000)
  
          
        }
        
  
        const datetime1=new Date(data.zrc_valid_from)
        const datetime2=new Date(data.zrc_valid_upto)
        const datetime3=new Date(data.qty_indented_supl_date)
        const datetime4=new Date(data.qty_recd_supl_date)
        const datetime5=new Date(data.last_indent_date)
        const datetime6=new Date(data.date_of_indent)
        const datetime7=new Date(data.qty_expended_date)
  
  
  
        console.log("before converting ",datetime1)
        console.log("before converting ",datetime2)
        console.log("before converting ",datetime3)
        console.log("before converting ",datetime4)
        console.log("before converting ",datetime5)
        console.log("before converting ",datetime6)
        console.log("before converting ",datetime7)
  
  
  
        const formattedDateTime1 = moment(datetime1).tz('Asia/Kolkata').format('YYYY-MM-DDTHH:mm:ss');
        const formattedDateTime2 = moment(datetime2).tz('Asia/Kolkata').format('YYYY-MM-DDTHH:mm:ss');
        const formattedDateTime3 = moment(datetime3).tz('Asia/Kolkata').format('YYYY-MM-DDTHH:mm:ss');
        const formattedDateTime4 = moment(datetime4).tz('Asia/Kolkata').format('YYYY-MM-DDTHH:mm:ss');
        const formattedDateTime5 = moment(datetime5).tz('Asia/Kolkata').format('YYYY-MM-DDTHH:mm:ss');
        const formattedDateTime6 = moment(datetime6).tz('Asia/Kolkata').format('YYYY-MM-DDTHH:mm:ss');
        const formattedDateTime7 = moment(datetime7).tz('Asia/Kolkata').format('YYYY-MM-DDTHH:mm:ss');
  
  
  
        const formattedDateTimeWithZeroTime1 = moment(formattedDateTime1).startOf('day').format('YYYY-MM-DDTHH:mm:ss');
        const formattedDateTimeWithZeroTime2 = moment(formattedDateTime2).startOf('day').format('YYYY-MM-DDTHH:mm:ss');
        const formattedDateTimeWithZeroTime3 = moment(formattedDateTime3).startOf('day').format('YYYY-MM-DDTHH:mm:ss');
        const formattedDateTimeWithZeroTime4 = moment(formattedDateTime4).startOf('day').format('YYYY-MM-DDTHH:mm:ss');
        const formattedDateTimeWithZeroTime5 = moment(formattedDateTime5).startOf('day').format('YYYY-MM-DDTHH:mm:ss');
        const formattedDateTimeWithZeroTime6 = moment(formattedDateTime6).startOf('day').format('YYYY-MM-DDTHH:mm:ss');
        const formattedDateTimeWithZeroTime7 = moment(formattedDateTime7).startOf('day').format('YYYY-MM-DDTHH:mm:ss');
      
  
  
        console.log("Sending Date ",formattedDateTimeWithZeroTime1)
        console.log("Sending Date ",formattedDateTimeWithZeroTime2)
        console.log("Sending Date ",formattedDateTimeWithZeroTime3)
        console.log("Sending Date ",formattedDateTimeWithZeroTime4)
        console.log("Sending Date ",formattedDateTimeWithZeroTime5)
        console.log("Sending Date ",formattedDateTimeWithZeroTime6)
        console.log("Sending Date ",formattedDateTimeWithZeroTime7)
        
  
  
      let bodyData={
        ph_number:data.ph_number,
  product_name:data.product_name,
  balance_available:data.balance_available,
  qty_required:data.qty_required,
  zrc_number:data.zrc_number,
  zrc_valid_from:formattedDateTimeWithZeroTime1,
  zrc_valid_upto:formattedDateTimeWithZeroTime2,
  indent_ami:data.indent_ami,
  qty_annual_indent:data.qty_annual_indent,
  qty_pcmd:data.qty_pcmd,
  qty_indented:data.qty_indented,
  qty_recd:data.qty_recd,
  qty_indented_supl:data.qty_indented_supl,
  qty_recd_supl:data.qty_recd_supl,
  qty_indented_supl_date:formattedDateTimeWithZeroTime3,
  qty_recd_supl_date:formattedDateTimeWithZeroTime4,
  balance_hand:data.balance_hand,
  fresh_stock_date:data.fresh_stock_date,
  remarks:data.remarks,
  last_indent_date:formattedDateTimeWithZeroTime5,
  qty_last_indent:data.qty_last_indent,
  zrc_serial:data.zrc_serial,
  date_of_indent:formattedDateTimeWithZeroTime6,
  zrc_fy:data.zrc_fy,
  indents_sl:data.indents_sl,
  extra_remarks:data.extra_remarks,
  po_status:data.po_status,
  supply_status:data.supply_status,
  qty_expended:data.qty_expended,
  qty_expended_date:formattedDateTimeWithZeroTime7,
  irpTextBox:data.irpTextBox,
  qty_additional:data.qty_additional,
  equal_substitute:data.equal_substitute,
  fy:data.fy
  
  
  
  
  
      }
  
      this.http.put("http://13.126.46.248:8085/api/zrc/indent/updateindent"+"/"+data.serial,bodyData).subscribe((resultData:any)=>{
        console.log(resultData);
        
        
        //this.router.navigate(['indent-letter'])
       // this.service.setIndentSl(this.indents_sl)
        this.zrcUpdateEdit(data)
        this.service.setCall(false)
        alert("Indent Updated")
        if(this.service.getRequestSource()){
            this.updateUserIndent()
        }
        this.service.setSerial(-1)
        this.router.navigate(['indent-letter'])
  
     
        
        
      })
    }
  }
    }


    zrcUpdateEdit(data : any){
        console.log("New QY+TY" + data.qty_required +"old qty= " +this.old_qty)

      if(data.qty_required != this.old_qty){
        

      if(data.qty_required > this.old_qty){
        this.zrc_balance=data.balance_available - data.qty_required 
        this.qty_indented= data.qty_pcmd - this.zrc_balance
      } else if(data.qty_required < this.old_qty){
     
        this.zrc_balance=data.balance_available - data.qty_required 
        this.qty_indented = data.qty_pcmd - this.zrc_balance
      }
 
      console.log(this.zrc_balance + " edit array " + this.old_qty)
      let bodyData={
        zrc_balance:this.zrc_balance,
        qty_indented:this.qty_indented,
        po_status:this.po_status,
        supply_status:this.supply_status
      }
      this.http.put("http://13.126.46.248:8085/api/zrc/balanceUpdate"+"/"+data.zrc_serial,bodyData).subscribe((resultData:any)=>{
        console.log("Balance AND PO status updated in ZRC Table",resultData)
        if(resultData.status === false ){
          alert("Update Failed")
        }
      }
      )
    }
    
    }

    balanceCheckEdit(data : any):boolean {
      if(data.qty_required > data.balance_available){
      alert("Quantity Required Cannot be greater than Balance");
      return false;
      }
      return true;
    }



}
