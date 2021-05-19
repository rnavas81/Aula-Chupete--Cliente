import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { AlumnosService } from 'src/app/services/alumnos.service';
import { AulaService } from 'src/app/services/aula.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-main-parent',
  templateUrl: './main-parent.component.html',
  styleUrls: ['./main-parent.component.scss']
})
export class MainParentComponent implements OnInit {
  toast: any;
  alumnos:any=[];
  aulas:any=[];
  aulaSelected:number=0;

  alumno:any;
  fecha:any;
  diario:any;
  dietary:string="";
  isLoading:boolean=false;

  constructor(
    private userService: UserService,
    private alumnoService: AlumnosService,
    private aulaService: AulaService,
  ) {

   }

  ngOnInit(): void {
    const hash = parseInt(location.hash.substr(1));
    var hoy = moment();
    if(hoy.day()==0)hoy.subtract(2,'days');
    else if(hoy.day()==6)hoy.subtract(1,'days');
    this.fecha = hoy.format('Y-MM-DD');
    this.userService.getParentChilds().subscribe(
      (response:any)=> {
        this.alumnos=response;
        this.cargarAlumno(this.alumnos[0].id);
      },(error:any)=>{
        if(error.status==403)this.userService.exit();
        else this.toast={text:'Error al recuperar los alumnos',type:'error'}
      }
    )
  }
  cargarAlumno(nuevoId=0){
    this.alumno = this.alumnos.find(x=>x.id==nuevoId);
    this.diario = undefined;
    this.alumnoService.getAulas(this.alumno.id).subscribe(
      (response:any)=>{
        this.aulas=response;
        this.aulaSelected=this.aulas[0].id;
        this.cambiarFecha(this.fecha);
      }, (error:any) =>{
        if(error.status==403)this.userService.exit();
        else this.toast={text:'Ha surgido un error al recuperar las aulas',type:'danger'}
      }
    );
  }
  cambiarAula(nuevaAula){
    if(this.aulas.find(x=>x.id==nuevaAula)){
      this.aulaSelected = nuevaAula;
      this.cargarDiario();
    }
  }

  cambiarFecha(nueva){
    var dia = moment(nueva).day();
    if(dia!=0 && dia!=6){
      this.fecha = moment(nueva).format('Y-MM-DD');
      this.cargarDiario();
      this.cargarDietario();
    } else {
      var texto = moment(nueva)>moment() ? 'será' : 'era';
      this.toast={text:`Ese dia ${texto} fin de semana`,type:'warning'}
      var item = <HTMLInputElement>document.getElementById('fecha');
      item.value=this.fecha;
    }


  }

  cargarDiario(){
    this.alumnoService.getDiario(this.alumno.id,this.aulaSelected,this.fecha).subscribe(
      (response:any)=>{
        this.diario = response;
      }, (error:any)=>{
        if(error.status==403)this.userService.exit();
        else this.toast={text:'Error al recuperar el diario',type:'error'}
      }
    )
  }
  cargarDietario(){
    this.aulaService.getDietario(this.aulaSelected,this.fecha).subscribe(
      (response:any)=>{
        // TODO:IMPOLEMENTAR MOSTRAR EL DIETARIO
        // this.diario = response;
        console.log(response);
      }, (error:any)=>{
        if(error.status==403)this.userService.exit();
        else this.toast={text:'Error al recuperar el dietario',type:'error'}
      }
    );
  }
  hayDiario() {
    return !!this.diario && this.diario.hasOwnProperty('entrada');
  }

  /** MODAL LISTA ALUMNOS */
  onlistaAlumnosShow(){

  }
  onlistaAlumnosHide(){

  }
  listaAlumnosAccept(){

  }
}
