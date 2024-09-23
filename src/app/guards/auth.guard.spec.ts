import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { AuthGuard } from './auth.guard';
import { AuthService } from '../services/auth.service';
import { of } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';
import { UrlTree } from '@angular/router';

describe('AuthGuard', () => {
  let guard: AuthGuard;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(() => {
    const authServiceMock = jasmine.createSpyObj('AuthService', [], {
      currentUser: of(null), // Inicializa con null o el valor que quieras.
    });
    const routerMock = jasmine.createSpyObj('Router', ['createUrlTree']);

    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [
        AuthGuard,
        { provide: AuthService, useValue: authServiceMock },
        { provide: Router, useValue: routerMock },
      ],
    });

    guard = TestBed.inject(AuthGuard);
    authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  it('should allow the activation if user is authenticated', (done: DoneFn) => {
    // Simular que el usuario está autenticado
    (
      Object.getOwnPropertyDescriptor(authServiceSpy, 'currentUser')
        ?.get as jasmine.Spy
    ).and.returnValue(of(true));

    guard.canActivate().subscribe((result) => {
      expect(result).toBe(true);
      done();
    });
  });

  it('should redirect to login page if user is not authenticated', (done: DoneFn) => {
    // Simular que el usuario no está autenticado
    (
      Object.getOwnPropertyDescriptor(authServiceSpy, 'currentUser')
        ?.get as jasmine.Spy
    ).and.returnValue(of(false));

    const mockUrlTree: UrlTree = new UrlTree();
    routerSpy.createUrlTree.and.returnValue(mockUrlTree);

    guard.canActivate().subscribe((result) => {
      expect(result).toBe(mockUrlTree);
      done();
    });
  });
});
