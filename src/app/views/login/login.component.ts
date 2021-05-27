import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { environment } from 'src/environments/environment';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  formulario: FormGroup;
  mensaje: string;
  cargando: boolean;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    public userService: UserService,
  ) {
    var recordar = '';
    if (localStorage.getItem(environment.LOCALSTORAGE_REMEMBERME)) {
      recordar = localStorage.getItem(environment.LOCALSTORAGE_REMEMBERME);
    }
    this.formulario = this.formBuilder.group({
      email: [recordar, [Validators.required]],
      password: ['', [Validators.required]],
      recordar: [recordar]
    });
    this.mensaje = '';
    this.cargando = false;

  }

  ngOnInit(): void {
    this.route.fragment.subscribe(fragment=>{
      switch (fragment) {
        case 'registered':
          this.mensaje = 'Usuario registrado. Compruebe su correo.';
          break;
        case 'forget':
          this.mensaje = 'Contraseña cambiada. Compruebe su correo.';
          break;

        default:
          break;
      }
    });
  }

  onSubmit() {
    this.mensaje = "";
    const data = this.formulario.value;

    if (this.formulario.valid) {
      this.cargando = true;
      document.getElementById('btn-submit').classList.add('disabled');
      this.userService.login(data.email, data.password)
        .pipe(
          finalize(() => {
            this.cargando = false;
            document.getElementById('btn-submit').classList.remove('disabled');
          })
        )
        .subscribe(
          (response: any) => {
            if (response.hasOwnProperty("user")) this.userService.set(response.user);
            if (response.hasOwnProperty("token")) this.userService.setToken(response.token);
            if (data.recordar) {
              localStorage.setItem(environment.LOCALSTORAGE_REMEMBERME, data.email);
            }
            this.router.navigate(['/main']);
          }, (error: any) => {
            switch (error.status) {
              case 403: this.mensaje = "Error en el usuario o la contraseña"; break;
              case 404: this.mensaje = "Problemas para acceder a la aplicación"; break;
              default: this.mensaje = "Problema no registrado"; break;
            }
          }
        );
    }
  }
}
