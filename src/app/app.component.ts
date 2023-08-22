import { Component } from '@angular/core';
import { MAT_DATE_FORMATS } from '@angular/material/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { subscribeOn } from 'rxjs';
import * as moment from 'moment-timezone';

export const MY_DATE_FORMATS = {
  parse: {
    dateInput: 'DD/MM/YYYY',
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MMMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],

  providers: [{ provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS }],
})
export class AppComponent {
  title = 'zrc-project';
  today_date = new Date();
  tampered_date = new Date(
    this.today_date.getFullYear() + 1,
    this.today_date.getMonth() - 2,
    this.today_date.getDate()
  );
  last_year_change: any;
  constructor(private http: HttpClient) {
    console.log('STARTED APPLICATION');
    //console.log("Tampered Date ",this.tampered_date)
    if (this.today_date.getMonth() == 3) {
      console.log('Its April. Checking Track', this.today_date);
      this.checkTrack();
    } else {
      console.log('Its Not April Month');
    }
  }
  //Checking Tracker Table for new Financial Year so that the Indents Serial gets refreshed to 1
  checkTrack() {
    this.http
      .get('http://13.126.46.248:8085/api/zrc/tracker/lastyearchange')
      .subscribe((resultData: any) => {
        if (resultData.status === false) {
          console.log('Error Checking Track of Financial Year', resultData);
        } else {
          console.log('Successfully Checked Track of Year');
          this.last_year_change = resultData.data[0].last_year_change;
          console.log('Last Year changed FROM DB ' + this.last_year_change);
          const new_year = new Date(Date.parse(this.last_year_change));
          console.log(typeof new_year);

          if (new_year.getFullYear() < this.today_date.getFullYear()) {
            console.log('Year Change Needed');
            this.updateLastYearChange();
            this.updateSl();
          } else {
            console.log('Year Change Not needed');
          }
        }
      });
  }

  //If It April Month and Year Change is needed
  updateLastYearChange() {
    const datetime1 = new Date(this.today_date);
    //console.log('before converting ', datetime1);
    const formattedDateTime1 = moment(datetime1)
      .tz('Asia/Kolkata')
      .format('YYYY-MM-DDTHH:mm:ss');
    const formattedDateTimeWithZeroTime1 = moment(formattedDateTime1)
      .startOf('day')
      .format('YYYY-MM-DDTHH:mm:ss');
    //console.log('Sending Date ', formattedDateTimeWithZeroTime1);

    let bodyData = {
      last_year_change: formattedDateTimeWithZeroTime1,
    };
    this.http
      .put('http://13.126.46.248:8085/api/zrc/tracker/lastyearchange', bodyData)
      .subscribe((resultData: any) => {
        if (resultData.status === false) {
          console.log('Failed to Update LastYearChange', resultData);
        } else {
          console.log('Last Year Change Updated! ', resultData.data);
        }
      });
  }

  //Setting Serial Number to 1 for new Financial Year
  updateSl() {
    const val = 1;
    let bodyData = {
      last_indent_sl: val,
    };
    this.http
      .put('http://13.126.46.248:8085/api/zrc/tracker/updatelastsl', bodyData)
      .subscribe((resultData: any) => {
        console.log(resultData.data);
      });
  }
}
