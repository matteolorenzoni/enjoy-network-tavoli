import { UserService } from 'src/app/services/user.service';
import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastService } from 'src/app/services/toast.service';
import { Location } from '@angular/common';
import { AuthError, User, updatePassword } from 'firebase/auth';

@Component({
  selector: 'app-update-password',
  templateUrl: './update-password.component.html',
  styleUrls: ['./update-password.component.scss']
})
export class UpdatePasswordComponent {
  /* Form */
  passwordForm: FormGroup;
  isLoading = false;

  /* Label */
  lblButton = 'Cambia password';

  user?: User;

  constructor(private location: Location, private userService: UserService, private toastService: ToastService) {
    this.userService.getUserSubject().subscribe((user) => {
      this.user = user;
    });

    this.passwordForm = new FormGroup({
      newPassword: new FormControl(null, [Validators.required, Validators.minLength(8)]),
      repeatNewPassword: new FormControl(null, [Validators.required, Validators.minLength(8)])
    });
  }

  onSubmit() {
    if (this.passwordForm.valid) {
      const newPassword = this.passwordForm.controls['newPassword'].value;
      const repeatNewPassword = this.passwordForm.controls['repeatNewPassword'].value;

      if (!this.user) {
        this.toastService.showErrorMessage('Utente non autenticato', false);
        return;
      }

      if (newPassword !== repeatNewPassword) {
        this.toastService.showErrorMessage('Le password non coincidono', false);
        return;
      }

      /* Active loader */
      this.isLoading = true;

      /* Update password */
      updatePassword(this.user, newPassword)
        .then(() => {
          this.toastService.showSuccess('Password cambiata con successo');
          this.location.back();
        })
        .catch((error: AuthError) => {
          const { code } = error;
          if (code === 'auth/requires-recent-login') {
            this.toastService.showErrorMessage('Devi rieffettuare il login per cambiare la password', false);
          } else {
            this.toastService.showError(error);
          }
        })
        .finally(() => {
          this.isLoading = false;
        });
    } else {
      this.toastService.showErrorMessage('La password deve essere lunga almeno 8 caratteri', false);
    }
  }
}
