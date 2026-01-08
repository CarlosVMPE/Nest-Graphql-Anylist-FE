import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { UserService } from '../services/user.service'; // Replace with your actual user service

@Injectable({
  providedIn: 'root',
})
export class DefaultRedirectGuard implements CanActivate {
  constructor(private userService: UserService, private router: Router) {}

  canActivate(): boolean {
    const user = this.userService.userSignal(); // Replace with your actual user state logic
    const token = localStorage.getItem('authToken');

    if (token) {
      // If the user is authenticated, redirect to 'list'
      this.router.navigate(['/list']);
    } else {
      // If the user is not authenticated, redirect to 'auth'
      this.router.navigate(['/auth/login']);
    }
    return false; // Prevent navigation to the default path
  }
}
