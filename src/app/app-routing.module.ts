import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { IsLoggedGuard } from './security/is-logged.service';
import { TeacherGuard } from './security/teacher-guard.service';

// Servicios de seguridad
import { TestLoginGuard } from './security/test-login.service';

// Componentes de la aplicación
import { ForgetComponent } from './views/forget/forget.component';
import { LoginComponent } from './views/login/login.component';
import { MainParentComponent } from './views/main-parent/main-parent.component';
import { MainTeacherComponent } from './views/main-teacher/main-teacher.component';
import { MainComponent } from './views/main/main.component';
import { RegisterComponent } from './views/register/register.component';
import { AulaFormComponent } from './views/aula-form/aula-form.component';
import { HasAulasGuard } from './security/has-aulas.service';
import { AulasComponent } from './views/aulas/aulas.component';
import { AlumnosComponent } from './views/alumnos/alumnos.component';
import { AlumnoFormComponent } from './views/alumno-form/alumno-form.component';
import { PerfilComponent } from './views/perfil/perfil.component';
import { MenusComponent } from './views/menus/menus.component';
import { DietariosComponent } from './views/dietarios/dietarios.component';
import { DietariosPadresComponent } from './views/dietarios-padres/dietarios-padres.component';

const routes: Routes = [
  { path: "", component: LoginComponent, canActivate: [TestLoginGuard] },
  { path: "login", component: LoginComponent, canActivate: [TestLoginGuard] },
  { path: "register", component: RegisterComponent },
  { path: "forget", component: ForgetComponent },
  { path: "profile", component: PerfilComponent, canActivate: [IsLoggedGuard] },
  { path: "main", component: MainComponent, canActivate: [IsLoggedGuard] },
  { path: "main/parent", component: MainParentComponent, canActivate: [IsLoggedGuard] },
  { path: "main/teacher", component: MainTeacherComponent, canActivate: [IsLoggedGuard, TeacherGuard, HasAulasGuard] },
  { path: "aulas", component: AulasComponent, canActivate: [IsLoggedGuard, TeacherGuard ] },
  { path: "aulas/formulario", component: AulaFormComponent, canActivate: [IsLoggedGuard, TeacherGuard ] },
  { path: "alumnos", component: AlumnosComponent, canActivate: [IsLoggedGuard, TeacherGuard ] },
  { path: "alumnos/formulario", component: AlumnoFormComponent, canActivate: [IsLoggedGuard, TeacherGuard ] },
  { path: "menus", component: MenusComponent, canActivate: [IsLoggedGuard, TeacherGuard ] },
  { path: "dietarios/teacher", component: DietariosComponent, canActivate: [IsLoggedGuard, TeacherGuard ] },
  { path: "dietarios/parent", component: DietariosPadresComponent, canActivate: [IsLoggedGuard] },
  { path: '**', redirectTo: '' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
