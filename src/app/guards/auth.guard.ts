import { UserService } from 'src/app/services/user.service';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot } from '@angular/router';
import { Observable, map, skipWhile } from 'rxjs';
import { EmployeeService } from '../services/employee.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard {
  constructor(private userService: UserService, private employeeService: EmployeeService) {}

  public canActivate(route: ActivatedRouteSnapshot): Observable<Promise<boolean>> {
    return this.userService.getUserSubject().pipe(
      skipWhile((user) => !user),
      map(async (user) => {
        if (!user) {
          this.userService.logout();
          return false;
        }

        const { role } = (await this.employeeService.getEmployee(user.uid)).props;
        const path = route.routeConfig?.path;

        if (role !== path) {
          this.userService.logout();
          return false;
        }

        return true;
      })
    );
  }
}
