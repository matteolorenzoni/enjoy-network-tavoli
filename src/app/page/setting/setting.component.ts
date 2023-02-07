import { UserService } from 'src/app/services/user.service';
import { Component } from '@angular/core';
import { faKey, faRightFromBracket } from '@fortawesome/free-solid-svg-icons';
import { Router } from '@angular/router';
import { fadeInCreateItemAnimation } from 'src/app/animations/animations';

@Component({
  selector: 'app-setting',
  templateUrl: './setting.component.html',
  styleUrls: ['./setting.component.scss'],
  animations: [fadeInCreateItemAnimation]
})
export class SettingComponent {
  /* Icons */
  changePasswordIcon = faKey;
  logOutIcon = faRightFromBracket;

  constructor(private router: Router, private userService: UserService) {}

  updatePassword() {
    this.router.navigate(['create-item/setting/update-password']);
  }

  logOut() {
    this.userService.logout();
  }
}
