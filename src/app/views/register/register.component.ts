import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { finalize } from 'rxjs/operators';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  formulario: FormGroup;
  mensaje: string = '';
  cargando: boolean = false;
  passConfirm: boolean = true;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    public userService: UserService,
  ) {
    this.formulario = this.formBuilder.group({
      name: ['', [Validators.maxLength(255)]],
      lastname: ['', [Validators.maxLength(510)]],
      email: ['', [Validators.required, Validators.email, Validators.maxLength(255)]],
      password: ['', [Validators.required, Validators.maxLength(32)]],
      password2: ['', [Validators.required, Validators.maxLength(32)]],
    });
    this.mensaje = '';
    this.cargando = false;
  }

  ngOnInit(): void {
  }
  onSubmit() {
    this.mensaje = "";
    this.passConfirm = this.confirmarPassword(this.formulario);
    const data = this.formulario.value;

    if (this.formulario.valid && this.passConfirm) {
      this.cargando = true;
      document.getElementById('btn-submit').classList.add('disabled');
      delete (data.password2);
      this.userService.register(data)
        .pipe(
          finalize(() => {
            document.getElementById('btn-submit').classList.remove('disabled');
            this.cargando = false;
          })
        )
        .subscribe(
          (response: any) => {
            this.router.navigate(['/login'], { fragment: 'registered' });
          }, (error: any) => {
            switch (error.status) {
              case 403: this.mensaje = "Error en los datos"; break;
              case 404: this.mensaje = "Problemas para acceder a la aplicación"; break;
              default: this.mensaje = "Problema no registrado"; break;
            }
          }
        );
    }
  }

  confirmarPassword(fg: FormGroup) {
    const p1 = fg.controls['password'].value.trim();
    const p2 = fg.controls['password2'].value.trim();
    return p1.length > 0 && p2.length > 0 && p1 === p2;
  }
}
