import { UserService } from 'src/app/services/user.service';
import { Component } from '@angular/core';
import { faKey, faRightFromBracket } from '@fortawesome/free-solid-svg-icons';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-setting',
  templateUrl: './setting.component.html',
  styleUrls: ['./setting.component.scss']
})
export class SettingComponent {
  /* Icons */
  changePasswordIcon = faKey;
  logOutIcon = faRightFromBracket;

  constructor(private router: Router, private route: ActivatedRoute, private userService: UserService) {}

  updatePassword() {
    this.router.navigate(['./update-password'], { relativeTo: this.route });
  }

  logOut() {
    this.userService.logout();
  }
}
