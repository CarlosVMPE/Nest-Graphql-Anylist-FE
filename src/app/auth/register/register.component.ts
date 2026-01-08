import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from 'src/app/models/User';
import { LoginService } from 'src/app/services/auth/login.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['../login/login.component.css'],
  standalone: false,
})
export class RegisterComponent {
  registerForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private loginService: LoginService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      fullName: ['', [Validators.required, Validators.minLength(3)]],
    });
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      const { email, password, fullName } = this.registerForm.value;
      this.loginService
        .register(email, password, fullName)
        .subscribe((response: any) => {
          const { data } = response as {
            data: { signup: { token: string; user: User } };
          };
          const { signup } = data;
          if (signup && signup.token) {
            const { token, user } = signup;
            this.userService.setUser({ ...user, token });
            this.registerForm.reset();
            this.router.navigate(['/list']);
          }
        });
    } else {
      console.log('Form is invalid');
    }
  }
}
