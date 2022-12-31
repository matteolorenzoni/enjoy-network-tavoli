import { SessionStorageService } from 'src/app/services/sessionstorage.service';
import { UserCredential } from '@angular/fire/auth';
import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { faAt, faKey } from '@fortawesome/free-solid-svg-icons';
import { UserService } from 'src/app/services/user.service';
import { ToastService } from 'src/app/services/toast.service';
import { translateFirebaseErrorMessage } from 'src/app/translate/translate';
import { FirebaseLoginErrorType, InputType } from '../../../models/enum';

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
  passwordFieldType: InputType = InputType.PASSWORD;

  /** Form */
  loginForm: FormGroup;
  isLoading: boolean;

  /* ---------------------------- constructor ---------------------------- */
  constructor(
    private userService: UserService,
    private sessionStorageService: SessionStorageService,
    private toastService: ToastService
  ) {
    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required])
    });
    this.isLoading = false;
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
      this.isLoading = true;
      const emailForm = this.loginForm.get('email')?.value;
      const passwordForm = this.loginForm.get('password')?.value;
      this.userService
        .login(emailForm, passwordForm)
        .then(async (userCredential: UserCredential) => {
          this.isLoading = false;
          if (userCredential !== null) {
            const { uid } = userCredential.user;
            this.sessionStorageService.setEmployeePropsInSessionStorage(uid);

            /* Go to dashboard */
            this.setSectionEvent.emit(true);
          }
        })
        .catch((err: Error) => {
          this.isLoading = false;
          const errorMessageTranslated = translateFirebaseErrorMessage(err.message as FirebaseLoginErrorType);
          this.toastService.showErrorMessage(errorMessageTranslated);
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
