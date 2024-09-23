import { Injectable } from '@angular/core';
import { createClient, SupabaseClient, User } from '@supabase/supabase-js';
import { environment } from '../../environments/environment';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private supabase: SupabaseClient;
  private _currentUser: BehaviorSubject<boolean | User | any> =
    new BehaviorSubject(null);

  constructor(private router: Router) {
    this.supabase = createClient(
      environment.supabaseUrl,
      environment.supabaseAnonKey
    );

    this.supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (error) {
        console.error('Error getting session:', error);
        this._currentUser.next(false);
      } else if (session) {
        this._currentUser.next(session.user);
      } else {
        this._currentUser.next(false);
      }
    });

    this.supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN') {
        this._currentUser.next(session!.user);
      } else if (event === 'SIGNED_OUT') {
        this._currentUser.next(false);
        this.router.navigateByUrl('/', { replaceUrl: true });
      }
    });
  }

  loginWithEmail(email: string) {
    return this.supabase.auth.signInWithOtp({
      email,
    });
  }

  loginWithGoogle() {
    return this.supabase.auth.signInWithOAuth({
      provider: 'google',
    });
  }

  logout() {
    return this.supabase.auth.signOut();
  }

  get currentUser() {
    return this._currentUser.asObservable();
  }
}
