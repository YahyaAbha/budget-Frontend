import { Component, NgZone } from '@angular/core';
import { UserApi } from '../../../service/User-api/user-api';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { User } from '../../../service/User-api/userInterFace';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  constructor(
    private userapi: UserApi,
    private router: Router,
    private ngZone: NgZone,
  ) {}

  profileForm = new FormGroup({
    password: new FormControl('', [Validators.required, Validators.minLength(8)]),
    email: new FormControl('', [
      Validators.required,
      Validators.maxLength(25),
      Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$'),
    ]),
  });

  get password() {
    return this.profileForm.get('password');
  }
  get email() {
    return this.profileForm.get('email');
  }

  handleForm() {
    if (this.profileForm.valid) {
      const loginData = this.profileForm.value as Pick<User, 'email' | 'password'>;

      this.userapi.loginUser(loginData).subscribe({
        next: (response: any) => {
          console.log('Welcome back:', response.user.name);
          localStorage.setItem('user', JSON.stringify(response.user));

          this.ngZone.run(async () => {
            // pehle /home se door jao phir wapas jao — component dobara initialize hoga
            await this.router.navigateByUrl('/', { skipLocationChange: true });
            await this.router.navigate(['/home']);
          });
        },
        error: (err) => {
          console.error('Login Error:', err);
          alert('Invalid Email or Password!');
        },
      });
    } else {
      this.profileForm.markAllAsTouched();
    }
  }
}