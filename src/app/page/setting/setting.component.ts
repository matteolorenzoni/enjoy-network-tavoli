import { UserService } from 'src/app/services/user.service';
import { Component } from '@angular/core';
import { faKey, faRightFromBracket } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-setting',
  templateUrl: './setting.component.html',
  styleUrls: ['./setting.component.scss']
})
export class SettingComponent {
  /* Icons */
  changePasswordIcon = faKey;
  logOutIcon = faRightFromBracket;

  constructor(private userService: UserService) {}

  logOut() {
    this.userService.logout();
  }
}
