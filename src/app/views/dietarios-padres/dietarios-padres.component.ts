import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { AlumnosService } from 'src/app/services/alumnos.service';
import { AulaService } from 'src/app/services/aula.service';
import { DietarioService } from 'src/app/services/dietario.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-dietarios-padres',
  templateUrl: './dietarios-padres.component.html',
  styleUrls: ['./dietarios-padres.component.scss']
})
export class DietariosPadresComponent implements OnInit {
  toast: any;
  alumnos:any=[];
  aulas:any=[];
  alergenos:any=[];
  aulaSelected:number=0;
  alumno:any;
  fecha:any;

  dietario: any = [];
  dietarioView:any=[];

  constructor(
    private userService: UserService,
    private alumnoService: AlumnosService,
    private aulaService: AulaService,
    private dietarioService: DietarioService,
  ) { }

  ngOnInit(): void {
    this.getAlergenos();
    this.fecha = moment();
    this.cambiarDia();
    this.userService.getParentChilds().subscribe(
      (response:any)=> {
        this.alumnos=response;
        this.cargarAlumno(this.alumnos[0].id);
      },(error:any)=>{
        if(error.status==403)this.userService.exit();
        else this.toast={text:'Error al recuperar los alumnos',type:'error'}
      }
    );
  }
  fechaLocal(fecha){
    return moment(fecha).format('DD-MM-Y');
  }
  alLunes() {
    this.fecha.subtract(this.fecha.day() - 1, "days");
  }
  nombreAlergeno(id) {
    const item = this.alergenos.find(x => x.id == id);
    if(item)return item.value
    else return ''
  }
  getAlergenos() {
    if (!this.alergenos) {
      this.dietarioService.getAlergenos().subscribe(
        (response: any) => this.alergenos = response,
        (error: any) => {
          if (error.status == 403) this.userService.exit();
          else this.toast = { text: 'Error al recuperar los alergenos', type: 'error' }
        }
      )
    }
  }
  cambiarDia(dia = undefined) {
    if (dia) this.fecha = moment(dia);
    this.alLunes();
    var item = <HTMLInputElement>document.getElementById('fecha');
    item.value = this.fecha.format('Y-MM-DD');
    this.cargarDietario();

  }
  cambiarSemana(i) {
    if (i == -1) this.fecha.subtract(1, 'week');
    else if (i == 1) this.fecha.add(1, 'week');
    this.cambiarDia();
    return;
  }
  cargarAlumno(nuevoId=0){
    this.alumno = this.alumnos.find(x=>x.id==nuevoId);
    this.dietario = [];
    this.alumnoService.getAulas(this.alumno.id).subscribe(
      (response:any)=>{
        this.aulas=response;
        this.aulaSelected=this.aulas[0].id;
        this.cargarDietario();
      }, (error:any) =>{
        if(error.status==403)this.userService.exit();
        else this.toast={text:'Ha surgido un error al recuperar las aulas',type:'danger'}
      }
    );
  }
  cargarDietario() {
    this.aulaService.getDietarioSemana(this.aulaSelected, this.fecha.format('Y-MM-DD')).subscribe(
      (response: any) => {
        this.dietario = response;
        this.dietarioView = this.dietarioService.formatear(this.dietario,this.fecha);
      }, (error: any) => {
        if (error.status == 403) this.userService.exit();
        else this.toast = { text: 'Error al recuperar el dietario', type: 'error' }
      }
    )
  }

}
