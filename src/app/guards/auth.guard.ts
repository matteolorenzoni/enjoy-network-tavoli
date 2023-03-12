import { UserService } from 'src/app/services/user.service';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private userService: UserService) {}

  async canActivate(route: ActivatedRouteSnapshot): Promise<boolean> {
    const role = this.userService.getUserRole();
    const path = route.routeConfig?.path;
    return role === path;
  }
}
