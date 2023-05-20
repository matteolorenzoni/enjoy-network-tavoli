import { UserService } from 'src/app/services/user.service';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot } from '@angular/router';
import { Observable, map, skipWhile } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard {
  constructor(private userService: UserService) {}

  public canActivate(route: ActivatedRouteSnapshot): Observable<Promise<boolean>> {
    return this.userService.getUserSubject().pipe(
      skipWhile((user) => !user),
      map(async (user) => {
        if (!user) {
          this.userService.logout();
          return false;
        }

        const employeeRole = await this.userService.getUserRole();
        const path = route.routeConfig?.path;

        if (employeeRole !== path) {
          this.userService.logout();
          return false;
        }

        return true;
      })
    );
  }
}
