import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.scss']
})
export class PerfilComponent implements OnInit {
  toast: any;
  form: FormGroup;
  validPasswords: boolean = true;
  validEmail: boolean = true;

  constructor(
    private formBuilder: FormBuilder,
    private location: Location,
    private userService: UserService,
  ) {
    const user = this.userService.getUser();
    this.form = this.formBuilder.group({
      name: [user.name, [Validators.required, Validators.maxLength(255)]],
      lastname: [user.lastname, [Validators.required, Validators.maxLength(255)]],
      email: [user.email, [Validators.required, Validators.email, Validators.maxLength(255)]],
      contact: [user.contact, [Validators.maxLength(32)]],
      password: ['', [Validators.maxLength(32), Validators.minLength(8)]],
      password2: ['', [Validators.maxLength(32), Validators.minLength(8)]],
    });

  }

  ngOnInit(): void {
  }

  guardar() {
    const data = this.form.value;
    this.validPasswords = data.password == data.password2;
    this.validEmail = true;
    if (this.form.valid && this.validPasswords) {
      if (data.password.trim().length == 0) {
        delete (data.password);
      }
      delete (data.password2);
      this.userService.save(data).subscribe(
        (response: any) => {
          this.toast = { text: 'Cambios guardados', type: 'success' }
          this.userService.set(data);
        }, (error: any) => {
          if (error.status == 403) this.userService.exit();
          else if (error.status == 422) {
            console.log(error);

            if (error.error.errors.hasOwnProperty('email')) {
              console.error('email en uso');
              this.validEmail=false;
            }
          }
          else this.toast = { text: 'Error al guardar los cambios', type: 'error' }
        }
      )
    }
  }
  cancelar() {
    this.form.reset();
    this.location.back();
  }
}
