
import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { DataserviceService } from '../dataservice.service';

// export const MY_FORMATS = {
//   parse: {
//     dateInput: 'YYYY',
//   },
//   display: {
//     dateInput: 'YYYY',
//     monthYearLabel: 'YYYY',
//     monthYearA11yLabel: 'YYYY',
//   },
// };

@Component({
  selector: 'app-zrccrud',
  templateUrl: './zrccrud.component.html',
  styleUrls: ['./zrccrud.component.css'],
  // providers: [
  //   {
  //     provide: DateAdapter,
  //     useClass: MomentDateAdapter,
  //     deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
  //   },
  //   {
  //    provide: MAT_DATE_FORMATS, useValue: MY_FORMATS
  //   },
  //  ]
})
export class ZrccrudComponent {
  dropDownValues: any[] = [];

  myDate = new Date();
  nextYear = this.myDate.getFullYear();
  number1: number = (this.nextYear % 100) + 1;

  myDate2 = new Date();
  nextYear2 = this.myDate.getFullYear() + 1;
  number2: number = (this.nextYear % 100) + 2;

  myDate3 = new Date();
  nextYear3 = this.myDate.getFullYear() + 2;
  number3: number = (this.nextYear % 100) + 3;

  studentArray: any[] = [];
  isResultLoaded = false;
  isUpdateFormActive = false;
  images: any;

  zrc_fy: string ;
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

  ph_number_string: string = '';
  qty_string: string = '';
  zrc_date_string = '';
  zrc_valid_from_string = '';
  zrc_valid_upto_string = '';

  integerResults: { ph_number: number; product_name: string }[];
  stringResults: { ph_number: number; product_name: string }[];
  showResults: boolean = false;

  //FileViewEvent
  @ViewChild('singleInput', { static: false })
  singleInput!: ElementRef;

  selectYear: any;
  selectYear2: any;

  

  constructor(
    private http: HttpClient,
    private dataService: DataserviceService
  ) {}

  ngOnInit(): void {
    //console.log(this.myDate + 'next' + this.nextYear);
    this.loadZrcFyDropDown();
  }

  //Numbers Allowed Validation
  onlyNumbers(event: any): boolean {
    const charCode = event.which ? event.which : event.keyCode;

    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      console.log('Only Numbers Allowed' + charCode);
      return false;
    }

    return true;
  }

  //select Image Event
  selectImage(event: any) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      console.log(file);
      this.images = file;
    }
  }

  //File Upload Function
  // fileUploadFunction(){
  //   this.ph_number_string=this.ph_number.toString();
  //   this.qty_string=this.qty.toString();

  // }

  search() {
    //console.log('Search Bar Called');
    if (this.product_name) {
      //console.log('insised if statementy', this.product_name);
      const stringParameter = this.product_name;
      const encodedParameter = encodeURIComponent(
        stringParameter.replace(/%/g, '%25')
      );
      this.dataService
        .fetchIntegersMaster(encodedParameter)
        .subscribe((response: any) => {
          this.integerResults = response;
          // console.log("int res",this.integerResults)
          this.showResults = true;
        });

      this.dataService
        .fetchStringsMaster(encodedParameter)
        .subscribe((response: any) => {
          this.stringResults = response;
          // console.log("str res",this.stringResults)
          this.showResults = true;
        });
    } else {
      this.integerResults = [];
      this.stringResults = [];
      this.showResults = false;
    }
  }
  selectResult(result: any, ph_number: number) {
    this.product_name = result.toString(); // Set the selected result in the search input
    this.ph_number = ph_number;
  }

  validate() {
    var form = document.getElementsByClassName(
      'needs-validation'
    )[0] as HTMLFormElement;
    if (form.checkValidity() === false) {
      alert('enter all details');
    } else {
      this.check();
    }
    form.classList.add('was-validated');
  }
  check() {
    this.http
      .get('http://13.126.46.248:8085/api/zrc' + '/' + this.ph_number)
      .subscribe((resultData: any) => {
        this.isResultLoaded = true;
        console.log(resultData.data);
        this.studentArray = resultData.data;

        if (this.studentArray.length !== 0) {
          if (
            confirm(
              'There is already data existing with PH Number ' +
                this.ph_number +
                ' do you want to proceed?'
            )
          ) {
            this.register();
          }
        } else {
          this.register();
        }
      });
  }

  checkProductFromMaster(): boolean {
    for (let items of this.stringResults) {
      if (items.product_name == this.product_name) {
        return true;
      }
    }
    alert('Product Name Do not Match with Master List');
    return false;
  }

  register() {
    //this.zrc_date.toISOString().slice(0,19).replace('T',' ')

    if (this.checkDate() && this.checkProductFromMaster()) {
      // let filename:string="";
      //FileUpload to GitHub
      // if(this.images){
      //    filename =Date.now()+this.images.toString()+'.pdf';
      //    this.drive_file=filename

      //   // const accessToken='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'
      //   // const owner='Zuke99'
      //   // const repo ='zrcRep'

      // //   this.dataService.uploadFileToRepo(this.images,filename,accessToken,owner,repo).subscribe((resultData : any) => {
      // //     (error : any)=>{
      // //       console.log("Failed to upload to GitHub",error)
      // //     }
      // //     console.log("File Upload To GitHub Successful")

      // // })

      // }

      const iso_zrc_date: string =
        this.zrc_date.toISOString().slice(0, 10) + ' 00:00:00';
      const nextDay1 = new Date(iso_zrc_date);
      nextDay1.setDate(nextDay1.getDate() + 2);
      const iso_zrc_date1: string =
        nextDay1.toISOString().slice(0, 10) + ' 00:00:00';

      const iso_zrc_valid_from: string =
        this.zrc_valid_from.toISOString().slice(0, 10) + ' 00:00:00';
      const nextDay2 = new Date(iso_zrc_valid_from);
      nextDay2.setDate(nextDay2.getDate() + 2);
      const iso_zrc_valid_from2: string =
        nextDay2.toISOString().slice(0, 10) + ' 00:00:00';

      const iso_zrc_valid_upto: string =
        this.zrc_valid_upto.toISOString().slice(0, 10) + ' 00:00:00';
      const nextDay3 = new Date(iso_zrc_valid_upto);
      nextDay3.setDate(nextDay3.getDate() + 2);
      const iso_zrc_valid_upto3: string =
        nextDay3.toISOString().slice(0, 10) + ' 00:00:00';

      this.ph_number_string = this.ph_number.toString();
      this.qty_string = this.qty.toString();
      this.zrc_date_string = iso_zrc_date1;
      this.zrc_valid_from_string = iso_zrc_valid_from2;
      this.zrc_valid_upto_string = iso_zrc_valid_upto3;

      console.log('date being sent is', this.zrc_date_string);
      console.log('date being sent is', this.zrc_valid_from_string);
      console.log('date being sent is', this.zrc_valid_upto_string);
      const formData = new FormData();
      formData.append('zrc_fy', this.zrc_fy);
      formData.append('product_name', this.product_name);
      formData.append('ph_number', this.ph_number_string);
      formData.append('supplier_name', this.supplier_name);
      formData.append('zrc_number', this.zrc_number);
      formData.append('zrc_date', this.zrc_date_string);
      formData.append('qty', this.qty_string);
      formData.append('zrc_valid_from', this.zrc_valid_from_string);
      formData.append('zrc_valid_upto', this.zrc_valid_upto_string);
      formData.append('file', this.images);
      formData.append('drive_file', this.drive_file);

      let bodydata = {
        zrc_fy: this.zrc_fy,
        product_name: this.product_name,
        ph_number: this.ph_number,
        supplier_name: this.supplier_name,
        zrc_number: this.zrc_number,
        zrc_date: this.zrc_date,
        qty: this.qty,
        zrc_valid_from: this.zrc_valid_from,
        zrc_valid_upto: this.zrc_valid_upto,
        file: this.file,
      };
      this.http
        .post('http://13.126.46.248:8085/api/zrc/add', formData)
        .subscribe((resultData: any) => {
          console.log(resultData);
          alert('ZRC Registration Successful');
          window.location.reload();
        });
    }
  }

  //setting zrc_valid_upto date one year from zrc_valid_from date
  setDate() {
    console.log('SetDate() called');
    const new_date = new Date(this.zrc_valid_from);
    new_date.setFullYear(new_date.getFullYear() + 1);
    new_date.setDate(new_date.getDate() - 1);
    this.zrc_valid_upto = new_date;
    console.log('new date', new_date);
  }

  //setting zrc_valid_from date as same as Zrc date
  setZrcValidFromDate() {
    console.log('setzrcdate called');
    this.zrc_valid_from = this.zrc_date;
  }
  checkDate(): boolean {
    if (this.zrc_valid_from > this.zrc_valid_upto) {
      alert('ZRC Validity cannot be greater than ZRC Expiry');
      return false;
    }
    return true;
  }

  // Load DropDown Values for ZRC FY
  loadZrcFyDropDown() {
    this.http
      .get('http://13.126.46.248:8085/api/zrc/tracker/zrcfyload')
      .subscribe((resultData: any) => {
      if(resultData. status === false){
        alert("Error Loading ZRC FY Dropdown")
        console.log("Error loading zrc dropdown ", resultData)
      } else {

        this.dropDownValues = resultData.data;
        console.log('Successfully Loaded DropDown Values', this.dropDownValues);
        const currentMonth = new Date().getMonth();
        let currentFY: string = '';
        if (currentMonth >= 3) {
          this.addFY(); // adding financial year to database
          let currentYear = new Date().getFullYear();
          currentFY =
            currentYear.toString() +
            ' - ' +
            ((currentYear % 100) + 1).toString();
         
        } else {
          let currentYear = new Date().getFullYear() - 1;
          currentFY =
            currentYear.toString() +
            ' - ' +
            ((currentYear % 100) + 1).toString();
          
        }

        this.zrc_fy = currentFY;
        console.log('Current Financial Year :', currentFY);
      }
      });
  }

  addFY() {
    const currentMonth = new Date().getMonth();
    let nextFY: string = '';
    let currentYear = new Date().getFullYear() + 3;
    nextFY =
      currentYear.toString() + ' - ' + ((currentYear % 100) + 1).toString();
    //console.log('current FY', nextFY);
  }
}
