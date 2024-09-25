import { Component } from '@angular/core';

import { ThemeService } from '../../../services/theme.service';
import { ThemeComponent } from '../theme/theme.component';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [ThemeComponent],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent {
  constructor(private themeService: ThemeService) {}

  onInit() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      this.themeService.setDarkTheme(true);
    } else {
      this.themeService.setDarkTheme(false);
    }
  }
}
