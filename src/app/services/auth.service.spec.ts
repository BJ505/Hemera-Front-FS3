import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AuthService } from './auth.service';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

interface User {
  id?: number;
  username: string;
  password: string;
  rol: string;
}

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;
  let routerSpy: jasmine.SpyObj<Router>;

  const mockUser: User = {
    id: 1,
    username: 'testuser',
    password: 'testpassword',
    rol: 'admin'
  };

  beforeEach(() => {
    const spy = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
      providers: [AuthService, { provide: Router, useValue: spy }]
    });

    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should register a user via POST', () => {
    service.register(mockUser).subscribe((user) => {
      expect(user).toEqual(mockUser);
    });

    const req = httpMock.expectOne(service['apiUrl']);
    expect(req.request.method).toBe('POST');
    req.flush(mockUser);
  });

  it('should log in a user and save data to localStorage', () => {
    service.login('testuser', 'testpassword').subscribe((user) => {
      expect(user).toEqual(mockUser);
      expect(localStorage.getItem('userId')).toBe('1');
      expect(localStorage.getItem('userRol')).toBe('admin');
      expect(localStorage.getItem('userName')).toBe('testuser');
      expect(localStorage.getItem('userPassword')).toBe('testpassword');
    });

    const req = httpMock.expectOne(service['apiUrl']);
    expect(req.request.method).toBe('POST');
    req.flush(mockUser);
  });

  it('should handle login errors gracefully', () => {
    service.login('invaliduser', 'invalidpassword').subscribe({
      error: (error) => {
        expect(error.message).toContain('Failed to login');
      },
    });

    const req = httpMock.expectOne(service['apiUrl']);
    req.flush('Login failed', { status: 401, statusText: 'Unauthorized' });
  });

  it('should clear localStorage and navigate on logout', () => {
    localStorage.setItem('userId', '1');
    service.logout();
    expect(localStorage.getItem('userId')).toBeNull();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('should return the role from localStorage', () => {
    localStorage.setItem('userRol', 'admin');
    expect(service.getRol()).toBe('admin');
  });

  it('should return the username from localStorage', () => {
    localStorage.setItem('userName', 'testuser');
    expect(service.getUsername()).toBe('testuser');
  });
});
