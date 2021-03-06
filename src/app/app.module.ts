/************* COMPONENTES INTERNOS *************/
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MDBBootstrapModule } from 'angular-bootstrap-md';

/************* COMPONENTES EXTERNOS *************/
import { AppComponent } from './app.component';
import { LoginComponent } from './views/login/login.component';
import { RegisterComponent } from './views/register/register.component';
import { ForgetComponent } from './views/forget/forget.component';
import { MainComponent } from './views/main/main.component';
import { MainTeacherComponent } from './views/main-teacher/main-teacher.component';
import { MainParentComponent } from './views/main-parent/main-parent.component';
import { HeaderComponent } from './components/header/header.component';
import { AulaFormComponent } from './views/aula-form/aula-form.component';
import { AulasComponent } from './views/aulas/aulas.component';
import { AlumnosComponent } from './views/alumnos/alumnos.component';
import { AlumnoFormComponent } from './views/alumno-form/alumno-form.component';
import { ToastComponent } from './components/toast/toast.component';
import { PerfilComponent } from './views/perfil/perfil.component';
import { MenusComponent } from './views/menus/menus.component';
import { DietariosComponent } from './views/dietarios/dietarios.component';
import { DietariosPadresComponent } from './views/dietarios-padres/dietarios-padres.component';
import { MenusFormularioComponent } from './views/menus-formulario/menus-formulario.component';
import { HomeComponent } from './views/home/home.component';
import { ContactComponent } from './views/contact/contact.component';
import { AlumnosListComponent } from './views/alumnos-list/alumnos-list.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    ForgetComponent,
    MainComponent,
    MainTeacherComponent,
    MainParentComponent,
    HeaderComponent,
    AulaFormComponent,
    AulasComponent,
    AlumnosComponent,
    AlumnoFormComponent,
    ToastComponent,
    PerfilComponent,
    MenusComponent,
    DietariosComponent,
    DietariosPadresComponent,
    MenusFormularioComponent,
    HomeComponent,
    ContactComponent,
    AlumnosListComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MDBBootstrapModule.forRoot(),
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
