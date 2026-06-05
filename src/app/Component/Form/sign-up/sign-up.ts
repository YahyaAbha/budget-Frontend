import { Component } from '@angular/core';
import { UserApi } from '../../../service/User-api/user-api';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { User } from '../../../service/User-api/userInterFace';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sign-up',
  imports: [ReactiveFormsModule],
  templateUrl: './sign-up.html',
  styleUrl: './sign-up.css',
})
export class SignUp {
  profileForm = new FormGroup({
    name: new FormControl('', Validators.required),
    password: new FormControl('', [Validators.required, Validators.minLength(8)]),
    email: new FormControl('', [
      Validators.required,
      Validators.maxLength(25),
      Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$'),
    ]),
  });
  constructor(
    private userapi: UserApi,
    private router: Router,
  ) {}

  signUp() {
    if (this.profileForm.valid) {
      const signUpData: any = this.profileForm.value;
      this.userapi.signUpUser(signUpData).subscribe({
        next: (response) => {
          console.log('Sign Up Successful:', response);
          alert('Sign Up Successful! Please log in.');
          this.router.navigate(['/login']);
        },
        error: (err) => {
          console.error('Sign Up Error:', err);
          alert('Sign Up Failed! Please try again.');
        },
      });
    } else {
      this.profileForm.markAllAsTouched();
    }
  }
}
