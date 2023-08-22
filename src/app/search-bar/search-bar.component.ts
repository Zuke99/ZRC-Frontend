import { Component, OnInit } from '@angular/core';
import { DataserviceService } from '../dataservice.service';
import { HttpClient } from '@angular/common/http';
import { DownloadfileService } from '../downloadfile.service';
import * as saveAs from 'file-saver';
import { FileViewComponent } from '../file-view/file-view.component';
import { MatDialog } from '@angular/material/dialog';
import { Route, Router } from '@angular/router';
import * as moment from 'moment';
import { AuthService } from '../auth.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.css'],
})
export class SearchBarComponent implements OnInit {
  isTableVisible: boolean = true;
  expiredZrc: any[] = [];
  userIndents: any[] = [];
  searchInput: string;
  studentArray: any[] = [];
  expiredArray: any[] = [];
  userArray: any[] = [];
  integerResults: { ph_number: number; product_name: string }[];
  stringResults: { ph_number: number; product_name: string }[];
  showResults: boolean = false;
  serial: number;
  reject_remarks:string;
  textVisible = false;

  ngOnInit(): void {
    this.expiringZrcs();

    if (this.auth.getUserRole() === 'User') {
      console.log('Role : User');
      this.getUserIndents();
    } else {
      console.log('Role : MasterAdmin / Contributer');
      this.getAllUserIndents();
    }
  }
  constructor(
    private dataService: DataserviceService,
    private http: HttpClient,
    private service: DownloadfileService,
    private dialogRef: MatDialog,
    private router: Router,
    private auth: AuthService,
    private modalService: NgbModal
  ) {
    const currentDate = moment(); // Create a moment object representing the current date and time
    const formattedDate = currentDate.format('YYYY-MM-DD HH:mm:ss'); // Format the date as desired
    this.serial = service.getSerial();
    if (this.serial != -1) {
      this.searchExpiredZrc(this.serial);
    }
    //console.log(formattedDate);
    //console.log(new Date());
    //console.log(new Date().getTimezoneOffset());
  }

  //Search Bar Product Search Suggestions
  search() {
    console.log('search called');
    if (this.searchInput) {
      //console.log("insised if statementy",this.searchInput)
      const stringParameter = this.searchInput;
      const encodedParameter = encodeURIComponent(
        stringParameter.replace(/%/g, '%25')
      );
      this.dataService
        .fetchIntegers(encodedParameter)
        .subscribe((response: any) => {
          this.integerResults = response;
          // console.log("int res",this.integerResults)
          this.showResults = true;
        });

      this.dataService
        .fetchStrings(encodedParameter)
        .subscribe((response: any) => {
          this.stringResults = response;
          console.log('DropDown Suggestions', this.stringResults);
          this.showResults = true;
        });
    } else {
      this.integerResults = [];
      this.stringResults = [];
      this.showResults = false;
    }
  }

  selectResult(result: any) {
    this.searchInput = result.toString(); // Set the selected Drop-Down result in the Search TextBox
  }

  //Search the Product when button is pressed
  getDetails() {
    const stringParameter = this.searchInput;
    const encodedParameter = encodeURIComponent(
      stringParameter.replace(/%/g, '%25')
    );
    //console.log("parameter sent ",encodedParameter)
    this.http
      .get('http://13.126.46.248:8085/api/zrc/product' + '/' + encodedParameter)
      .subscribe((resultData: any) => {
        if(resultData.status === false ){
          alert('Search Failed');
          console.log('Search Failed', resultData);
        }
        else{
        //checking if we did not redirect from any different page
        if (!this.service.getRequestSource()) {
          this.isTableVisible = false;
          console.log('Search Success, Results', resultData.data);
          this.studentArray = resultData.data;

          if (this.studentArray.length === 0) {
            alert('No Data Available with ProductName ' + this.searchInput);
          }
        }
      }
      });
    //console.log(this.studentArray);
  }

  //Redirecting to Download File Service 
  downloadFile(file: any) {
    console.log("Download File Called")
    this.service.downloadFile(file).subscribe((data: Blob | MediaSource) => {
      let downloadURL = window.URL.createObjectURL(data);
      saveAs(downloadURL);
    });
  }

  navigate(file: any) {
    //  window.open(file,'_blank');
    this.dialogRef.open(FileViewComponent, {
      height: '100%',
      width: '100%',
      data: {
        id: file,
      },
    });
  }
  // navigate(file:any){
  //   this.service.setFileName(file)
  //   this.router.navigate(['pdf-view'])
  // }

  //Update ZRC Navigation
  update(serial: any) {
    console.log("Update ZRC Called")
    this.service.setSerial(serial);
    this.router.navigate(['update']);
  }

  //Place Indents According to Roles
  checkUser(studentItem: any) {
    console.log("Checking User Role")
    if (this.auth.getUserRole() === 'User') {
      console.log("User Role is : User")
      if (this.previousIndentStatus(studentItem)) {
        this.placeIndent(studentItem);
      }
    } else {
      this.placeIndent(studentItem);
    }
  }

  //Confirm Dialog for Rejecting
  openConfirmDialog(serial : any) {
    const modalRef = this.modalService.open(ConfirmDialogComponent);
    modalRef.result.then((result) => {
      this.reject_remarks=result;
      this.rejectUserIndent(serial)
      console.log('Confirmed with value:', result);
    }).catch((reason) => {
      console.log('Dismissed with reason:', reason);
    });
  }

  //Reject User Indent
  rejectUserIndent(serial: any) {
    if (confirm('Do You Want to Reject?')) {
      let bodyData = {
        approval_status: 'Rejected',
        executive: this.auth.getUserName(),
        reject_remarks: this.reject_remarks
      };
      this.http
        .put(
          'http://13.126.46.248:8085/api/zrc/userindent/updatestatus' +
            '/' +
            serial,
          bodyData
        )
        .subscribe((resultData: any) => {
          console.log(resultData);
          window.location.reload();
        });
    }
  }

  //PLACING INDENTS FROM USER REQUESTS
  placeUserIndent(details: any) {
    this.http
      .get(
        'http://13.126.46.248:8085/api/zrc/getbyserial' + '/' + details.zrc_serial
      )
      .subscribe((resultData: any) => {
        this.userArray = resultData.data;

        if (this.zrcPoCheck(this.userArray[0].po_status)) {
          alert('Previous PO is still Pending, Cannot Place Indent');
        } else if (this.zrcSupplyCheck(this.userArray[0].supply_status)) {
          alert('Previous Supply is still Pending, Cannot Place Indent');
        } else {
          // this.service.setRequestSource(true)
          //Setting Request Source as True for Navigating from User's Requested Indents 
          this.service.setRequestSource(true);
          this.service.setSerial(details.zrc_serial);
          this.service.setQuantity(details.qty_required);
          this.service.setUserIndentSl(details.serial);
          this.service.setIrpTextBox(details.irpTextBox)
          this.router.navigate(['indent']);
        }
      });
  }

  //PLACE FOR CONTRIBUTORS
  //Navigate To Indents Page
  placeIndent(studentItem: any) {
    const todayDate = new Date();
    const dateOfZrc = new Date(studentItem.zrc_valid_upto);
    //console.log("Button clicked" , studentItem.Balance, dateOfZrc , todayDate)
    if (dateOfZrc < todayDate) {
      alert('Indents cannot be placed for expired ZRC');
    } else if (studentItem.Balance == 0) {
      alert('No ZRC Balance Available, Cannot Place Indent');
    } else if (this.zrcPoCheck(studentItem.po_status)) {
      alert('Previous PO is still Pending, Cannot Place Indent');
    } else if (this.zrcSupplyCheck(studentItem.supply_status)) {
      alert('Previous Supply is still Pending, Cannot Place Indent');
    } else {
      this.service.setSerial(studentItem.serial);
      this.router.navigate(['indent']);
    }
  }

  //Checking If Previous Indents Are Still pending
  previousIndentStatus(studentitem: any): boolean {
    console.log("Checking If Previous Indent Status is Pending")
    for (let indents of this.userIndents) {
      if (
        indents.zrc_serial === studentitem.serial &&
        indents.approval_status === 'Pending'
      ) {
        alert(
          'Previous Indent is Still Pending For Approval, Cannot Place New Indent'
        );
        return false;
      }
    }
    return true;
  }

  zrcPoCheck(status: any): boolean {
    if (status == 0) {
      return true;
    }
    return false;
  }
  zrcSupplyCheck(status: any): boolean {
    if (status == 0) {
      return true;
    }
    return false;
  }

  //check ZRC VALID DATE

  getRowColor(zrcValidUpto: Date): string {
    const currentDate = new Date();
    const validUptoDate = new Date(zrcValidUpto);

    // Compare the current date with the ZRC Valid Upto date
    if (currentDate > validUptoDate) {
      // Past date, set color to red
      //console.log("red");
      return 'expired-row';
    } else {
      // Future date, set color to green
      //console.log("green");
      return 'valid-row';
    }
  }

  getBalanceRowColor(zrcBalance: number): string {
    if (zrcBalance > 0) {
      return 'valid-balance-row';
    } else {
      return 'expired-balance-row';
    }
  }

  //Getting all ZRC which are about to expire in 30 days!
  expiringZrcs() {
    let todayDate = new Date();
    let thirtyDays = new Date(todayDate.setDate(todayDate.getDate() + 30));
    console.log('Expiring Date 30 days from today', thirtyDays);

    const iso_zrc_date: string =
      thirtyDays.toISOString().slice(0, 10) + ' 00:00:00';
    const nextDay1 = new Date(iso_zrc_date);
    nextDay1.setDate(nextDay1.getDate() + 2);
    const iso_zrc_date1: string =
      nextDay1.toISOString().slice(0, 10) + ' 00:00:00';

    const iso_zrc_valid_from: string =
      todayDate.toISOString().slice(0, 10) + ' 00:00:00';
    const nextDay2 = new Date(iso_zrc_valid_from);
    nextDay2.setDate(nextDay2.getDate() + 2);
    const iso_zrc_valid_from2: string =
      nextDay2.toISOString().slice(0, 10) + ' 00:00:00';

    let bodyData = {
      todayDate: iso_zrc_valid_from2,
      thirtyDays: iso_zrc_date1,
    };
    let month = 1;
    this.http
      .get('http://13.126.46.248:8085/api/zrc/expiring/expirydate' + '/' + month)
      .subscribe((resultData: any) => {
        if(resultData.status === false){
          console.log('error getting data from DB', resultData);
        } else {
        
          console.log("Success getting Expired ZRCs", resultData)
        this.expiredZrc = resultData.data;
        if (this.expiredZrc.length) {
          this.isTableVisible = true;
          this.textVisible = false;
        } else {
          this.textVisible = true;
        }

        //console.log("expiring zrc data from db",this.expiredZrc)
      }
      });
  }

  //Getting Expired ZRC to View In Table
  searchExpiredZrc(data: any) {
    this.http
      .get('http://13.126.46.248:8085/api/zrc/getbyserial' + '/' + data)
      .subscribe((resultData: any) => {
        if(resultData.status === false){
          alert("Error Getting ZRC info")
          console.log('Error Getting ZRC info', resultData);
        } else {
        
          console.log("Success in getting Expired ZRC Info", resultData)
        this.studentArray = resultData.data;
        }

        //console.log("product name from DB ",this.searchInput,resultData.data)
      });
  }
  //GET ALL USERS INDENT REQUESTS
  getAllUserIndents() {
    this.http
      .get('http://13.126.46.248:8085/api/zrc/indents/getalluserindents')
      .subscribe((resultData: any) => {
        if (resultData.message === 'error') {
          alert('Error getting Indent Requests');
        } else {
          console.log("Success in getting User Indent Requests", resultData)
          this.userIndents = resultData.data;
        }
      });
  }

  //GET CURRENT USER Requested INDENTS (FOR) INDIVIDUAL USER
  getUserIndents() {
    this.http
      .get(
        'http://13.126.46.248:8085/api/zrc/indents/getuserindents' +
          '/' +
          this.auth.getUserName()
      )
      .subscribe((resultData: any) => {
        if (resultData.message === 'error') {
          alert('Error getting Indent Requests');
        }
        else {
        this.userIndents = resultData.data;
        console.log("Success in Getting User's Requested Indents",resultData.status);
        }
      });
  }

  //Getting User's Role
  getUserRole() {
    return this.auth.getUserRole();
  }
  getStatus(status: any) {
    if (status === 'Approved') {
      return 'Approved';
    } else if (status === 'Pending') {
      return 'Pending';
    } else {
      return 'Rejected';
    }
  }

  //Marking User's Indent Request As Read to remove them from Homescreen
  markAsRead(serial: any) {
    let acknowledge = 1;
    let bodydata = {
      acknowledge: acknowledge,
    };
    this.http
      .put(
        'http://13.126.46.248:8085/api/zrc/userindent/update/markasread' +
          '/' +
          serial,
        bodydata
      )
      .subscribe((resultData: any) => {
        if(resultData.status === false){
          alert("Failed to Mark As Read")
          console.log("Failed to mark as read" , resultData)
        } else{
        console.log("Successfully Marked as Read",resultData);
        window.location.reload();
        }
      });
  }
  viewUserLetter(serial : any){
    this.service.setIndentSl(serial)
    this.service.setRequestSourceHomePage(true)
    this.router.navigate(['indent-letter'])
    
  }
}
