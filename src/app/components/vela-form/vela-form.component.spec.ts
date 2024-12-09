import { TestBed, ComponentFixture, fakeAsync, tick } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { VelaFormComponent } from './vela-form.component';
import { VelaService } from '../../services/vela.service';
import { HttpErrorResponse } from '@angular/common/http';

describe('VelaFormComponent', () => {
    let component: VelaFormComponent;
    let fixture: ComponentFixture<VelaFormComponent>;
    let velaServiceMock: jasmine.SpyObj<VelaService>;
    let routerMock: jasmine.SpyObj<Router>;
    let activatedRouteMock: any;

    beforeEach(async () => {
        velaServiceMock = jasmine.createSpyObj('VelaService', ['getVela', 'addVela', 'updateVela']);
        routerMock = jasmine.createSpyObj('Router', ['navigate']);
        activatedRouteMock = { snapshot: { paramMap: { get: jasmine.createSpy('get') } } };

        await TestBed.configureTestingModule({
            declarations: [VelaFormComponent],
            imports: [ReactiveFormsModule],
            providers: [
                { provide: VelaService, useValue: velaServiceMock },
                { provide: Router, useValue: routerMock },
                { provide: ActivatedRoute, useValue: activatedRouteMock },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(VelaFormComponent);
        component = fixture.componentInstance;
    });

    it('debería crear el componente', () => {
        expect(component).toBeTruthy();
    });

    it('debería inicializar el formulario y verificar modo edición', fakeAsync(() => {
        activatedRouteMock.snapshot.paramMap.get.and.returnValue('123'); // Simula un id
        velaServiceMock.getVela.and.returnValue(of({ id: '123', nombre: 'Vela Roja', precio: 15000, imagen: 'img.jpg' }));

        component.ngOnInit();
        tick();

        expect(component.isEditMode).toBeTrue();
        expect(component.velaForm.value).toEqual({ nombre: 'Vela Roja', precio: 15000, imagen: 'img.jpg' });
    }));

    it('debería manejar errores al cargar una vela para edición', fakeAsync(() => {
        activatedRouteMock.snapshot.paramMap.get.and.returnValue('123'); // Simula un id
        velaServiceMock.getVela.and.returnValue(throwError(() => new HttpErrorResponse({ error: 'Error' })));

        component.ngOnInit();
        tick();

        expect(component.errorMessage).toBe('Error al cargar la vela. Intente nuevamente.');
    }));

    it('debería agregar una vela correctamente', fakeAsync(() => {
        component.velaForm.setValue({ nombre: 'Vela Azul', precio: 20000, imagen: 'img.jpg' });
        velaServiceMock.addVela.and.returnValue(of({ id: '456', nombre: 'Vela Azul', precio: 20000, imagen: 'img.jpg' }));

        component.onSubmit();
        tick();

        expect(velaServiceMock.addVela).toHaveBeenCalled();
        expect(routerMock.navigate).toHaveBeenCalledWith(['/velas']);
    }));

    it('debería manejar errores al agregar una vela', fakeAsync(() => {
        component.velaForm.setValue({ nombre: 'Vela Azul', precio: 20000, imagen: 'img.jpg' });
        velaServiceMock.addVela.and.returnValue(throwError(() => new HttpErrorResponse({ error: 'Error' })));

        component.onSubmit();
        tick();

        expect(component.errorMessage).toBe('No se pudo agregar la vela. Intente nuevamente.');
    }));

    it('debería actualizar una vela correctamente', fakeAsync(() => {
        component.isEditMode = true;
        component.velaId = '123';
        component.velaForm.setValue({ nombre: 'Vela Verde', precio: 25000, imagen: 'img.jpg' });
        velaServiceMock.updateVela.and.returnValue(of({ id: '123', nombre: 'Vela Verde', precio: 25000, imagen: 'img.jpg' }));

        component.onSubmit();
        tick();

        expect(velaServiceMock.updateVela).toHaveBeenCalledWith('123', component.velaForm.value);
        expect(routerMock.navigate).toHaveBeenCalledWith(['/velas']);
    }));

    it('debería manejar errores al actualizar una vela', fakeAsync(() => {
        component.isEditMode = true;
        component.velaId = '123';
        component.velaForm.setValue({ nombre: 'Vela Verde', precio: 25000, imagen: 'img.jpg' });
        velaServiceMock.updateVela.and.returnValue(throwError(() => new HttpErrorResponse({ error: 'Error' })));

        component.onSubmit();
        tick();

        expect(component.errorMessage).toBe('No se pudo actualizar el vela. Intente nuevamente.');
    }));

    it('debería cancelar y redirigir a la lista de velas', () => {
        component.cancelar();

        expect(routerMock.navigate).toHaveBeenCalledWith(['/velas']);
    });

    it('debería mostrar mensajes de error en el formulario', () => {
        component.velaForm.controls['nombre'].setErrors({ required: true });
        expect(component.getErrorMessage('nombre')).toBe('Este campo es requerido');

        component.velaForm.controls['precio'].setErrors({ min: true });
        expect(component.getErrorMessage('precio')).toBe('Precio debe ser entre 1000 y 50000');
    });
});
