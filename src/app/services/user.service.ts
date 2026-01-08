import { Injectable, signal } from '@angular/core';
import { User } from '../models/User';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  userSignal = signal<User | null>(null);

  setUser(user: User | null) {
    this.userSignal.set(user);
    localStorage.setItem('authToken', user ? user.token : '');
  }

  getUser() {
    return this.userSignal();
  }

  // Method to clear the user (e.g., on logout)
  clearUser() {
    this.userSignal.set(null);
    localStorage.setItem('authToken', '');
  }
}
