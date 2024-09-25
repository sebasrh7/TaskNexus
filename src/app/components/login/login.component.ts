import { Component, OnInit } from '@angular/core';
import {
  IMAGE_LOADER,
  ImageLoaderConfig,
  NgOptimizedImage,
} from '@angular/common';

import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatProgressSpinnerModule,
    NgOptimizedImage,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent implements OnInit {
  emailForm: FormGroup;
  linkSuccess: boolean = false;
  isLoading: boolean = false;
  error: string = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.emailForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
    });

    this.authService.currentUser.subscribe((user) => {
      if (user) {
        this.router.navigateByUrl('/workspace', { replaceUrl: true });
      }
    });
  }

  ngOnInit(): void {
    // Do nothing
  }

  async loginWithEmail() {
    if (this.isLoading) return; // Evita múltiples clics
    this.isLoading = true; // Deshabilita el botón
    const email = this.emailForm.get('email')?.value;
    if (email) {
      try {
        const result = await this.authService.loginWithEmail(email);
        if (!result.error) {
          this.linkSuccess = true;
          this.error = '';
          this.snackBar.open('Magic link sent! Check your email.', 'Close', {
            duration: 3000,
          });
        } else {
          this.error = result.error.message;

          this.snackBar.open(`Error: ${this.error}`, 'Close', {
            duration: 3000,
          });
        }
      } catch (error) {
        console.error(error);
        this.snackBar.open('An unexpected error occurred.', 'Close', {
          duration: 3000,
        });
      } finally {
        this.isLoading = false;
      }
    }
  }

  async loginWithGoogle() {
    try {
      this.authService.loginWithGoogle();
    } catch (error) {
      console.error(error);
      this.snackBar.open('An unexpected error occurred.', 'Close', {
        duration: 3000,
      });
    }
  }

  getEmailErrorMessage() {
    const emailControl = this.emailForm.get('email');
    if (emailControl?.hasError('required')) {
      return 'You must enter a value';
    }
    return emailControl?.hasError('email') ? 'Not a valid email' : '';
  }
}
