import { UserService } from 'src/app/services/user.service';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard {
  constructor(private userService: UserService) {}

  async canActivate(route: ActivatedRouteSnapshot): Promise<boolean> {
    const role = await this.userService.getCurrentUserRole();
    const path = route.routeConfig?.path;
    if (role === path) {
      return true;
    }

    this.userService.logout();
    return false;
  }
}
