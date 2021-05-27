import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlumnosService } from 'src/app/services/alumnos.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-alumnos',
  templateUrl: './alumnos.component.html',
  styleUrls: ['./alumnos.component.scss']
})
export class AlumnosComponent implements OnInit {
  alumnos: any = [];
  selected: number= 0;
  isLoading: boolean = false;
  constructor(
    private route: Router,
    public userService: UserService,
    public alumnosService: AlumnosService,
  ) {

  }

  ngOnInit(): void {
    this.loadAlumnos();
  }
  loadAlumnos() {
    this.alumnosService.get().subscribe(
      (response: any) => {
        this.alumnos = response;
      }, (error: any) => {
        if(error.status==403)this.userService.exit();
      }
    )
  }

  eliminar() {
    if(this.selected>0){
      const id = this.selected;
      this.alumnosService.delete(id).subscribe(
        response => {
          let index = this.alumnos.findIndex(x => x.id == id);
          this.alumnos.splice(index, 1);
          this.ordenarAlumnos();
          this.seleccionar();
        }, (error: any) => {
          if(error.status==403)this.userService.exit();
        }
      )
    }
  }
  seleccionar(id = null) {
    if (id) this.selected = id;
    else this.selected = 0;
  }
  ordenarAlumnos() {
    this.alumnos.sort((a, b) => {
      if (a.year < b.year) return -1
      else if (a.year > b.year) return 1;
      else return 0;
    })
  }
}
