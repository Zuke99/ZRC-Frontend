import { ChangeDetectionStrategy, Component, ElementRef, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { MatDialog } from '@angular/material/dialog';
import { ChangePasswordComponent } from '../change-password/change-password.component';

@Component({
  selector: 'app-home-search',
  templateUrl: './home-search.component.html',
  styleUrls: ['./home-search.component.css'],
  // changeDetection:ChangeDetectionStrategy.OnPush
})

export class HomeSearchComponent implements OnInit {
  isDropdownActive = false;
  showDropdown=false



  constructor(private elementRef: ElementRef,private router:Router , private auth : AuthService,public dialog: MatDialog) { }
  @HostListener('document:click', ['$event.target'])
  onClick(target: HTMLElement) {
    const isInsideClick = this.elementRef.nativeElement.contains(target);
    this.isDropdownActive = isInsideClick;
  }
  ngOnInit(): void {
   
  }
  openDialog(): void {
    try{
    const dialogRef = this.dialog.open(ChangePasswordComponent, {
      width: '600px',
      data: { input1: '', input2: '' }
    });
    dialogRef.afterClosed().subscribe((result) => {
      console.log('The dialog was closed');
      console.log('Result:', result);
      // Perform any desired actions with the returned data
    });
  } catch(error) {
    console.log("SOME ERROR")
  }
  }

  navigateToHome(){
   
  }
  isLoggedIn(){
   return this.auth.isLoggedIn()
  }
  logout(){
    this.auth.logout()
    this.router.navigate(['login'])
  }
  getUserRole(){
    return this.auth.getUserRole()
  }
  getUserName(){
    return this.auth.getUserName()
  }
}
