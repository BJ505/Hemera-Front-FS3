import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VelasListComponent } from './velas-list.component';
import { VelaService, Vela } from '../../services/vela.service';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, throwError } from 'rxjs';

describe('VelasListComponent', () => {
    let component: VelasListComponent;
    let fixture: ComponentFixture<VelasListComponent>;
    let velaService: jasmine.SpyObj<VelaService>;
    let router: Router;

    const mockVelas: Vela[] = [
        { id: '1', nombre: 'Vela Roja', precio: 1500, imagen: 'vela_roja.jpg' },
        { id: '2', nombre: 'Vela Azul', precio: 2000, imagen: 'vela_azul.jpg' },
    ];

    beforeEach(async () => {
      velaService = jasmine.createSpyObj('VelaService', ['getVelas', 'deleteVela', 'getRole']);
      velaService.getVelas.and.returnValue(of(mockVelas)); // Devuelve una lista de velas
      velaService.deleteVela.and.returnValue(of(null)); // Devuelve null para deleteVela
      velaService.getRole.and.returnValue('ADMIN'); // Simula rol de ADMIN
  
      await TestBed.configureTestingModule({
          imports: [RouterTestingModule, VelasListComponent],
          providers: [{ provide: VelaService, useValue: velaService }],
      }).compileComponents();
  
      fixture = TestBed.createComponent(VelasListComponent);
      component = fixture.componentInstance;
      router = TestBed.inject(Router);
      fixture.detectChanges();
    });
  

    it('debería crear el componente', () => {
        expect(component).toBeTruthy();
    });

    it('debería cargar la lista de velas al inicializar', () => {
        expect(velaService.getVelas).toHaveBeenCalled();
        expect(component.velas).toEqual(mockVelas);
    });

    it('debería mostrar un mensaje de error si falla al cargar las velas', () => {
        velaService.getVelas.and.returnValue(throwError(() => new Error('Error al cargar velas')));
        spyOn(window, 'alert');

        component.cargarVelas();

        expect(window.alert).toHaveBeenCalledWith('No se pudieron cargar los velas. Intente nuevamente.');
    });

    it('debería redirigir al usuario a la página de edición si tiene rol ADMIN', () => {
        spyOn(router, 'navigate');

        component.editarVela('1');

        expect(router.navigate).toHaveBeenCalledWith(['/velas/editar', '1']);
    });

    it('debería mostrar un mensaje si el usuario no tiene permisos para editar velas', () => {
        velaService.getRole.and.returnValue('USER'); // Simular rol de USER
        spyOn(window, 'alert');

        component.editarVela('1');

        expect(window.alert).toHaveBeenCalledWith('No tienes permisos para editar velas.');
    });

    it('debería eliminar una vela si el usuario tiene rol ADMIN y confirma', () => {
        spyOn(window, 'confirm').and.returnValue(true);
        spyOn(window, 'alert');

        component.eliminarVela('1');

        expect(velaService.deleteVela).toHaveBeenCalledWith('1');
        expect(component.velas.length).toBe(1); // Una vela eliminada
        expect(window.alert).toHaveBeenCalledWith('Vela eliminado con éxito');
    });

    it('debería mostrar un mensaje de error si falla al eliminar una vela', () => {
        velaService.deleteVela.and.returnValue(throwError(() => new Error('Error al eliminar vela')));
        spyOn(window, 'confirm').and.returnValue(true);
        spyOn(window, 'alert');

        component.eliminarVela('1');

        expect(window.alert).toHaveBeenCalledWith('No se pudo eliminar el vela. Intente nuevamente.');
    });

    it('debería redirigir al usuario a la página de agregar nueva vela si tiene rol ADMIN', () => {
        spyOn(router, 'navigate');

        component.agregarNuevoVela();

        expect(router.navigate).toHaveBeenCalledWith(['/velas/nuevo']);
    });

    it('debería mostrar un mensaje si el usuario no tiene permisos para agregar velas', () => {
        velaService.getRole.and.returnValue('USER'); // Simular rol de USER
        spyOn(window, 'alert');

        component.agregarNuevoVela();

        expect(window.alert).toHaveBeenCalledWith('No tienes permisos para agregar velas.');
    });
});