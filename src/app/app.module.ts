import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ZrccrudComponent } from './zrccrud/zrccrud.component';
import { FormsModule } from '@angular/forms';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';

import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import {MatDialogModule} from '@angular/material/dialog';

   
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MomentDateModule } from '@angular/material-moment-adapter';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HomeSearchComponent } from './home-search/home-search.component';
import { UpdateComponent } from './update/update.component';
import { CalendarModule } from 'primeng/calendar';



import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FileViewComponent } from './file-view/file-view.component';
import { IndentComponent } from './indent/indent.component';  

import {MatAutocompleteModule} from '@angular/material/autocomplete';
import { UpdatefileComponent } from './updatefile/updatefile.component';
import { IndentLetterComponent } from './indent-letter/indent-letter.component';
import { SearchBarComponent } from './search-bar/search-bar.component';
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';
import { PdfViewerModule, LinkAnnotationService, BookmarkViewService,
  MagnificationService, ThumbnailViewService, ToolbarService,
  NavigationService, TextSearchService, TextSelectionService,
  PrintService
} from '@syncfusion/ej2-angular-pdfviewer';
import { PdfViewComponent } from './pdf-view/pdf-view.component';

import { NgxPrintModule } from 'ngx-print';
import { ZrcReportsComponent } from './zrc-reports/zrc-reports.component';
import { IndentReportsComponent } from './indent-reports/indent-reports.component';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { AddMasterlistComponent } from './add-masterlist/add-masterlist.component';

import { JWT_OPTIONS, JwtHelperService } from '@auth0/angular-jwt';
import { AuthInterceptor } from './auth.interceptor';
import { ConfirmDialogComponent } from './confirm-dialog/confirm-dialog.component';
import { ChangePasswordComponent } from './change-password/change-password.component';








 


@NgModule({
  declarations: [
    AppComponent,
    ZrccrudComponent,
    HomeSearchComponent,
    UpdateComponent,
    FileViewComponent,
    IndentComponent,
    UpdatefileComponent,
    IndentLetterComponent,
    SearchBarComponent,
    PdfViewComponent,
    ZrcReportsComponent,
    IndentReportsComponent,
    RegisterComponent,
    LoginComponent,
    AddMasterlistComponent,
    ConfirmDialogComponent,
    ChangePasswordComponent
    
  ],
 
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MomentDateModule,
    MatInputModule,
    BrowserAnimationsModule,
    NgbModule,
    MatDialogModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    CalendarModule,
    PdfViewerModule,
    NgxExtendedPdfViewerModule,
    NgxPrintModule




    
  

    
    
  ],
  providers: [LinkAnnotationService, BookmarkViewService, MagnificationService,
    ThumbnailViewService, ToolbarService, NavigationService,
    TextSearchService, TextSelectionService, PrintService,
    { provide: JWT_OPTIONS, useValue: JWT_OPTIONS },
    JwtHelperService,
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
  ],
  bootstrap: [AppComponent,]
})
export class AppModule { }
