import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlumnosService } from 'src/app/services/alumnos.service';
import { AulaService } from 'src/app/services/aula.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-alumno-form',
  templateUrl: './alumno-form.component.html',
  styleUrls: ['./alumno-form.component.scss']
})
export class AlumnoFormComponent implements OnInit {
  isLoading: boolean = false;
  genders: any = null;
  form: FormGroup;
  formNuevo: FormGroup;
  padres: any = null;
  emailInUse: boolean = false;
  toast:any;
  data: any = {
    "id": 0,
    "name": "",
    "lastname": "",
    "gender": 1,
    "birthday": null,
    "allergies": null,
    "intolerances": null,
    "diseases": null,
    "observations": null,
    "padres":[]
  }

  constructor(
    private formBuilder: FormBuilder,
    private location: Location,
    private userService: UserService,
    private alumnoService: AlumnosService,
    private aulaService: AulaService,
  ) {

    this.form = this.formBuilder.group({
      name: ['', [Validators.required, Validators.maxLength(255)]],
      lastname: ['', [Validators.required, Validators.maxLength(255)]],
      gender: ['', [Validators.min(0)]],
      birthday: [''],
      allergies: ['', [Validators.maxLength(255)]],
      intolerances: ['', [Validators.maxLength(255)]],
      diseases: ['', [Validators.maxLength(255)]],
      observations: ['', [Validators.maxLength(255)]],
      padres: []
    });
    this.formNuevo = this.formBuilder.group({
      name: ['', [Validators.required, Validators.maxLength(255)]],
      lastname: ['', [Validators.required, Validators.maxLength(255)]],
      email: ['', [Validators.required, Validators.email, Validators.maxLength(255)]],
      contact: ['', [Validators.maxLength(32)]],
    });

    this.aulaService.getGenders().subscribe(
      (response: any) => {
        this.genders = response;
      }, (error: any) => {
        if(error.status==403)this.userService.exit();
      }
    )
  }

  ngOnInit(): void {
    // Recupera el id del aula de la cabecera
    const hash = location.hash.substr(1);
    if (hash) {
      this.alumnoService.get(hash).subscribe(
        (response: any) => {
          this.data = response;
          this.loadData();
        }, (error: any) => {
          this.userService.exit();
        }
      )
    } else this.loadData();

  }
  loadData() {
    this.form.controls['name'].setValue(this.data.name);
    this.form.controls['lastname'].setValue(this.data.lastname);
    this.form.controls['gender'].setValue(this.data.gender);
    this.form.controls['birthday'].setValue(this.data.birthday);
    this.form.controls['allergies'].setValue(this.data.allergies);
    this.form.controls['intolerances'].setValue(this.data.intolerances);
    this.form.controls['diseases'].setValue(this.data.diseases);
    this.form.controls['observations'].setValue(this.data.observations);
  }

  guardar() {
    let data = this.form.value;

    if (this.form.valid) {
      data.padres = this.data.padres;

      if (this.data.id == 0) {
        this.alumnoService.add(data).subscribe(
          (response: any) => {
            this.data = response;
            this.toast = {
              text:'Nuevo alumno creado',
              type:'success'
            }
          }, (error: any) => {
            if(error.status == 403)this.userService.exit();
            else this.toast = {
              text:'Error al modificar los datos',
              type:'error'
            }
          }
        );
      } else {
        this.alumnoService.edit(this.data.id,data).subscribe(
          (response: any) => {
            this.data = response;
            this.toast = {
              text:'Datos del alumno modificados',
              type:'success'
            }
          }, (error: any) => {
            if(error.status == 403)this.userService.exit();
            else this.toast = {
              text:'Error al modificar los datos',
              type:'error'
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
  quitarPadre(id) {
    const index = this.data.padres.findIndex(x => x.padre.id == id);
    this.data.padres.splice(index, 1);
  }

  /** MODAL NUEVO PADRE */
  onNuevoModalShow() {
    this.formNuevo.reset();
  }
  onnuevoModalAcept() {
    this.emailInUse = false;
    let data = this.formNuevo.value;
    if (this.formNuevo.valid) {
      if(!this.data.padres.find(x=>x.padre.email == this.data.email)){
        this.userService.testEmail(data.email).subscribe(
          response => {
            data.id = new Date().getTime();
            this.data.padres.push({padre:data});
            document.getElementById('nuevoModalClose').click();
          }, (error: any) => {
            if (error.state == 403) this.userService.exit();
            else if (error.state == 405) {
              this.formNuevo.get('email').markAsDirty();
              this.emailInUse = true;
            }
          }
        )
      } else {
        this.formNuevo.get('email').markAsDirty();
        this.emailInUse = true;
      }
    }
  }

  /** MODAL LISTA DE PADRES */
  onlistaModalShow() {
    if (!this.padres) {
      this.userService.getParents().subscribe(
        (response: any) => {
          this.padres = response;
        }, (error: any) => {
          if (error.status == 403) this.userService.exit();
        }
      )
    }
  }
  onlistaModalHide() {
    document.querySelectorAll('input[name="childs"]:checked').forEach((element:HTMLInputElement) => {
      element.checked = false;
    })
  }
  onlistaModalAccept() {
    const selected = document.querySelectorAll('input[name="childs"]:checked');
    selected.forEach((element:HTMLInputElement) => {
      const id = element.value
      const parent = this.padres.find(x=>x.id==id);
      this.data.padres.push({padre:parent});
    });

  }
  onlistaModalCancel() {

  }
  listaModalData() {
    if(this.padres==null)return [];
    var lista = [];
    return this.padres.filter(x=>!this.data.padres.find(y=>y.padre.id==x.id));
  }
}
