import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { VelaService, Vela } from '../../services/vela.service';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
    selector: 'app-vela-form',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './vela-form.component.html',
    styleUrls: ['./vela-form.component.css']
})
export class VelaFormComponent implements OnInit {
    velaForm: FormGroup;
    velaId: string | null = null;
    isEditMode = false; // Variable para verificar si estamos en modo edición
    errorMessage: string | null = null;

    constructor(
        private fb: FormBuilder,
        private velaService: VelaService,
        private route: ActivatedRoute,
        private router: Router
    ) {
        this.velaForm = this.fb.group({
            nombre: ['', Validators.required],
            precio: [
                '',
                [Validators.required, Validators.min(1000), Validators.max(50000)],
            ],
            imagen: ['', Validators.required],
        });
    }

    ngOnInit(): void {
        // Verificar si estamos en modo edición
        this.velaId = this.route.snapshot.paramMap.get('id');
        this.isEditMode = !!this.velaId;

        if (this.isEditMode) {
            // Cargar datos del vela para edición
            this.velaService.getVela(this.velaId!).subscribe({
                next: (vela) => this.velaForm.patchValue(vela),
                error: (err: HttpErrorResponse) => {
                    console.error('Error al cargar vela para su edición:', err.message);
                    this.errorMessage = 'Error al cargar la vela. Intente nuevamente.';
                },
            });
        }
    }

    onSubmit(): void {
        if (this.velaForm.valid) {
            const vela: Vela = this.velaForm.value;
            this.errorMessage = null; // Limpiar mensaje de error

            if (this.isEditMode) {
                // Modo edición
                this.velaService.updateVela(this.velaId!, vela).subscribe({
                    next: () => {
                        alert('Vela actualizads con éxito');
                        this.router.navigate(['/velas']);
                    },
                    error: (err: HttpErrorResponse) => {
                        console.error('Error al actualizar el vela:', err.message);
                        this.errorMessage = 'No se pudo actualizar el vela. Intente nuevamente.';
                    },
                });
            } else {
                // Modo agregar
                this.velaService.addVela(vela).subscribe({
                    next: () => {
                        alert('Vela agregada con éxito');
                        this.router.navigate(['/velas']);
                    },
                    error: (err: HttpErrorResponse) => {
                        console.error('Error al agregar la vela:', err.message);
                        this.errorMessage = 'No se pudo agregar la vela. Intente nuevamente.';
                    },
                });
            }
        } else {
            this.errorMessage = 'Por favor, complete todos los campos requeridos.';
        }
    }

    cancelar(): void {
        this.router.navigate(['/velas']); // Redirige a la lista de velas
    }

    // Método para mostrar los mensajes de error
    getErrorMessage(controlName: string): string {
        const control = this.velaForm.get(controlName);
        if (control?.hasError('required')) {
            return 'Este campo es requerido';
        }
        if (
            controlName === 'precio' &&
            (control?.hasError('min') || control?.hasError('max'))
        ) {
            return 'Precio debe ser entre 1000 y 50000';
        }
        return '';
    }
}
