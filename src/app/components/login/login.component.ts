import { Component, OnInit } from '@angular/core';

import { FormsModule } from '@angular/forms';

import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

import { ThemeService } from '../../services/theme.service';
import { ThemeComponent } from '../theme/theme.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,

    ThemeComponent,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent implements OnInit {
  email: string = '';
  linkSuccess: boolean = false;
  error: string = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private themeService: ThemeService
  ) {
    this.authService.currentUser.subscribe((user) => {
      if (user) {
        this.router.navigateByUrl('/workspace', { replaceUrl: true });
      }
    });
  }

  ngOnInit(): void {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      this.themeService.setDarkTheme(true);
    } else {
      this.themeService.setDarkTheme(false);
    }
  }

  async loginWithEmail() {
    try {
      const result = await this.authService.loginWithEmail(this.email);
      if (!result.error) {
        this.linkSuccess = true;
        this.error = '';
      } else {
        this.error = result.error.message;
      }
    } catch (error) {
      console.error(error);
    }
  }

  async loginWithGoogle() {
    try {
      this.authService.loginWithGoogle();
    } catch (error) {
      console.error(error);
    }
  }
}
