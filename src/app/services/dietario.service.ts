import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as moment from 'moment';
import { environment } from 'src/environments/environment';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class DietarioService {

  constructor(
    private http: HttpClient,
    private userService: UserService,
  ) { }

  getAlergenos(){
    const url = `${environment.API_SERVER}/auxiliar/allergens`;
    const extra = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
        'Authorization': 'Bearer ' + this.userService.getToken()
      })
    }
    return this.http.get(url, extra);
  }
  putComida(idAula,data){
    const url = `${environment.API_SERVER}/aula/${idAula}/dietario/comida`;
    const extra = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
        'Authorization': 'Bearer ' + this.userService.getToken()
      })
    }
    return this.http.post(url, data, extra);
  }
  asignarMenu(idAula,idMenu,fecha){
    const data = {
      idMenu:idMenu,
      date:fecha
    }
    const url = `${environment.API_SERVER}/aula/${idAula}/dietario/menu`;
    const extra = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
        'Authorization': 'Bearer ' + this.userService.getToken()
      })
    }
    return this.http.post(url, data, extra);

  }

  formatear(dietario,fecha) {
    var data = [];
    const dias = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes']
    var dia = moment(fecha.format('Y-MM-DD'));
    for (let index = 0; index < 5; index++) {
      const f = dia.format('Y-MM-DD');
      var menu;
      try {
        menu = dietario.find(x => x.date == f);
      } catch (error) {
        menu={}
      }
      data[index] = {
        dia: dias[index],
        fecha: f,
        menu: menu
      };
      dia.add(1, 'days');
    }
    return data;
  }
}
