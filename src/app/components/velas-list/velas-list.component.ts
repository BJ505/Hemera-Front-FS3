import { Component, OnInit } from '@angular/core';
import { VelaService, Vela } from '../../services/vela.service';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
    selector: 'app-velas-list',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './velas-list.component.html',
    styleUrls: ['./velas-list.component.css']
})
export class VelasListComponent implements OnInit {
    velas: Vela[] = [];
    rol: string = ''; // Rol del usuario actual

    constructor(
        private velaService: VelaService,
        private authService: AuthService,
        private router: Router
    ) {}

    ngOnInit(): void {
        // Obtener el rol actual del usuario
        this.rol = this.authService.getRol();
        console.log('Rol del usuario:', this.rol); // Depuración
        this.cargarVelas();
    }
    

    // Cargar la lista de velas desde el servicio
    cargarVelas(): void {
        this.velaService.getVelas().subscribe({
            next: (data) => {
                this.velas = data;
                console.log('Velas cargados:', this.velas);
            },
            error: (err) => {
                console.error('Error al cargar velas:', err);
                alert('No se pudieron cargar los velas. Intente nuevamente.');
            }
        });
    }

    // Editar un vela (solo para ADMIN)
    editarVela(id: string): void {
        if (this.rol === 'ADMIN') {
            this.router.navigate(['/velas/editar', id]);
        } else {
            alert('No tienes permisos para editar velas.');
        }
    }

    // Eliminar un vela (solo para ADMIN)
    eliminarVela(id: string): void {
        if (this.rol === 'ADMIN') {
            if (confirm('¿Estás seguro de que quieres eliminar este vela?')) {
                this.velaService.deleteVela(id).subscribe({
                    next: () => {
                        alert('Vela eliminado con éxito');
                        this.velas = this.velas.filter(vela => vela.id !== id);
                    },
                    error: (err) => {
                        console.error('Error al eliminar el vela:', err);
                        alert('No se pudo eliminar el vela. Intente nuevamente.');
                    }
                });
            }
        } else {
            alert('No tienes permisos para eliminar velas.');
        }
    }

    // Agregar un nuevo vela (solo para ADMIN)
    agregarNuevoVela(): void {
        if (this.rol === 'ADMIN') {
            this.router.navigate(['/velas/nuevo']);
        } else {
            alert('No tienes permisos para agregar velas.');
        }
    }
}
