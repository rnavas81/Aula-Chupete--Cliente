import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { AlumnosService } from 'src/app/services/alumnos.service';
import { AulaService } from 'src/app/services/aula.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-main-teacher',
  templateUrl: './main-teacher.component.html',
  styleUrls: ['./main-teacher.component.scss']
})
export class MainTeacherComponent implements OnInit {
  isLoading: boolean = false;
  aula: any = {};
  alumnos: any = [];
  selected: number = 0;
  date: any;
  genders: any = null;
  formAlumnoDatos: FormGroup;
  formDiarioAlumno: FormGroup;
  faltas: any = [];
  diarios: any = {};
  idDiario: number;
  title: string = "";
  content: string = "";
  padres: any = [];
  alumnosLista: any = null;
  toast: any;

  constructor(
    private formBuilder: FormBuilder,
    private route: Router,
    public userService: UserService,
    public aulaService: AulaService,
    public alumnoService: AlumnosService
  ) {
    this.formAlumnoDatos = this.formBuilder.group({
      name: ['', [Validators.required, Validators.maxLength(255)]],
      lastname: ['', [Validators.required, Validators.maxLength(255)]],
      gender: [0, [Validators.required]],
      birthday: [''],
      allergies: ['', [Validators.maxLength(255)]],
      intolerances: ['', [Validators.maxLength(255)]],
      diseases: ['', [Validators.maxLength(255)]],
      observations: ['', [Validators.maxLength(255)]],
    })
    this.formDiarioAlumno = this.formBuilder.group({
      activity: ['', [Validators.maxLength(1000)]],
      food: ['', [Validators.maxLength(1000)]],
      behaviour: ['', [Validators.maxLength(1000)]],
      sphincters: ['', [Validators.maxLength(1000)]],
      absence: [0],
    })
  }
  ngOnInit(): void {
    this.date = moment();

    this.userService.getAulas().subscribe(
      (response: any) => {
        if (response.length > 0) {
          this.cargarAula(response);
        } else {
          this.route.navigate(['/aulas/formulario'])
        }

      }, (error: any) => {
        if (error.state == 403) this.userService.exit();
      }
    )
  }

  cargarAula(aulas) {
    let cargar = -1;
    try {
      const hash = parseInt(location.hash.substr(1));
      if (hash) cargar = hash;
      else cargar = 0;
    } catch (error) {
      cargar = 0;
    }
    if (cargar > -1) {
      aulas.forEach(aula => {
        if (cargar == 0 && aula.default == 1) {
          this.aula = aula;
        } else if (cargar > 0 && cargar == aula.id) {
          this.aula = aula;
        }
      });
    }
    if (!this.aula.hasOwnProperty('id')) this.route.navigate(['/']);
    this.cargarAlumnos();
    this.cargarDiario();
  }
  cargarAlumnos() {
    this.aulaService.getAlumnos(this.aula.id).subscribe(
      (response: any) => {
        this.alumnos = response;
      }, (error: any) => {
        if(error.status==403)this.userService.exit();
        else this.toast={text:'Error al recuperar los alumnos',type:'error'}
      }
    );
  }
  alumnosOrdenados() {
    if (this.alumnos == null) return [];
    return this.alumnos.sort((a, b) => {
      if (a.lastname < b.lastname) return -1;
      else if (a.lastname > b.lastname) return 1;
      else if (a.name < b.name) return -1;
      else if (a.name > b.name) return 1;
      return 0;
    });
  }
  cargarDiario() {
    this.aulaService.getDiario(this.aula.id, this.date.format('Y-MM-DD')).subscribe(
      (response: any) => {
        this.title = response.title;
        this.content = response.content;
        this.faltas = [];
        this.idDiario = response.id;
        if(response.entradas){
          response.entradas.forEach(entrada => {
            if (entrada.absence == 1) this.faltas.push(entrada.idAlumno);
          });
          this.diarios = response.entradas;
        } else this.diarios = [];

      }, (error: any) => {
        if (error.status == 403) this.userService.exit();
      }
    )
  }
  onchangeDiario(text = ' ', type = 'title') {
    var data = {};
    data[type] = text;
    this.aulaService.setDiario(this.aula.id, this.date.format('Y-MM-DD'), data).subscribe(
      (response: any) => {
        this.idDiario = response.id;
      }, (error: any) => {
        if (error.status == 403) this.userService.exit();
      }
    )

  }

  falta(id) {
    const falta = this.faltas.includes(id) ? 0 : 1;
    if (!this.idDiario) {
      this.aulaService.setDiario(this.aula.id, this.date.format('Y-MM-DD'), { title: '' }).subscribe(
        (response: any) => {
          this.idDiario = response.id;
          this.enviarFalta(id, falta);
        }, (error: any) => {
          if (error.status == 403) this.userService.exit();
        }
      )
    } else this.enviarFalta(id, falta);

  }
  enviarFalta(id, falta) {
    this.aulaService.setFalta(this.idDiario, id, { absence: falta }).subscribe(
      (response: any) => {
        if (response.absence == 0) this.faltas.splice(this.faltas.indexOf(id), 1);
        else this.faltas.push(id);
      }, (error: any) => {
        if (error.status == 403) this.userService.exit();
      }
    )

  }
  diario(id) {
    this.selected = id;

  }
  changeDate(value) {
    this.date = moment(value);
    this.cargarDiario();
    this.diarios = {};
  }
  ordernarAlumnos() {
    this.alumnos.sort((a, b) => {
      if (a.lastname < b.lastname) return -1;
      else if (a.lastname == b.lastname && a.name < b.name) return -1;
      else if (a.lastname == b.lastname && a.name == b.name) return 0;
      else return 1;
    })
  }
  seleccionar(id = 0) {
    this.selected = id;
  }
  /** MODAL CONFIRMAR ELIMINAR ALUMNO */
  eliminar() {
    const id = this.selected;
    this.alumnoService.delete(id).subscribe(
      (response: any) => {
        const index = this.alumnos.findIndex(x => x.id == id);
        this.alumnos.splice(index, 1);
      }
    );
  }
  quitar() {
    const id = this.selected;
    this.aulaService.removeAlumno(this.aula.id, id).subscribe(
      (response: any) => {
        const index = this.alumnos.findIndex(x => x.id == id);
        this.alumnos.splice(index, 1);
      }
    );
  }

  /** MODAL DATOS ALUMNO */

  ondatosAlumnoShow() {
    if (this.genders == null) {
      this.aulaService.getGenders().subscribe(
        (response: any) => {
          this.genders = response;
        }, (error: any) => {
          if(error.status==403)this.userService.exit();
        }
      )
    }
    if (this.selected > 0) {
      const data = this.alumnos.find(x => x.id == this.selected);
      this.formAlumnoDatos.controls['name'].setValue(data.name);
      this.formAlumnoDatos.controls['lastname'].setValue(data.lastname);
      this.formAlumnoDatos.controls['gender'].setValue(data.gender);
      this.formAlumnoDatos.controls['birthday'].setValue(data.birthday);
      this.formAlumnoDatos.controls['allergies'].setValue(data.allergies);
      this.formAlumnoDatos.controls['intolerances'].setValue(data.intolerances);
      this.formAlumnoDatos.controls['diseases'].setValue(data.diseases);
      this.formAlumnoDatos.controls['observations'].setValue(data.observations);
      this.padres = data.padres;
    } else {
      this.formAlumnoDatos.reset();
      this.padres = [];
    }
  }
  ondatosAlumnoHide() {
    this.selected = 0;
    this.formAlumnoDatos.controls['name'].setValue('');
    this.formAlumnoDatos.controls['lastname'].setValue('');
    this.formAlumnoDatos.controls['gender'].setValue(0);
    this.formAlumnoDatos.controls['birthday'].setValue('');
    this.formAlumnoDatos.controls['allergies'].setValue('');
    this.formAlumnoDatos.controls['intolerances'].setValue('');
    this.formAlumnoDatos.controls['diseases'].setValue('');
    this.formAlumnoDatos.controls['observations'].setValue('');
  }
  cambiosModalAlumno() {
    if (this.formAlumnoDatos.valid) {
      const data = this.formAlumnoDatos.value;
      if (this.selected !== 0) {
        this.alumnoService.edit(this.selected, data).subscribe(
          (response: any) => {
            this.alumnos[this.alumnos.findIndex(x => x.id == this.selected)] = response;
            document.getElementById('nuevo-alumno-modal-close').click();
            this.ordernarAlumnos();
          }, (error: any) => {
            if (error.status == 403) this.userService.exit();
          }
        )
      } else {
        data.idAula = this.aula.id;
        this.alumnoService.add(data).subscribe(
          (response: any) => {
            document.getElementById('nuevo-alumno-modal-close').click();
            this.alumnos.push(response);
            this.ordernarAlumnos();
          }, (error: any) => {
            if (error.status == 403) this.userService.exit();
          }
        )
      }
    } else if (!this.formAlumnoDatos.dirty || !this.formAlumnoDatos.touched) {
      this.formAlumnoDatos.get('name').markAsDirty();
    }
  }


  /** MODAL DIARIO ALUMNO*/

  ondiarioModalShow() {
    const diario = this.diarios.find(x => x.idAlumno == this.selected);
    if (diario) {
      this.formDiarioAlumno.controls['activity'].setValue(diario.activity);
      this.formDiarioAlumno.controls['food'].setValue(diario.food);
      this.formDiarioAlumno.controls['behaviour'].setValue(diario.behaviour);
      this.formDiarioAlumno.controls['sphincters'].setValue(diario.sphincters);
    }
  }
  ondiarioModalHide() {
    this.selected = 0;
    this.formDiarioAlumno.reset();
  }
  cambiosDiarioAlumno() {
    if (!this.idDiario) {
      this.aulaService.setDiario(this.aula.id, this.date.format('Y-MM-DD'), { title: '' }).subscribe(
        (response: any) => {
          this.idDiario = response.id;
          this.guardarDiarioAlumno();
        }, (error: any) => {
          if (error.status == 403) this.userService.exit();
        }
      )
    } else this.guardarDiarioAlumno();
  }
  guardarDiarioAlumno() {
    const data = this.formDiarioAlumno.value;
    if (this.formDiarioAlumno.valid) {
      this.aulaService.setDiarioAlumno(this.idDiario, this.selected, data).subscribe(
        (response: any) => {
          const index = this.diarios.findIndex(x => x.idAlumno == response.idAlumno);
          this.diarios[index] = response;
        }, (error: any) => {
          if (error.state == 403) this.userService.exit();
        }
      )
    }
  }

  /** MODAL LISTA DE ALUMNOS */
  onlistaAlumnosShow() {
    if (this.alumnosLista == null) {
      this.userService.getChilds().subscribe(
        (response: any) => {
          this.alumnosLista = response;
        }, (error: any) => {
          if (error.status == 403) this.userService.exit();
        }
      )
    }
  }
  comprobarListaAlumnos() {
    if (this.alumnosLista == null) return [];
    var lista = [];
    return this.alumnosLista.filter(alumno => !this.alumnos.find(x => x.id == alumno.id));
  }
  onlistaAlumnosHide() {

  }
  listaAlumnosAccept() {
    const selected = document.querySelectorAll('input[name="childs"]:checked');
    selected.forEach((element: HTMLInputElement) => {
      const id = element.value;
      if (!this.alumnos.find(x => x.id == id)) {
        this.aulaService.addAlumno(this.aula.id, id).subscribe(
          response => {
            const alumno = this.alumnosLista.find(x => x.id == id);
            this.alumnos.push(alumno);
            this.toast = { text: 'Alumno agregado', type: 'success' }
          }, (error: any) => {
            if (error.status == 403) this.userService.exit();
            else this.toast = { text: 'Error al agregar el alumno', type: 'error' }
          }
        )
      }
    });
  }
  fechaLocal(fecha) {
    return moment(fecha).format('DD-MM-Y');
  }

}
