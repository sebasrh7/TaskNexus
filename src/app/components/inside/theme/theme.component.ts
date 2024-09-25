import { Component, inject } from '@angular/core';
import { ThemeService } from '../../../services/theme.service';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-theme',
  standalone: true,
  imports: [MatSlideToggleModule, AsyncPipe],
  templateUrl: './theme.component.html',
  styleUrl: './theme.component.scss',
})
export class ThemeComponent {
  private themeService = inject(ThemeService);
  isDarkTheme$ = this.themeService.isDarkTheme$;

  toggleTheme() {
    this.themeService.toggleTheme();
  }
}
