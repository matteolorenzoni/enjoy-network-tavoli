import { UserCredential } from '@angular/fire/auth';
import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { faAt, faKey } from '@fortawesome/free-solid-svg-icons';
import { UserService } from 'src/app/services/user.service';
import { ToastService } from 'src/app/services/toast.service';
import { translateFirebaseErrorMessage } from 'src/app/translate/translate';
import { EmployeeService } from '../../../services/employee.service';
import { FirebaseLoginErrorEnum, InputTypeEnum } from '../../../models/enum';

@Component({
  selector: 'app-login-form[setSectionEvent]',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss']
})
export class LoginFormComponent implements OnInit {
  @Output() setSectionEvent = new EventEmitter<boolean>();

  /** Icons */
  emailIcon = faAt;
  passwordIcon = faKey;

  /** Variables */
  passwordFieldType: InputTypeEnum = InputTypeEnum.PASSWORD;

  /** Form */
  loginForm: FormGroup;

  /* ---------------------------- constructor ---------------------------- */
  constructor(
    private userService: UserService,
    private employeeService: EmployeeService,
    private toastService: ToastService
  ) {
    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required])
    });
  }

  /* ---------------------------- lifecycle hooks ---------------------------- */
  ngOnInit(): void {}

  /* ---------------------------- methods ---------------------------- */
  /**
   * Login user with email and password and set user data in the service (user.service.ts)
   * @param email
   * @param password
   * @returns Promise<UserCredential>
   */
  public onSubmit() {
    if (this.loginForm.valid) {
      const emailForm = this.loginForm.get('email')?.value;
      const passwordForm = this.loginForm.get('password')?.value;
      this.userService
        .login(emailForm, passwordForm)
        .then(async (userCredential: UserCredential) => {
          console.log(userCredential);
          if (userCredential !== null) {
            userCredential.user.getIdTokenResult().then((idTokenResult) => {
              const { displayName, email, photoURL, emailVerified, uid } = userCredential.user;
              this.userService.userBaseInfo = { displayName, email, photoURL, emailVerified, uid };
              this.userService.userAccessToken = idTokenResult;
              this.employeeService.setEmployee(uid);
              this.employeeService.setEmployees();
              const employee = this.employeeService.getEmployee();
              const employees = this.employeeService.getEmployees();
              console.log(employee, employees);
            });
          }
        })
        .catch((error: Error) => {
          const errorMessageTranslated = translateFirebaseErrorMessage(error.message as FirebaseLoginErrorEnum);
          this.toastService.showError(errorMessageTranslated);
        });
    }
  }

  // TODO: da aggiungere al custom field, ma opzionale
  /**
   * Toggle password field type (password or text) when the user click on the eye icon
   */
  // public togglePasswordVisibility(): void {
  //   this.passwordFieldType = this.passwordFieldType === InputType.PASSWORD ? InputType.TEXT : InputType.PASSWORD;
  // }
}
