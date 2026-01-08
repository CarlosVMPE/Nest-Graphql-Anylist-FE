import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
} from '@angular/router';
import { LoginService } from '../services/auth/login.service';
import { UserService } from '../services/user.service';
import { User } from '../models/User';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router,
    private loginService: LoginService,
    private userService: UserService
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    const token = localStorage.getItem('authToken');
    // TODO: Add logic to validate token expiration
    if (token) {
      this.loginService.revalidate().subscribe(
        (response: any) => {
          const { data } = response as {
            data: { revalidate: { token: string; user: User } };
          };

          const { revalidate } = data;
          if (revalidate && revalidate.token) {
            this.userService.setUser(revalidate.user);
            localStorage.setItem('authToken', revalidate.token);
          } else {
            this.router.navigate(['/auth/login']);
          }
        },
        (error) => {
          localStorage.removeItem('authToken');
          this.router.navigate(['/auth/login']);
        }
      );
      return true;
    } else {
      this.router.navigate(['/auth/login']);
      return false;
    }
  }
}
