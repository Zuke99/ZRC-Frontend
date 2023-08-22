import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeSearchComponent } from './home-search/home-search.component';
import { ZrccrudComponent } from './zrccrud/zrccrud.component';
import { UpdateComponent } from './update/update.component';
import { FileViewComponent } from './file-view/file-view.component';
import { UpdatefileComponent } from './updatefile/updatefile.component';
import { IndentComponent } from './indent/indent.component';
import { IndentLetterComponent } from './indent-letter/indent-letter.component';
import { SearchBarComponent } from './search-bar/search-bar.component';
import { PdfViewComponent } from './pdf-view/pdf-view.component';
import { ZrcReportsComponent } from './zrc-reports/zrc-reports.component';
import { IndentReportsComponent } from './indent-reports/indent-reports.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { AddMasterlistComponent } from './add-masterlist/add-masterlist.component';
import { authGuard } from './auth.guard';
import { ChangePasswordComponent } from './change-password/change-password.component';

const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'add', component: ZrccrudComponent, canActivate: [authGuard] },
  { path: 'update', component: UpdateComponent, canActivate: [authGuard] },
  { path: 'view', component: FileViewComponent, canActivate: [authGuard] },
  {
    path: 'updatefile',
    component: UpdatefileComponent,
    canActivate: [authGuard],
  },
  { path: 'indent', component: IndentComponent, canActivate: [authGuard] },
  {
    path: 'indent-letter',
    component: IndentLetterComponent,
    canActivate: [authGuard],
  },
  {
    path: 'search-bar',
    component: SearchBarComponent,
    canActivate: [authGuard],
  },
  { path: 'pdf-view', component: PdfViewComponent, canActivate: [authGuard] },
  {
    path: 'zrc-reports',
    component: ZrcReportsComponent,
    canActivate: [authGuard],
  },
  {
    path: 'indent-reports',
    component: IndentReportsComponent,
    canActivate: [authGuard],
  },
  { path: 'login', component: LoginComponent },
  { path: 'change-password', component: ChangePasswordComponent },
  { path: 'register', component: RegisterComponent, canActivate: [authGuard] },
  {
    path: 'master-list',
    component: AddMasterlistComponent,
    canActivate: [authGuard],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
