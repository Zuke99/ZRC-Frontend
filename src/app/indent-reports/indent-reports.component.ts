import {
  Component,
  ElementRef,
  NgZone,
  OnInit,
  ViewChild,
} from '@angular/core';
import { DataserviceService } from '../dataservice.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { DownloadfileService } from '../downloadfile.service';
import { Router } from '@angular/router';
import { View } from '@grapecity/gcpdfviewer/typings/Articles';
import { IndentLetterComponent } from '../indent-letter/indent-letter.component';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-indent-reports',
  templateUrl: './indent-reports.component.html',
  styleUrls: ['./indent-reports.component.css'],
})
export class IndentReportsComponent implements OnInit {
  searchInput: string;
  integerResults: { ph_number: number; product_name: string }[];
  stringResults: { ph_number: number; product_name: string }[];
  indentData: any[] = [];
  showResults: boolean = false;
  indentTableVisible = true;
  indent_date_from = new Date();

  indent_date_upto = new Date();

  searchByName: boolean;
  searchByRange: boolean;

  po_status: number;
  supply_status: number;

  po_pending: number;
  supply_pending: number;

  changeEvent: boolean = true;
  isPoCheckboxChecked: any[] = [];
  isSupplyCheckboxChecked: any[] = [];

  supplyIsChecked: boolean;
  poIsChecked: boolean;




  user_indent_date_from = new Date();

  user_indent_date_upto = new Date();
  toggleUserIndentTable:boolean=false;
  userSearchInput:string;

  //@ViewChild(IndentLetterComponent) indentLetterComponent: IndentLetterComponent
  @ViewChild('myCheckbox', { static: true })
  myCheckbox!: ElementRef<HTMLInputElement>;
  constructor(
    private dataService: DataserviceService,
    private http: HttpClient,
    private service: DownloadfileService,
    private router: Router,
    private ngZone: NgZone,
    private auth:AuthService
  ) {}
  ngOnInit(): void {


    if(this.getUserRole() === 'User'){
      this.user_indent_date_from.setDate(this.user_indent_date_from.getDate() - 1);
      this.userGetIndentRange()
    } else {
    this.indent_date_from.setDate(this.indent_date_from.getDate() - 1);
    this.getIndentRange();
    }
  }
 

  //search Engine
  search() {

    if(this.toggleUserIndentTable){
      this.userSearch()
    } else {

    
    console.log('search called');
    if (this.searchInput) {
      console.log('insised if statementy', this.searchInput);
      const stringParameter = this.searchInput;
      const encodedParameter = encodeURIComponent(
        stringParameter.replace(/%/g, '%25')
      );
      this.dataService
        .indentFetchIntegers(encodedParameter)
        .subscribe((response: any) => {
          this.integerResults = response;
          // console.log("int res",this.integerResults)
          this.showResults = true;
        });

      this.dataService
        .indentFetchStrings(encodedParameter)
        .subscribe((response: any) => {
          this.stringResults = response;
          console.log('str res', this.stringResults);
          this.showResults = true;
        });
    } else {
      this.integerResults = [];
      this.stringResults = [];
      this.showResults = false;
    }
  }
  }
  selectResult(result: any) {
    this.searchInput = result.toString(); // Set the selected result in the search input
  }

  //search Button Hit
  getDetails() {
    if(this.toggleUserIndentTable){
      this.userGetDetails()
    } else {
    

    this.searchByName = true;
    this.searchByRange = false;
    const stringParameter = this.searchInput;
    const encodedParameter = encodeURIComponent(stringParameter);
    console.log('parameter sent ', encodedParameter);
    this.http
      .get(
        'http://13.126.46.248:8085/api/zrc/indentproduct' + '/' + encodedParameter
      )
      .subscribe((resultData: any) => {
        (error: any) => {
          alert('Search Failed');
          console.log('Search Failed', error);
        };

        console.log(resultData.data);
        this.indentData = resultData.data;
        // if (this.indentData) {
        //   this.indentTableVisible = true;
        // }

        if (this.indentData.length === 0) {
          alert('No Data Available with ProductName ' + this.searchInput);
        }
        // this.chechBoxArrayFill(this.indentData)
      });
    console.log(this.indentData);
    }
  }

  viewIndentLetter(serial: any) {
    this.service.setIndentSl(serial);
    this.service.setCall(false);
    this.router.navigate(['indent-letter']);
  }

  //Get By Date Range
  getIndentRange() {
    if(!this.indentTableVisible){
      this.getAllUserIndentRange()
    } else {
    console.log('po_pending= ', this.po_pending);
    console.log('suppy_pending ', this.supply_pending);
    console.log("range is", this.indent_date_from + "and "+this.indent_date_upto)
    this.searchByRange = true;
    this.searchByName = false;

    const iso_zrc_date: string =
      this.indent_date_from.toISOString().slice(0, 10) + ' 00:00:00';
    const nextDay1 = new Date(iso_zrc_date);
    nextDay1.setDate(nextDay1.getDate() + 2);
    const iso_zrc_date1: string =
      nextDay1.toISOString().slice(0, 10) + ' 00:00:00';

    const iso_zrc_valid_from: string =
      this.indent_date_upto.toISOString().slice(0, 10) + ' 00:00:00';
    const nextDay2 = new Date(iso_zrc_valid_from);
    nextDay2.setDate(nextDay2.getDate() + 2);
    const iso_zrc_valid_from2: string =
      nextDay2.toISOString().slice(0, 10) + ' 00:00:00';
    if (this.po_pending == 1 && this.supply_pending == 1) {
      this.po_pending = 1;
      this.supply_pending = 1;
      this.supplyIsChecked = true;
      this.poIsChecked = true;
    } else if (this.po_pending == 1 && this.supply_pending == 0) {
      this.po_pending = 1;
      this.supply_pending = 1;
      this.supplyIsChecked = true;
      this.poIsChecked = true;
      const checkbox = document.getElementById(
        'supplyIsChecked'
      ) as HTMLInputElement;
      checkbox.checked = true;
    } else if (this.po_pending == 0 && this.supply_pending == 1) {
      this.po_pending = 0;
      this.supply_pending = 1;
      this.supplyIsChecked = true;
      this.poIsChecked = false;
    } else {
      this.po_pending = 0;
      this.supply_pending = 0;
      this.supplyIsChecked = false;
      this.poIsChecked = false;
    }

    let params = new HttpParams()
      .set('indent_date_from', iso_zrc_date1)
      .set('indent_date_upto', iso_zrc_valid_from2)
      .set('po_status', this.po_pending)
      .set('supply_status', this.supply_pending);

    this.http
      .get('http://13.126.46.248:8085/api/zrc/indent/getindentrange', {
        params: params,
      })
      .subscribe((resultData: any) => {
        (error: any) => {
          console.log('error getting indent range ', error);
        };
        this.indentData = resultData.data;

        // if (this.indentData) {
        //   this.indentTableVisible = true;
        // }
        //this.chechBoxArrayFill(this.indentData)
        console.log('success', this.indentData);
      });
    }
  }

  //Filter By PO / Supply Ststus

  //Allow/DisAllow Checkbox change
  onCheckBoxChange(details: any) {
    console.log('po= ', details.po_status);
    console.log('supply', details.supply_status);

    if (this.checkCorrectIndent(this.indentData, details)) {
      alert('Cannot change status of old Indents');
      if (this.searchByName) {
        this.getDetails();
      } else {
        this.getIndentRange();
      }
      //  details.po_status=true
      //  details.supply_status=true
    } else if (details.po_status == false && details.supply_status == true) {
      alert("Supply cannot be checked IF PO isn't checked, Please Check");
      if (this.searchByName) {
        this.getDetails();
      } else {
        this.getIndentRange();
      }
      // details.po_status=false
      // details.supply_status=true
    } else {
      if (details.po_status == true) {
        this.po_status = 1;
      } else {
        this.po_status = 0;
      }
      if (details.supply_status == true) {
        this.supply_status = 1;
      } else {
        this.supply_status = 0;
      }
      let bodyData = {
        supply_status: this.supply_status,
        po_status: this.po_status,
        serial: details.serial,
      };

      this.http
        .put('http://13.126.46.248:8085/api/zrc/indentreport/status', bodyData)
        .subscribe((resultData: any) => {
          (error: any) => {
            console.log('error updating CheckBox Status', error);
          };
          console.log('success indent po status update' + resultData.data);
          this.http
            .put(
              'http://13.126.46.248:8085/api/zrc/update/updatestatus' +
                '/' +
                details.zrc_serial,
              bodyData
            )
            .subscribe((resultData: any) => {
              (error: any) => {
                console.log('error updating PO/Supply status ', error);
              };
              console.log('success zrc po status update', resultData.data);
            });
        });

      console.log('po**** ', this.po_status);
      console.log('supply********', this.supply_status);
    }
  }
  //Part of CheckBox Validation
  checkCorrectIndent(indentData: any, details: any): boolean {
    let max = -1;
    for (let data of indentData) {
      if (data.zrc_serial == details.zrc_serial && data.serial > max) {
        max = data.serial;
      }
    }
    if (details.serial == max) {
      return false;
    }
    return true;
  }
  toggleButtonFunction(){
    this.indentTableVisible = ! this.indentTableVisible
    this.toggleUserIndentTable = !this.toggleUserIndentTable;
    if(this.toggleUserIndentTable){
      this.getAllUserIndentRange()
    } else {
      this.getIndentRange()
    }
  }
  getAllUserIndentRange(){
    const iso_zrc_date: string =
    this.indent_date_from.toISOString().slice(0, 10) + ' 00:00:00';
  const nextDay1 = new Date(iso_zrc_date);
  nextDay1.setDate(nextDay1.getDate() + 2);
  const iso_zrc_date1: string =
    nextDay1.toISOString().slice(0, 10) + ' 00:00:00';

  const iso_zrc_valid_from: string =
    this.indent_date_upto.toISOString().slice(0, 10) + ' 00:00:00';
  const nextDay2 = new Date(iso_zrc_valid_from);
  nextDay2.setDate(nextDay2.getDate() + 2);
  const iso_zrc_valid_from2: string =
    nextDay2.toISOString().slice(0, 10) + ' 00:00:00';

    let bodyData={
      indent_date_from : iso_zrc_date1,
      indent_date_upto : iso_zrc_valid_from2
    }
    this.http.post("http://13.126.46.248:8085/api/zrc/userindent/getalluserindentrange",bodyData).subscribe((resultData : any) => {
      if(resultData.status === "false"){
        alert("Search Failed")
        console.log(resultData)
      } else {
        this.indentData=resultData.data;
        console.log("Success in getting all user indent data", resultData.data)
      }
    })



  }


  getUserRole(){
    return this.auth.getUserRole()
  }
  getUserName(){
    return this.auth.getUserName()
  }


  //***********************************************USER INDENT REPORTS *********************************************


  userSearch() {

    if(this.toggleUserIndentTable){
      this.userSearchInput=this.searchInput
    }
    
    console.log(' user search called');
    if (this.userSearchInput) {
      console.log('insised if statementy', this.userSearchInput);
      const stringParameter = this.userSearchInput;
      const encodedParameter = encodeURIComponent(
        stringParameter.replace(/%/g, '%25')
      );
      this.dataService
        .userIndentFetchIntegers(encodedParameter,this.getUserName(),this.toggleUserIndentTable)
        .subscribe((response: any) => {
          this.integerResults = response;
          // console.log("int res",this.integerResults)
          this.showResults = true;
        });

      this.dataService
        .userIndentFetchStrings(encodedParameter,this.getUserName(),this.toggleUserIndentTable)
        .subscribe((response: any) => {
          this.stringResults = response;
          console.log('str res', this.stringResults);
          this.showResults = true;
        });
    } else {
      this.integerResults = [];
      this.stringResults = [];
      this.showResults = false;
    }
  }

  
  userSelectResult(result: any) {
    this.userSearchInput = result.toString(); // Set the selected result in the search input
  }

  userGetDetails() {
    if(this.toggleUserIndentTable){
      this.userSearchInput=this.searchInput
    }
    this.searchByName = true;
    this.searchByRange = false;
    const stringParameter = this.userSearchInput;
    const encodedParameter = encodeURIComponent(stringParameter);
    console.log('parameter sent ', encodedParameter);
    let bodydata={
      user_name: this.getUserName(),
      masterReq:this.toggleUserIndentTable
    }
    this.http
      .post(
        'http://13.126.46.248:8085/api/zrc/userindentproduct' + '/' + encodedParameter, bodydata
      )
      .subscribe((resultData: any) => {
        (error: any) => {
          alert('Search Failed');
          console.log('Search Failed', error);
        };

        console.log(resultData.data);
        this.indentData = resultData.data;
        // if (this.indentData) {
        //   this.indentTableVisible = true;
        // }

        if (this.indentData.length === 0) {
          alert('No Data Available with ProductName ' + this.userSearchInput);
        }
        // this.chechBoxArrayFill(this.indentData)
      });
    console.log(this.indentData);
  }


  userGetIndentRange() {
    console.log("range ", this.user_indent_date_from +" and "+ this.user_indent_date_upto)

    this.searchByRange = true;
    this.searchByName = false;

    const iso_zrc_date: string =
      this.user_indent_date_from.toISOString().slice(0, 10) + ' 00:00:00';
    const nextDay1 = new Date(iso_zrc_date);
    nextDay1.setDate(nextDay1.getDate() + 2);
    const iso_zrc_date1: string =
      nextDay1.toISOString().slice(0, 10) + ' 00:00:00';

    const iso_zrc_valid_from: string =
      this.user_indent_date_upto.toISOString().slice(0, 10) + ' 00:00:00';
    const nextDay2 = new Date(iso_zrc_valid_from);
    nextDay2.setDate(nextDay2.getDate() + 2);
    const iso_zrc_valid_from2: string =
      nextDay2.toISOString().slice(0, 10) + ' 00:00:00';
    

    let bodyData = {
      user_indent_date_from: iso_zrc_date1,
      user_indent_date_upto: iso_zrc_valid_from2,
      user_name: this.getUserName()
    }

    this.http
      .post('http://13.126.46.248:8085/api/zrc/indent/usergetindentrange', bodyData)
      .subscribe((resultData: any) => {
        (error: any) => {
          console.log('error getting indent range ', error);
        };
        this.indentData = resultData.data;

        // if (this.indentData) {
        //   this.indentTableVisible = true;
        // }
        //this.chechBoxArrayFill(this.indentData)
        console.log('success', this.indentData);
      });
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
  userViewIndentLetter(serial: any) {
    this.service.setIndentSl(serial);
    this.service.setRequestSourceHomePage(true)
    if(this.getUserRole() === 'MasterAdmin' || this.getUserRole() === 'Contributor'){
    this.service.setRequestFromMaster(true)
    }
    this.router.navigate(['indent-letter']);
  }



  // chechBoxArrayFill(indentData : any){
  //   let i=0;
  //     for(let items of indentData){
  //       if(items.po_status==1){
  //         this.isPoCheckboxChecked[i]=true;
  //       } else {
  //         this.isPoCheckboxChecked[i]=false;
  //       }
  //       i++;
  //     }
  //     i=0;
  //     for(let items of indentData){
  //       if(items.supply_status==1){
  //         this.isSupplyCheckboxChecked[i]=true;
  //       } else {
  //         this.isSupplyCheckboxChecked[i]=false;
  //       }
  //       i++;
  //     }

  //     console.log("POcheckArray = ", this.isPoCheckboxChecked)
  //     console.log("isSupplyCheckArray = ",this.isSupplyCheckboxChecked)

  // }
}
