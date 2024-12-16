import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  errorMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
        const { username, password } = this.loginForm.value;
        // Llamar al servicio de login
        this.authService.login(username, password).subscribe({
          next: (user) => {
            const role = this.authService.getRol();
            alert(`Inicio de sesión exitoso como ${role}`);
            if (role == 'ADMIN') {
              this.router.navigate(['/velas']); // Redirigir a la lista de velas por defecto para el administrador
            } else {
              this.router.navigate(['/tienda']); // Redirigir a la lista de velas
            }
          },
          error: (err) => {
            console.error('Error during login:', err);
            alert('Usuaraio no encontrado o credenciales incorrectas.');
          }
        });
    } else {
        alert('Por favor, complete todos los campos.');
    }
}

}
