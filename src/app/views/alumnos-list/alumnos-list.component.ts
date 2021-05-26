import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import * as moment from 'moment';
import { AlumnosService } from 'src/app/services/alumnos.service';
import { AulaService } from 'src/app/services/aula.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-alumnos-list',
  templateUrl: './alumnos-list.component.html',
  styleUrls: ['./alumnos-list.component.scss']
})
export class AlumnosListComponent implements OnInit {
  toast: any;
  alumnos: any = [];
  genders: any = [];
  form: FormGroup;
  data: any = {};
  selected = 0;

  constructor(
    private formBuilder: FormBuilder,
    private alumnoService: AlumnosService,
    private userService: UserService,
    private aulaService: AulaService,
  ) {

    this.userService.getParentChilds().subscribe(
      (response: any) => {
        this.alumnos = response;
      }, (error: any) => {
        if (error.status == 403) this.userService.exit();
        else this.toast = { text: 'Error al recuperar los alumnos', type: 'error' }
      }
    );
    this.aulaService.getGenders().subscribe(
      (response: any) => {
        this.genders = response;
      }, error => {
        this.userService.exit();
      }
    )
    this.form = this.formBuilder.group({
      name: ['', { disabled: true }],
      lastname: ['', { disabled: true }],
      gender: ['', { disabled: true }],
      birthday: ['', { disabled: true }],
      allergies: ['', { disabled: true }],
      intolerances: ['', { disabled: true }],
      diseases: ['', { disabled: true }],
      observations: ['', { disabled: true }],
    });
  }

  ngOnInit(): void {
  }
  loadChild(id,target) {

    this.alumnoService.get(id).subscribe(
      (response: any) => {
        this.data = response;
        this.selected = id;
        this.loadData();
        if(target=='list'){
          var item = <HTMLInputElement>document.getElementById('select-childs');
          item.value = id;

        }
      }, error => {
        if(error.state==403)this.userService.exit();
      }
    )
  }
  formatoLocal(){
    if(this.data.birthday)return moment(this.data.birthday).format('DD-MM-Y');
    else return "";
  }
  getGender(){
    const item = this.genders.find(x=>x.id==this.data.gender)
    if(item)return item.value;
    else return "";

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

}
