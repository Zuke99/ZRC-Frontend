import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { RazorpayVerifySubscription } from 'razorpay/dist/utils/razorpay-utils';
import { paymentEnvironment } from 'src/environments/payment-environment';

@Component({
  selector: 'app-payment-gateway',
  templateUrl: './payment-gateway.component.html',
  styleUrls: ['./payment-gateway.component.css'],
})
export class PaymentGatewayComponent {
  constructor(private http: HttpClient) {}
  instance: any;

  options: string[] = ['Monthly', 'Yearly'];
  selectedOption = 'Monthly'; // To store the selected option

  selectOption(option: string) {
    this.selectedOption = option;
  }
  checkout() {
    const bodyData = {
      selectedOption: this.selectedOption,
    };
    //let key;
    let key: any;
    this.http
      .get('http://194.164.169.138:8085/api/zrc/payment/get-key')
      .subscribe((resultData: any) => {
        key = resultData;
      });

    const order = this.http
      .post('http://194.164.169.138:8085/api/zrc/payment/payment-gateway', bodyData)
      .subscribe((resultData: any) => {
        (error: any) => {
          console.log('Error sending Payment data', error);
        };

        const options = {
          key_id: key.data, // Enter the Key ID generated from the Dashboard
          amount: resultData.data.amount, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
          currency: 'INR',
          name: `Rate Contract ${this.selectedOption}`,
          description: 'Test Transaction',
          image: 'https://example.com/your_logo',
          order_id: resultData.data.id, //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
          callback_url:
            'http://194.164.169.138:8085/api/zrc/payment/payment-verification',
          theme: {
            color: '#3399cc',
          },
        };

        const paymentObject = new (window as any).Razorpay(options);

        paymentObject.open();
        paymentObject.on('payment.failed', function (response: any) {
          alert(response.error.description);
        });
      });
  }

  loadScript(src: string): Promise<boolean> {
    return new Promise<boolean>((resolve) => {
      const script = document.createElement('script');
      script.src = src;
      script.onload = () => {
        resolve(true);
      };
      script.onerror = () => {
        resolve(false);
      };
      document.body.appendChild(script);
    });
  }

  async displayRazorpay() {
    const res = await this.loadScript(
      'https://checkout.razorpay.com/v1/checkout.js'
    );
    if (!res) {
      alert('Razorpay failed to load!!');
      return;
    }

    try {
      const response = await fetch(
        'http://194.164.169.138:8085/api/zrc/payment/payment-gateway',
        { method: 'POST' }
      );
      if (!response.ok) {
        throw new Error('Network response was not ok.');
      }

      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const data = await response.json();
        console.log(data);
      } else {
        // Handle non-JSON response (e.g., HTML, plain text, etc.)
        const textData = await response.text();
        console.log('Received non-JSON response:', textData);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }

    

    const options = {
      key: 'rzp_live_uYRRx1GZfxIkfg', // Enter the Key ID generated from the Dashboard
      amount: '444900', // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
      currency: 'INR',
      name: 'Rate Contract',
      description: 'Test Transaction',
      order_id: 'order_IluGWxBm9U8zJ8', //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
      callback_url: 'http://194.164.169.138:8085/api/zrc/payment/verify',
      notes: {
        address: 'Razorpay Corporate Office',
      },
      theme: {
        color: '#3399cc',
      },
    };

    const paymentObject = new (window as any).Razorpay(options);
    paymentObject.open();
  }

 
}
