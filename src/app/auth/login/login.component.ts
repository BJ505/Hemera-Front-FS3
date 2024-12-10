import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { VelaService } from '../../services/vela.service';

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
    private velaService: VelaService,
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
        this.velaService.login(username, password);

        // Validar el rol y redirigir al usuario
        const role = this.velaService.getRole();
        if (role) {
            alert(`Inicio de sesión exitoso como ${role}`);
            this.router.navigate(['/velas']); // Redirigir a la lista de velas
        } else {
            alert('Credenciales incorrectas.');
        }
    } else {
        alert('Por favor, complete todos los campos.');
    }
}

}
