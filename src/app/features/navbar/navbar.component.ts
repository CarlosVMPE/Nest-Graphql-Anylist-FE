import { Component, effect, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
  standalone: false,
})
export class NavbarComponent implements OnInit {
  username: string = '';
  dropdownVisible: boolean = false;

  constructor(private router: Router, private userService: UserService) {
    effect(() => {
      const user = this.userService.userSignal();
      if (user) {
        this.username = user.fullName;
      } else {
        this.username = 'Guest';
      }
    });
  }

  ngOnInit(): void {}

  toggleDropdown() {
    this.dropdownVisible = !this.dropdownVisible;
  }

  logout() {
    // Aquí puedes agregar la lógica para cerrar sesión
    this.userService.clearUser();
    this.router.navigate(['/auth/login']);
  }
}
