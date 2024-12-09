import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';

interface User {
  id?: number;
  nombre: string;
  email: string;
  password: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/users';

  constructor(private http: HttpClient, private router: Router) {} // Asegúrate de que Router esté inyectado aquí

  register(user: User): Observable<User> {
    return this.http.post<User>(this.apiUrl, user);
  }

  login(email: string, password: string): Observable<User | undefined> {
    return this.http.get<User[]>(`${this.apiUrl}?email=${email}&password=${password}`)
      .pipe(
        map((users: User[]) => {
          const user = users.length > 0 ? users[0] : undefined;
          if (user) {
            localStorage.setItem('userId', user.id!.toString()); // Guarda el ID en localStorage
          }
          return user;
        })
      );
  }

  logout(): void {
    localStorage.removeItem('userId'); // Elimina el ID de usuario del localStorage
    this.router.navigate(['/login']); // Redirige a la página de inicio de sesión
  }
}
