import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.css']
})
export class ConfirmDialogComponent {

  textInput: string;
  constructor(public activeModal: NgbActiveModal) {}

  onConfirm(){
    this.activeModal.close(this.textInput);
  }
  onCancel() {
    this.activeModal.dismiss('cancel');
  }

}
