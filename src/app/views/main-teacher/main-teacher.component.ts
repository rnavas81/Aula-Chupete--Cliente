import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AulaService } from 'src/app/services/aula.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-main-teacher',
  templateUrl: './main-teacher.component.html',
  styleUrls: ['./main-teacher.component.scss']
})
export class MainTeacherComponent implements OnInit {
  aula: any = {};
  alumnos: any = [];
  isLoading: boolean = false;


  constructor(
    private route: Router,
    public userService: UserService,
    public aulaService: AulaService,
  ) {
  }
  ngOnChanges(): void {

  }
  ngOnInit(): void {
    this.userService.getAulas().subscribe(
      (response: any) => {
        if (response.length > 0) {
          this.cargarAula(response);
        } else {
          this.route.navigate(['/aulas/nueva'])
        }

      }, error => {
        console.log(error);
      }
    )
  }

  cargarAula(aulas) {
    let cargar = -1;
    try {
      const hash = parseInt(location.hash.substr(1));
      if (hash && this.aula.id != hash) cargar = hash;
      if (!hash) cargar = 0;
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
    this.cargarAlumnos();
  }
  cargarAlumnos() {
    this.aulaService.getAlumnos(this.aula.id).subscribe(
      (response: any) => {
        this.alumnos = response;
      }, (error: any) => {
        console.log(error);

      }
    );
  }
  falta(id){
    console.log('falta',id);

  }
  diario(id){
    console.log('diario',id);

  }
  editar(id){
    console.log('editar',id);

  }
  eliminar(id){
    console.log('eliminar',id);

  }

}
