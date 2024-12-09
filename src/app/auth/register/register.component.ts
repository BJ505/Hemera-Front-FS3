import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true, // Indica que es un componente independiente
  imports: [ReactiveFormsModule, CommonModule], // Importa ReactiveFormsModule aquí
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      nombre: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
      ]],
      confirmPassword: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      const { nombre, email, password } = this.registerForm.value;
      const newUser = { nombre, email, password };

      this.authService.register(newUser).subscribe({
        next: () => {
          console.log('Usuario registrado con éxito');
          alert('Registro exitoso');
          this.router.navigate(['/login']); // Redirigir al login después de registrarse
        },
        error: (err) => {
          console.error('Error al registrar el usuario:', err);
          alert('Hubo un problema al registrar el usuario');
        }
      });
    }
  }
}
