import { Routes } from '@angular/router';
import { VelasListComponent } from './components/velas-list/velas-list.component';
import { VelaFormComponent } from './components/vela-form/vela-form.component';
import { RegisterComponent } from './auth/register/register.component';
import { LoginComponent } from './auth/login/login.component';


export const routes: Routes = [
    { path: 'velas', component: VelasListComponent },
    { path: 'velas/nuevo', component: VelaFormComponent },
    { path: 'velas/editar/:id', component: VelaFormComponent }, // Ruta para editar un vela
    { path: '', redirectTo: '/login', pathMatch: 'full' },// Redirige a /velas por defecto
    { path: 'register', component: RegisterComponent },
    { path: 'login', component: LoginComponent }

];
