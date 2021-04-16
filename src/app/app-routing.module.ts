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

const routes: Routes = [
  { path: "", component: LoginComponent, canActivate: [TestLoginGuard] },
  { path: "login", component: LoginComponent, canActivate: [TestLoginGuard] },
  { path: "register", component: RegisterComponent },
  { path: "forget", component: ForgetComponent },
  { path: "main", component: MainComponent, canActivate: [IsLoggedGuard] },
  { path: "main/parent", component: MainParentComponent, canActivate: [IsLoggedGuard] },
  { path: "main/teacher", component: MainTeacherComponent, canActivate: [IsLoggedGuard, TeacherGuard] },
  { path: '**', redirectTo: '' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
