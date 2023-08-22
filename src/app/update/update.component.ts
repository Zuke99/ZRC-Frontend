import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { UpdatefileComponent } from '../updatefile/updatefile.component';
import { DownloadfileService } from '../downloadfile.service';
import * as moment from 'moment-timezone';
@Component({
  selector: 'app-update',
  templateUrl: './update.component.html',
  styleUrls: ['./update.component.css'],
})
export class UpdateComponent {
  fileName: string;
  myDate = new Date();
  nextYear = this.myDate.getFullYear();
  number1: number = (this.nextYear % 100) + 1;
  dropDownValues: any[] = [];

  myDate2 = new Date();
  nextYear2 = this.myDate.getFullYear() + 1;
  number2: number = (this.nextYear % 100) + 2;

  myDate3 = new Date();
  nextYear3 = this.myDate.getFullYear() + 2;
  number3: number = (this.nextYear % 100) + 3;
  isResultLoaded = false;
  isUpdateFormActive = false;
  studentItem: any[] = [];

  zrc_fy: string = '';
  product_name: string = '';
  ph_number: Number = 0;
  supplier_name: string = '';
  zrc_number: string = '';
  zrc_date = new Date();
  qty: Number = 0;
  zrc_valid_from = new Date();
  zrc_valid_upto = new Date();
  file: string = '';
  drive_file: string = '';
  remarks:string="NA";

  images: any;
  serial: number;

  ph_number_string: string = '';
  qty_string: string = '';
  zrc_date_string = '';
  zrc_valid_from_string = '';
  zrc_valid_upto_string = '';
  Balance: number;
  actual_quantity: number;

  dateChange: boolean = false;
  newDateChange = new Date();
  qty_indented: number;
  new_balance: number;

  //FileViewEvent
  @ViewChild('singleInput', { static: false })
  singleInput!: ElementRef;

  constructor(
    private http: HttpClient,
    private router: Router,
    private dialogRef: MatDialog,
    private service: DownloadfileService
  ) {}
  ngOnInit(): void {
    this.serial = this.service.getSerial();
    this.getDetails();
    this.loadZrcFyDropDown();
  }
  //select Image Event
  selectImage(event: any) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      console.log(file);
      this.images = file;
    }
  }
  //NUMBERS ONLY VALIDATION
  onlyNumbers(event: any): boolean {
    const charCode = event.which ? event.which : event.keyCode;

    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      console.log('Only Numbers Allowed' + charCode);
      return false;
    }

    return true;
  }

  //   search(){

  //     this.http.get("http://13.126.46.248:8085/api/zrc"+"/"+this.ph_number)
  //     .subscribe((resultData:any)=>
  //     {
  //       this.isResultLoaded=true;
  //       console.log(resultData.data);
  //       this.studentArray=resultData.data;

  //       if(this.studentArray.length===0){
  //         alert("No Data Available with PH Number "+this.ph_number);
  //       }

  //     }
  //     )
  // }

  validate(studentItem: any) {
    var form = document.getElementsByClassName(
      'needs-validation'
    )[0] as HTMLFormElement;
    if (form.checkValidity() === false) {
      alert('enter all details');
    } else {
      this.update(studentItem);
    }

    form.classList.add('was-validated');
  }
  // Get ZRC by serial and Load in Textboxes
  getDetails() {
    this.http
      .get('http://13.126.46.248:8085/api/zrc/indent' + '/' + this.serial)
      .subscribe((resultData: any) => {

        if(resultData.status === false){
          alert("Error Getting ZRC Data")
          console.log("Error Getting ZRC data", resultData)
        } else {
          console.log("Success in getting ZRC Data", resultData)
        this.isResultLoaded = true;
        console.log(resultData.data);
        this.studentItem = resultData.data;
        this.zrc_fy = this.studentItem[0].zrc_fy;
        this.fileName = this.studentItem[0].file;
        this.zrc_valid_from = this.studentItem[0].zrc_valid_from;
        this.zrc_valid_upto = this.studentItem[0].zrc_valid_upto;
        this.zrc_date = this.studentItem[0].zrc_date;
        this.Balance = this.studentItem[0].Balance;
        this.actual_quantity = this.studentItem[0].qty;
        this.qty_indented = this.studentItem[0].qty_indented;
        //console.log('date from db', this.zrc_valid_upto);
        }

        if (this.studentItem.length === 0) {
          alert('No Data Available with Serial Number ' + this.serial);
        }
      });
  }

  //Update Button Click
  update(studentItem: any) {
    if (this.checkDate() && this.updatebalance(studentItem)) {
      this.zrc_date = studentItem.zrc_date;
      //this.zrc_valid_from=studentItem.zrc_valid_from

      //   if(this.dateChange==false){
      // this.zrc_valid_upto=studentItem.zrc_valid_upto
      //   }
      //   else {
      //     this.zrc_valid_upto=this.newDateChange
      //   }

      const datetime1 = new Date(this.zrc_date);
      const datetime2 = new Date(this.zrc_valid_from);
      const datetime3 = new Date(this.zrc_valid_upto);

      console.log('before converting ', datetime1);
      console.log('before converting ', datetime2);
      console.log('before converting ', datetime3);

      // const zrcDate = new Date(this.zrc_date); // Ensure that this.zrc_date is a valid Date object
      // const iso_zrc_date: string = zrcDate.toLocaleDateString('en-GB', {
      //   timeZone: 'Asia/Kolkata',
      // });
      // const zrcDate2 = new Date(this.zrc_valid_from); // Ensure that this.zrc_date is a valid Date object
      // const iso_zrc_date2: string = zrcDate2.toLocaleDateString('en-GB', {
      //   timeZone: 'Asia/Kolkata',
      // });
      // const zrcDate3 = new Date(this.zrc_valid_upto); // Ensure that this.zrc_date is a valid Date object
      // const iso_zrc_date3: string = zrcDate3.toLocaleDateString('en-GB', {
      //   timeZone: 'Asia/Kolkata',
      // });

      const formattedDateTime1 = moment(datetime1)
        .tz('Asia/Kolkata')
        .format('YYYY-MM-DDTHH:mm:ss');
      const formattedDateTime2 = moment(datetime2)
        .tz('Asia/Kolkata')
        .format('YYYY-MM-DDTHH:mm:ss');
      const formattedDateTime3 = moment(datetime3)
        .tz('Asia/Kolkata')
        .format('YYYY-MM-DDTHH:mm:ss');

      const formattedDateTimeWithZeroTime1 = moment(formattedDateTime1)
        .startOf('day')
        .format('YYYY-MM-DDTHH:mm:ss');
      const formattedDateTimeWithZeroTime2 = moment(formattedDateTime2)
        .startOf('day')
        .format('YYYY-MM-DDTHH:mm:ss');
      const formattedDateTimeWithZeroTime3 = moment(formattedDateTime3)
        .startOf('day')
        .format('YYYY-MM-DDTHH:mm:ss');

      console.log('Sending Date ', formattedDateTimeWithZeroTime1);
      console.log('Sending Date ', formattedDateTimeWithZeroTime2);
      console.log('Sending Date ', formattedDateTimeWithZeroTime3);

      this.ph_number_string = this.ph_number.toString();
      this.qty_string = this.qty.toString();
      this.zrc_date_string = formattedDateTime1;
      this.zrc_valid_from_string = formattedDateTime2;
      this.zrc_valid_upto_string = formattedDateTime3;

      let bodydata = {
        zrc_fy: studentItem.zrc_fy,
        product_name: studentItem.product_name,
        ph_number: studentItem.ph_number,
        supplier_name: studentItem.supplier_name,
        zrc_number: studentItem.zrc_number,
        zrc_date: formattedDateTimeWithZeroTime1,
        qty: studentItem.qty,
        zrc_valid_from: formattedDateTimeWithZeroTime2,
        zrc_valid_upto: formattedDateTimeWithZeroTime3,
        Balance: this.new_balance,
        serial: studentItem.serial,
        drive_file: this.drive_file,
        remarks:studentItem.remarks
      };
      this.http
        .put(
          'http://13.126.46.248:8085/api/zrc/update' + '/' + studentItem.serial,
          bodydata
        )
        .subscribe((resultData: any) => {
          if(resultData. status === false){
            alert('Failed To Update ZRC ');
            console.log("Failed TO Update ZRC", resultData)
          } else {
          

          console.log("Success in Updating ZRC",resultData);
          alert('ZRC Record Updated');
          this.router.navigate(['search-bar']);
          }
        });
    }
  }

  updatebalance(studentItem: any): boolean {
    console.log("Updating Balance")
    if (
      studentItem.qty > this.actual_quantity ||
      studentItem.qty < this.actual_quantity
    ) {
      this.new_balance = studentItem.qty - this.qty_indented;
    } else {
      this.new_balance = this.Balance;
    }
    if (studentItem.qty != this.actual_quantity) {
      if (studentItem.qty < this.qty_indented) {
        alert('You cannot update Quantity less than total Indented Quantity');
        return false;
      }
    }

    if (this.new_balance < 0) {
      alert('You cannot update Quantity less than total Indented Quantity');
      return false;
    }

    return true;
  }

  //If USer Wants To Update File
  navigate(serial: any, StudentItem: any) {
    console.log("File Upload Called")
    const dialog = this.dialogRef.open(UpdatefileComponent, {
      height: '30%',
      width: '30%',
      data: {
        id: serial,
      },
    });
    dialog.afterClosed().subscribe((res: any) => {
      console.log(res);
      this.fileName = res;
    });
  }

  loadZrcFyDropDown() {
    this.http
      .get('http://13.126.46.248:8085/api/zrc/tracker/zrcfyload')
      .subscribe((resultData: any) => {
       if(resultData.statu === false){
          alert("Failed To Load ZRC Financial Year DropDown")
          console.log(
            'error getting data from tracker for zrcfy DropDown ' + resultData
          );
       }
       else {
        this.dropDownValues = resultData.data;
        console.log('Success in getting DropDown Values', this.dropDownValues);
        const currentMonth = new Date().getMonth();
        let currentFY: string = '';
        if (currentMonth >= 3) {
          // adding financial year to database
          let currentYear = new Date().getFullYear();
          currentFY =
            currentYear.toString() +
            ' - ' +
            ((currentYear % 100) + 1).toString();
          console.log('current FY', currentFY);
        } else {
          let currentYear = new Date().getFullYear() - 1;
          currentFY =
            currentYear.toString() +
            ' - ' +
            ((currentYear % 100) + 1).toString();
          console.log('current FY', currentFY);
        }

        console.log('cyrr fy', currentFY + ' and zrcfy' + this.zrc_fy);
      }
      });
  }

  //Setting ZRC Valid upto date depending on ZRC VAlid from one year difference
  setDate(tableDate: Date) {
    console.log('SetDate() called');
    const new_date = new Date(tableDate);
    new_date.setFullYear(new_date.getFullYear() + 1);
    new_date.setDate(new_date.getDate() - 1);
    this.newDateChange = new_date;
    this.zrc_valid_upto = new_date;
    //console.log('date after changing ', this.zrc_valid_upto);
    //console.log('new date', new_date);
    this.dateChange = true;
  }

  checkDate(): boolean {
    console.log("Checking If ZRC VALID FROM date is Greater Than ZRC VALID UPTO")
    if (this.zrc_valid_from > this.zrc_valid_upto) {
      alert('ZRC Validity cannot be greater than ZRC Expiry');
      return false;
    }
    return true;
  }
  //Setting ZRC VALID FROM DATE AS SAME AS ZRC DATE
  setZrcValidFromDate() {
    console.log('Setting ZRC valid from date same as ZRC Date called');
    this.zrc_valid_from = this.zrc_date;
  }
}
