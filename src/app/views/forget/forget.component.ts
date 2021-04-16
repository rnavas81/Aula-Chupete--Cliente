import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-forget',
  templateUrl: './forget.component.html',
  styleUrls: ['./forget.component.scss']
})
export class ForgetComponent implements OnInit {
  formulario: FormGroup;
  mensaje: string;
  cargando: boolean;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private userService: UserService,
  ) {
    this.formulario = this.formBuilder.group({
      email: ['', [Validators.required]],
    });
    this.mensaje = '';
    this.cargando = false;

  }

  ngOnInit(): void {
  }
  onSubmit(){
    this.mensaje = "";
    const data = this.formulario.value;

    if (this.formulario.valid) {
      this.cargando = true;
      document.getElementById('btn-submit').classList.add('disabled');
      this.userService.forget(data)
        .pipe(
          finalize(() => {
            document.getElementById('btn-submit').classList.remove('disabled');
            this.cargando = false;
          })
        )
        .subscribe(
          (response: any) => {
            this.router.navigate(['/login'],{ fragment: 'registered' });
          }, (error: any) => {
            switch (error.status) {
              case 403: this.mensaje = "Error en los datos"; break;
              case 404: this.mensaje = "Problemas para acceder a la aplicación"; break;
              case 460: this.mensaje = "El usuario no está activo. Se ha enviado un nuevo correo de activación"; break;
              case 461: this.mensaje = "El usuario está bloqueado"; break;
              default: this.mensaje = "Problema no registrado"; break;
            }
          }
        );
    }

  }
}
