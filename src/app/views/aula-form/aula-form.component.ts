import { Component, OnInit } from '@angular/core';
import { AulaService } from 'src/app/services/aula.service';
import { UserService } from 'src/app/services/user.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as moment from 'moment';
import { Location } from '@angular/common';

@Component({
  selector: 'app-aula-form',
  templateUrl: './aula-form.component.html',
  styleUrls: ['./aula-form.component.scss']
})
export class AulaFormComponent implements OnInit {
  aula: any = {
    id: 0,
    default: 1,
    name: '',
    year: '',
    age_year: '',
    alumnos: [],
  };
  isLoading: boolean = false;
  form: FormGroup;
  formNuevoAlumno: FormGroup;
  year2: number;
  agesRange: any = [];
  genders: any = null;
  childs: any = null;
  lista: any = [];
  toast: any;

  constructor(
    private formBuilder: FormBuilder,
    private location: Location,
    private userService: UserService,
    private aulaService: AulaService,
  ) {
    this.form = this.formBuilder.group({
      default: ['', []],
      name: ['', [Validators.required, Validators.maxLength(255)]],
      year: ['', [Validators.min(0)]],
      year2: [{ value: '', disabled: true },],
      age_range: ['', []],
      alumnos: [''],
    });
    this.formNuevoAlumno = this.formBuilder.group({
      name: ['', [Validators.required, Validators.maxLength(255)]],
      lastname: ['', [Validators.required, Validators.maxLength(255)]],
      gender: [0, [Validators.required]],
      birthday: [''],
    })
    aulaService.getAgeRange().subscribe(
      (response: any) => {
        this.agesRange = response;
      }, (error: any) => {
        if(error.status==403)this.userService.exit();
      }
    )
  }

  ngOnInit(): void {
    // Recupera el id del aula de la cabecera
    const hash = location.hash.substr(1);
    if (hash) {
      this.aulaService.getAula(hash).subscribe(
        (response: any) => {
          this.aula = response;
          this.loadData();
        }, (error: any) => {
          if(error.status==403)this.userService.exit();
        }
      )
    } else this.loadData();

  }
  changeYear(value) {
    this.form.controls['year2'].setValue(value > 0 ? parseInt(value) + 1 : '');
  }
  loadData() {
    this.form.controls['default'].setValue(this.aula.default);
    this.form.controls['name'].setValue(this.aula.name);
    this.form.controls['year'].setValue(this.aula.year);
    this.form.controls['age_range'].setValue(this.aula.age_range);
    this.lista = this.aula.alumnos;
    this.changeYear(this.aula.year);

  }
  onNuevoModalShow() {
    if (this.genders == null) {
      this.aulaService.getGenders().subscribe(
        (response: any) => {
          this.genders = response;
        }, (error: any) => {
          if(error.status==403)this.userService.exit();
        }
      )
    }
  }
  agregarNuevoAlumno() {
    if (this.formNuevoAlumno.valid) {
      const nuevo = {
        "id": new Date().getTime(),
        "name": this.formNuevoAlumno.controls['name'].value,
        "lastname": this.formNuevoAlumno.controls['lastname'].value,
        "gender": this.formNuevoAlumno.controls['gender'].value,
        "birthday": this.formNuevoAlumno.controls['birthday'].value,
        "allergies": null,
        "intolerances": null,
        "diseases": null,
        "observations": null
      }
      this.agregarAlumno(nuevo);
      this.cancelarAgregarNuevoAlumno();
    } else if (!this.formNuevoAlumno.dirty || !this.formNuevoAlumno.touched) {
      this.formNuevoAlumno.get('name').markAsDirty();
    }
  }
  cancelarAgregarNuevoAlumno() {
    this.formNuevoAlumno.reset();
    document.getElementById('nuevo-alumno-modal-close').click();
  }
  onlistaModalShow() {
    if (this.childs == null) {
      this.userService.getChilds().subscribe(
        (response: any) => {
          this.childs = response;
        }, (error: any) => {
          if(error.status==403)this.userService.exit();
        }
      )

    }
  }
  /**
   * Recoge los datos del aula y envía los datos para crear o modificar un aula
   */
  guardar() {
    let data = this.form.value;

    if (this.form.valid) {
      data.alumnos = this.lista;
      if (this.aula.id == 0) {
        this.aulaService.add(data).subscribe(
          (response: any) => {
            this.aula = response;
            this.toast = {
              text: 'Nueva aula creada'
            }
          }, (error: any) => {
            if (error.state == 403) this.userService.exit();
            else this.toast = {
              text: 'Error al guardar los datos',
              type: 'error'
            }
          }
        );
      } else {
        this.aulaService.edit(this.aula.id, data).subscribe(
          (response: any) => {
            this.aula = response;
            this.toast = {
              text: 'Aula modificada',
              type:'success'
            }
          }, (error: any) => {
            if (error.state == 403) this.userService.exit();
            else this.toast = {
              text: 'Error al guardar los datos',
              type: 'error'
            }
          }
        );
      }
    } else if (!this.form.dirty || !this.form.touched) {
      this.form.get('name').markAsDirty();
    }
  }
  cancelar() {
    this.loadData();
    this.location.back();
  }
  agregarAlumnoExistente() {
    const alumnos = document.querySelectorAll('input[name="childs"]:checked');
    alumnos.forEach((alumno: HTMLInputElement) => {
      this.agregarAlumno(this.childs.find(x => x.id == alumno.value));
    });
    this.cancelarAgregarAlumnoExistente();
  }
  cancelarAgregarAlumnoExistente() {
    this.formNuevoAlumno.reset();
    document.getElementById('alumnos-list-modal-close').click();
  }
  eliminarAlumno() {
    const ids = this.form.controls['alumnos'].value;
    if (ids) {
      ids.forEach(id => {
        this.lista.splice(this.lista.findIndex(x => x.id == id), 1);
      });
      this.form.controls['alumnos'].setValue('');
    }
  }
  agregarAlumno(alumno) {
    if (!this.lista.find(x => x.id == alumno.id)) {
      this.lista.push(alumno);
    }
  }
}
