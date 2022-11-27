import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { faAt, faKey } from '@fortawesome/free-solid-svg-icons';
import { InputType } from '../../../models/enum';

@Component({
  selector: 'app-login-form[setStepEvent]',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss']
})
export class LoginFormComponent implements OnInit {
  @Output() setStepEvent = new EventEmitter<boolean>();

  /** Icons */
  emailIcon = faAt;
  passwordIcon = faKey;

  /** Variables */
  passwordFieldType: InputType = InputType.PASSWORD;

  /** Form */
  loginForm: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required])
  });

  constructor() {
    // do nothing
  }

  ngOnInit(): void {}

  // TODO: testare con poco tempo a disposizione
  public onSubmit() {
    if (this.loginForm.valid) {
      console.log(this.loginForm.value);
      this.setStepEvent.emit(true);
    }
  }

  // TODO: da aggiungere al custom field, ma opzionale
  public togglePasswordVisibility(): void {
    this.passwordFieldType = this.passwordFieldType === InputType.PASSWORD ? InputType.TEXT : InputType.PASSWORD;
  }
}
