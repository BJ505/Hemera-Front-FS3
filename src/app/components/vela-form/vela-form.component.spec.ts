import { TestBed, ComponentFixture } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, throwError } from 'rxjs';
import { VelaFormComponent } from './vela-form.component';
import { VelaService } from '../../services/vela.service';
import { Vela } from '../../services/vela.service';

describe('VelaFormComponent', () => {
    let component: VelaFormComponent;
    let fixture: ComponentFixture<VelaFormComponent>;
    let velaService: jasmine.SpyObj<VelaService>;
    let router: Router;
    let mockActivatedRoute: any;

    beforeEach(async () => {
        // Crear mocks para los servicios y dependencias
        velaService = jasmine.createSpyObj('VelaService', ['getVela', 'addVela', 'updateVela']);
        mockActivatedRoute = {
            snapshot: {
                paramMap: {
                    get: jasmine.createSpy('get').and.returnValue(null), // Cambia según la prueba
                },
            },
        };

        await TestBed.configureTestingModule({
            imports: [
                HttpClientTestingModule,
                ReactiveFormsModule,
                RouterTestingModule,
                VelaFormComponent, // Importar el componente standalone aquí
            ],
            providers: [
                { provide: VelaService, useValue: velaService },
                { provide: ActivatedRoute, useValue: mockActivatedRoute },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(VelaFormComponent);
        component = fixture.componentInstance;
        router = TestBed.inject(Router);
        fixture.detectChanges();
    });

    it('debería crear el componente', () => {
        expect(component).toBeTruthy();
    });

    it('debería inicializar el formulario y verificar modo edición', () => {
        mockActivatedRoute.snapshot.paramMap.get.and.returnValue('1'); // Simula un ID en la ruta
        velaService.getVela.and.returnValue(of({ id: '1', nombre: 'Vela', precio: 1000, imagen: 'url' }));
        component.ngOnInit();
        expect(component.isEditMode).toBeTrue();
        expect(component.velaForm.value).toEqual({ nombre: 'Vela', precio: 1000, imagen: 'url' });
    });

    it('debería manejar errores al cargar una vela para edición', () => {
        mockActivatedRoute.snapshot.paramMap.get.and.returnValue('1');
        velaService.getVela.and.returnValue(throwError(() => new Error('Error al cargar')));
        component.ngOnInit();
        expect(component.errorMessage).toBe('Error al cargar la vela. Intente nuevamente.');
    });

    it('debería agregar una vela correctamente', () => {
        velaService.addVela.and.returnValue(of({ id: '1', nombre: 'Nueva Vela', precio: 1500, imagen: 'url' }));
        spyOn(router, 'navigate');
        component.velaForm.setValue({ nombre: 'Nueva Vela', precio: 1500, imagen: 'url' });
        component.onSubmit();
        expect(router.navigate).toHaveBeenCalledWith(['/velas']);
    });

    it('debería manejar errores al agregar una vela', () => {
        velaService.addVela.and.returnValue(throwError(() => new Error('Error al agregar')));
        component.velaForm.setValue({ nombre: 'Nueva Vela', precio: 1500, imagen: 'url' });
        component.onSubmit();
        expect(component.errorMessage).toBe('No se pudo agregar la vela. Intente nuevamente.');
    });

    it('debería actualizar una vela correctamente', () => {
        mockActivatedRoute.snapshot.paramMap.get.and.returnValue('1');
        velaService.updateVela.and.returnValue(of({ id: '1', nombre: 'Vela Actualizada', precio: 2000, imagen: 'url' }));
        spyOn(router, 'navigate');
        component.velaForm.setValue({ nombre: 'Vela Actualizada', precio: 2000, imagen: 'url' });
        component.isEditMode = true;
        component.velaId = '1';
        component.onSubmit();
        expect(router.navigate).toHaveBeenCalledWith(['/velas']);
    });

    it('debería manejar errores al actualizar una vela', () => {
        mockActivatedRoute.snapshot.paramMap.get.and.returnValue('1');
        velaService.updateVela.and.returnValue(throwError(() => new Error('Error al actualizar')));
        component.velaForm.setValue({ nombre: 'Vela Actualizada', precio: 2000, imagen: 'url' });
        component.isEditMode = true;
        component.velaId = '1';
        component.onSubmit();
        expect(component.errorMessage).toBe('No se pudo actualizar el vela. Intente nuevamente.');
    });

    it('debería cancelar y redirigir a la lista de velas', () => {
        spyOn(router, 'navigate');
        component.cancelar();
        expect(router.navigate).toHaveBeenCalledWith(['/velas']);
    });

    it('debería mostrar mensajes de error en el formulario', () => {
        component.velaForm.get('nombre')?.setValue('');
        expect(component.getErrorMessage('nombre')).toBe('Este campo es requerido');
        component.velaForm.get('precio')?.setValue(50);
        expect(component.getErrorMessage('precio')).toBe('Precio debe ser entre 1000 y 50000');
    });
});
