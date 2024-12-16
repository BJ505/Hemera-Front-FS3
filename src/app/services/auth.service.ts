import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { catchError, map, tap } from 'rxjs/operators';

interface User {
  id?: number;
  username: string;
  password: string;
  rol: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:9090/api/usuarios/login';
  private rol: string = '';

  constructor(private http: HttpClient, private router: Router) {}

  register(user: User): Observable<User> {
    return this.http.post<User>(this.apiUrl, user);
  }


  login(username: string, password: string): Observable<User | undefined> {
    const loginPayload = { username, password };
    console.log('Request payload:', loginPayload);
    console.log('Request URL:', `${this.apiUrl}`);

    return this.http.post<User>(`${this.apiUrl}`, loginPayload, { headers: { 'Content-Type': 'application/json' } })
      .pipe(
        tap(response => console.log('Response from server:', response)), // Registro de la respuesta del servidor
        map((user: User) => {
          if (user) {
            console.log('User logged in:', user);
            localStorage.setItem('userId', user.id!.toString());
            localStorage.setItem('userRol', user.rol!.toString());
            localStorage.setItem('userName', user.username!.toString());
            localStorage.setItem('userPassword', user.password!.toString());
          }
          return user;
        }),
        catchError((error) => {
          console.error('Login request failed:', error);
          return throwError(() => new Error('Failed to login'));
        })
      );
  }

  logout(): void {
    localStorage.removeItem('userId'); // Elimina el ID de usuario del localStorage
    this.router.navigate(['/login']); // Redirige a la página de inicio de sesión
  }

  getRol(): string {
    if (!this.rol) {
        this.rol = localStorage.getItem('userRol') || ''; // Recuperar rol desde localStorage
    }
    return this.rol;
}

  // Método para obtener el nombre del usuario actual
  getUsername(): string {
      return localStorage.getItem('userName') || '';
  }
}
