import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AulaService } from 'src/app/services/aula.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-aulas',
  templateUrl: './aulas.component.html',
  styleUrls: ['./aulas.component.scss']
})
export class AulasComponent implements OnInit {
  aulas: any = [];
  isLoading: boolean = false;
  selected: number = 0;
  toast: any;

  constructor(
    private route: Router,
    public userService: UserService,
    public aulaService: AulaService,
  ) {

  }

  ngOnInit(): void {
    this.loadAulas();
  }
  loadAulas() {
    this.userService.getAulas().subscribe(
      (response: any) => {
        this.aulas = response;
      }, (error: any) => {
        if(error.status==403) this.userService.exit();
        else this.toast = {
          text:'Error al recuperarlas aulas',
          type:'error'
        }
      }
    )
  }

  default(id) {
    this.aulaService.setDefault(id).subscribe(
      response => {
        let aula = this.aulas.find(x => x.default == 1);
        aula.default = 0;
        let index = this.aulas.findIndex(x => x.id == id);
        this.aulas[index].default = 1;
        this.ordenarAulas();
        this.toast = {
          text:'Se ha cambiado el aula activa',
          type:'success'
        }
      }, (error: any) => {
        if(error.status==403) this.userService.exit();
        else this.toast = {
          text:'Error al cambiar el aula activa',
          type:'error'
        }
      }
    )
  }
  eliminar() {
    if (this.selected > 0) {
      const id = this.selected;
      this.aulaService.delete(id).subscribe(
        response => {
          let index = this.aulas.findIndex(x => x.id == id);
          this.aulas.splice(index, 1);
          this.ordenarAulas();
          this.seleccionar();
          this.toast = {
            text:'Se ha eliminado el aula',
            type:'success'
          }
        }, (error: any) => {
          if(error.status==403) this.userService.exit();
          else this.toast = {
            text:'Error al eliminar el aula',
            type:'error'
          }
        }
      )
    }
  }
  seleccionar(id = null) {
    if (id) this.selected = id;
    else this.selected = 0;
  }
  ordenarAulas() {
    this.aulas.sort((a, b) => {
      if (a.default == 1) return -1
      else if (a.year > b.year) return 1;
      else return 0;
    })
  }
}
