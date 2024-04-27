import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-payment-successful',
  templateUrl: './payment-successful.component.html',
  styleUrls: ['./payment-successful.component.css']
})
export class PaymentSuccessfulComponent implements OnInit{

 reference : any;

  constructor(private route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
     this.reference = this.route.snapshot.queryParamMap.get('reference');
    console.log('Reference:', this.reference);
  }

  navigate(){
    this.router.navigateByUrl('/login')
  }


}
