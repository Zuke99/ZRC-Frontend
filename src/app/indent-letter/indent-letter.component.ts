import { Component, OnInit } from '@angular/core';
import { DownloadfileService } from '../downloadfile.service';
import { HttpClient } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-indent-letter',
  templateUrl: './indent-letter.component.html',
  styleUrls: ['./indent-letter.component.css'],
})
export class IndentLetterComponent implements OnInit {
  clickEventSubscription: Subscription;
  constructor(
    private service: DownloadfileService,
    private http: HttpClient,
    private router: Router,
    private auth: AuthService
  ) {}
  financialYear: string;
  indents_sl: any;
  balance_from_zrc: number;
  serial: number;
  indent_serial: number;
  indentArray: any[] = [];
  curr_indentArray: any = {};
  myIterable: any;
  isResultLoaded: any;
  validIndentArray: any[] = [];

  ngOnInit(): void {
    if (this.getUserRole() === 'User' || this.service.getRequestFromMaster()) {
      if(this.service.getRequestSourceHomePage()){
        this.getUserIndentBySerial()
      } else {
      this.getUserDetails();
      }
      this.financialYear = this.generateFinancialYear();
    } else {
      console.log('this is Letter Component');
      this.serial = this.service.getSerial();
      this.indents_sl = this.service.getIndentSl();
      this.balance_from_zrc = this.service.getBalance();
      console.log('Balance frm zrc is' + this.balance_from_zrc);
      console.log('get call is ', this.service.getCall());
      if (this.service.getCall()) {
        this.getDetails();
      } else {
        this.getDetailsBySerial(this.service.getIndentSl());
      }
      this.financialYear = this.generateFinancialYear();
    }
  }

  //Get Indent Details
  getDetails() {
    this.http
      .get('http://13.126.46.248:8085/api/zrc/getallindents')
      .subscribe((resultData: any) => {
        this.isResultLoaded = true;
        this.indentArray = resultData.data;
        console.log('Data Fetched ' + this.indentArray);
        console.log('Size= ' + this.indentArray.length);
        this.indent_serial =
          this.indentArray[this.indentArray.length - 1].serial;
        this.curr_indentArray = this.indentArray[this.indentArray.length - 1];
        console.log('type of ', typeof this.curr_indentArray);

        console.log(this.curr_indentArray);
        // console.log("BALANCE AVAIL"+this.curr_indentArray.product_name)

        console.log(
          'last Indent date' + this.curr_indentArray.last_indent_date
        );
      });
  }

  //Get User INdent Data

  getUserDetails() {
    this.http
      .get('http://13.126.46.248:8085/api/zrc/userindent/getallindents')
      .subscribe((resultData: any) => {
        this.isResultLoaded = true;
        this.indentArray = resultData.data;
        this.curr_indentArray = this.indentArray[this.indentArray.length - 1];
        this.indents_sl = this.curr_indentArray.indents_sl;
        console.log("Succesful in getting user indent",resultData.data);
      });
  }

  printPages() {
    window.print();
  }
  //calculate Financial Year
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

  getDetailsBySerial(data: any) {
    console.log('get by serial called', data);
    this.http
      .get(
        'http://13.126.46.248:8085/api/zrc/indents/getindentbyserial' + '/' + data
      )
      .subscribe((resultData: any) => {
        (error: any) => {
          console.log('error fetching indents by serial', error);
        };
        this.indentArray = resultData.data;
        this.curr_indentArray = this.indentArray[0];
        console.log('success ', this.curr_indentArray);
      });
  }

  editIndent(curr_indentArray: any) {
    this.http
      .get(
        'http://13.126.46.248:8085/api/zrc/indent/getindentby/zrcserial' +
          '/' +
          curr_indentArray.zrc_serial
      )
      .subscribe((resultData: any) => {
        if (resultData.status === false) {
          alert('error');
          console.log(resultData);
        } else {
          let allow = true;
          this.validIndentArray = resultData.data;
          console.log('indents by zrc_serial ', this.validIndentArray);

          for (let data of this.validIndentArray) {
            if (curr_indentArray.zrc_serial == data.zrc_serial) {
              console.log(
                'data serial ' +
                  data.serial +
                  ' > ' +
                  'curr indent serial  ' +
                  curr_indentArray.serial
              );
              if (data.serial > curr_indentArray.serial) {
                allow = false;
              }
            }
          }
          if (allow) {
            this.service.setRequestSourceEdit(true);
            this.service.setIndentSl(curr_indentArray.serial);
            this.router.navigate(['indent']);
          } else {
            alert('Cannot Edit older Indents');
          }
        }
      });

    console.log('Inside if');
  }

  getUserRole() {
    return this.auth.getUserRole();
  }

  getUserIndentBySerial(){
    this.http.get("http://13.126.46.248:8085/api/zrc/user/userindents/getbyserial"+"/"+this.service.getIndentSl()).subscribe((resultData : any) => {
      if(resultData.status === false){
        alert("Error Getting Indent data")
        console.log("Error getting indent data ", resultData)
      } else {
        this.isResultLoaded = true;
        this.indentArray = resultData.data;
        this.curr_indentArray = resultData.data[0];
        console.log("Success in getting indent by serial", resultData.data)
        this.service.setRequestSourceHomePage(false)
        this.service.setRequestFromMaster(false)
      }
    })

  }
}
