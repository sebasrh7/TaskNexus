import { CanActivate, Router, UrlTree } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, filter, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): Observable<boolean | UrlTree> {
    return this.authService.currentUser.pipe(
      filter((val) => val !== null),
      take(1),
      map((isAuthenticated) => {
        if (isAuthenticated) {
          console.log('Authenticated');
          return true;
        } else {
          console.log('Not authenticated');
          return this.router.createUrlTree(['/']);
        }
      })
    );
  }
}
