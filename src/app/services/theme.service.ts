import { Injectable, Renderer2, RendererFactory2 } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private isDarkTheme = new BehaviorSubject<boolean>(false);
  isDarkTheme$ = this.isDarkTheme.asObservable();
  renderer: Renderer2;

  constructor(rendererFactory: RendererFactory2) {
    this.renderer = rendererFactory.createRenderer(null, null);
    // Initialize theme based on user preference or saved setting
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      this.setDarkTheme(true);
    } else {
      this.setDarkTheme(false);
    }
  }

  setDarkTheme(isDark: boolean) {
    this.isDarkTheme.next(isDark);
    if (isDark) {
      this.renderer.removeClass(document.body, 'light-theme');
      this.renderer.addClass(document.body, 'dark-theme');
    } else {
      this.renderer.removeClass(document.body, 'dark-theme');
      this.renderer.addClass(document.body, 'light-theme');
    }
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  }

  toggleTheme() {
    this.setDarkTheme(!this.isDarkTheme.value);
  }
}
