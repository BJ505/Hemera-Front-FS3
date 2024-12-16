import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Vela {
    id: string;
    nombre: string;
    precio: number;
    imagen: string;
}

@Injectable({
    providedIn: 'root',
})
export class VelaService {
    private apiUrl = 'http://localhost:9090/api/velas'; // URL del back-end real
    private role: string = ''; // Almacenar el rol del usuario actual

    constructor(private http: HttpClient) {}

    // Obtener todos los velas
    getVelas(): Observable<Vela[]> {
        return this.http.get<Vela[]>(this.apiUrl, { headers: this.createHeaders() });
    }

    // Obtener un vela por ID
    getVela(id: string): Observable<Vela> {
        return this.http.get<Vela>(`${this.apiUrl}/${id}`, { headers: this.createHeaders() });
    }

    // Agregar un vela (solo para ADMIN)
    addVela(vela: Vela): Observable<Vela> {
        return this.http.post<Vela>(this.apiUrl, vela, { headers: this.createHeaders() });
    }

    // Actualizar un vela (solo para ADMIN)
    updateVela(id: string, vela: Vela): Observable<Vela> {
        return this.http.put<Vela>(`${this.apiUrl}/${id}`, vela, { headers: this.createHeaders() });
    }

    // Eliminar un vela (solo para ADMIN)
    deleteVela(id: string): Observable<null> {
        return this.http.delete<null>(`${this.apiUrl}/${id}`, { headers: this.createHeaders() });
    }
    
    // Método para recuperar el rol del usuario desde localStorage
    getRole(): string {
        if (!this.role) {
            this.role = localStorage.getItem('userRole') || ''; // Recuperar rol desde localStorage
        }
        return this.role;
    }
    
    // Método para obtener el nombre del usuario actual
    getUsername(): string {
        return localStorage.getItem('username') || '';
    }
    // Crear encabezados con autenticación básica
    private createHeaders(): HttpHeaders {
        const username = localStorage.getItem('userName'); // Credenciales del back-end
        const password = localStorage.getItem('userPassword');
        const auth = btoa(`${username}:${password}`);

        return new HttpHeaders({
            Authorization: `Basic ${auth}`,
        });
    }
    
}
