import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { AuthService } from '../../services/auth.service';
import { LoginComponent } from './login.component';

describe('LoginComponent', () => {
    let component: LoginComponent;
    let fixture: ComponentFixture<LoginComponent>;
    let authService: jasmine.SpyObj<AuthService>;
    let router: Router;

    beforeEach(async () => {
        // Crear mock para authService
        authService = jasmine.createSpyObj('authService', ['login', 'getRol']);
        authService.getRol.and.returnValue(""); // Valor por defecto para rol

        await TestBed.configureTestingModule({
            imports: [
                ReactiveFormsModule,
                RouterTestingModule,
                LoginComponent, // Importar el componente standalone
            ],
            providers: [{ provide: authService, useValue: authService }],
        }).compileComponents();

        fixture = TestBed.createComponent(LoginComponent);
        component = fixture.componentInstance;
        router = TestBed.inject(Router);
        fixture.detectChanges();
    });

    it('debería crear el componente', () => {
        expect(component).toBeTruthy();
    });

    it('debería inicializar el formulario correctamente', () => {
        expect(component.loginForm).toBeDefined();
        expect(component.loginForm.controls['username']).toBeDefined();
        expect(component.loginForm.controls['password']).toBeDefined();
    });

    it('debería mostrar una alerta si el formulario está incompleto', () => {
        spyOn(window, 'alert');
        component.loginForm.setValue({ username: '', password: '' });
        component.onSubmit();
        expect(window.alert).toHaveBeenCalledWith('Por favor, complete todos los campos.');
    });

    it('debería llamar al servicio de login y redirigir al usuario con rol válido', () => {
        authService.getRol.and.returnValue('ADMIN'); // Simular rol válido
        spyOn(window, 'alert');
        spyOn(router, 'navigate');

        component.loginForm.setValue({ username: 'admin', password: 'admin123' });
        component.onSubmit();

        expect(authService.login).toHaveBeenCalledWith('admin', 'admin123');
        expect(window.alert).toHaveBeenCalledWith('Inicio de sesión exitoso como ADMIN');
        expect(router.navigate).toHaveBeenCalledWith(['/velas']);
    });

    it('debería mostrar una alerta si las credenciales son incorrectas', () => {
        authService.getRol.and.returnValue(""); // Simular rol inválido
        spyOn(window, 'alert');

        component.loginForm.setValue({ username: 'user', password: 'wrongpassword' });
        component.onSubmit();

        expect(authService.login).toHaveBeenCalledWith('user', 'wrongpassword');
        expect(window.alert).toHaveBeenCalledWith('Credenciales incorrectas.');
    });
});
