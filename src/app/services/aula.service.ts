import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class AulaService {

  constructor(
    private http: HttpClient,
    private userService: UserService,
    public router: Router,
  ) {
  }

  getAlumnos(id) {
    const url = `${environment.API_SERVER}/aula/alumnos/${id}`;
    const extra = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
        'Authorization': 'Bearer ' + this.userService.getToken()
      })
    }
    return this.http.get(url, extra);

  }
  /**
   *
   * @param id Recupera los datos de un aula
   * @returns
   */
  getAula(id) {
    const url = `${environment.API_SERVER}/aula/${id}`;
    const extra = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
        'Authorization': 'Bearer ' + this.userService.getToken()
      })
    }
    return this.http.get(url, extra);
  }

  getAgeRange() {
    const url = `${environment.API_SERVER}/auxiliar/ageRange`;
    const extra = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
        'Authorization': 'Bearer ' + this.userService.getToken()
      })
    }
    return this.http.get(url, extra);
  }

  getGenders() {
    const url = `${environment.API_SERVER}/auxiliar/genders`;
    const extra = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
        'Authorization': 'Bearer ' + this.userService.getToken()
      })
    }
    return this.http.get(url, extra);
  }
  /**
   * Envia los datos de un nuevo aula
   * @param data Datos del aula
   */
  add(data) {
    const url = `${environment.API_SERVER}/aula`;
    const extra = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
        'Authorization': 'Bearer ' + this.userService.getToken()
      })
    }
    return this.http.post(url, data, extra);
  }
  /**
   * Envia los datos para modificar un aula
   * @param data Datos del aula
   */
  edit(id, data) {
    const url = `${environment.API_SERVER}/aula/${id}`;
    const extra = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
        'Authorization': 'Bearer ' + this.userService.getToken()
      })
    }
    return this.http.put(url, data, extra);
  }
  delete(id) {
    const url = `${environment.API_SERVER}/aula/${id}`;
    const extra = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
        'Authorization': 'Bearer ' + this.userService.getToken()
      })
    }
    return this.http.delete(url, extra);

  }
  setDefault(id) {
    const url = `${environment.API_SERVER}/aula/default/${id}`;
    const extra = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
        'Authorization': 'Bearer ' + this.userService.getToken()
      })
    }
    return this.http.put(url, {}, extra);
  }

  addAlumno(idAula, idAlumno) {
    const url = `${environment.API_SERVER}/aula/${idAula}/alumno/${idAlumno}`;
    const extra = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
        'Authorization': 'Bearer ' + this.userService.getToken()
      })
    }
    return this.http.post(url, {}, extra);
  }
  removeAlumno(idAula, idAlumno) {
    const url = `${environment.API_SERVER}/aula/${idAula}/alumno/${idAlumno}`;
    const extra = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
        'Authorization': 'Bearer ' + this.userService.getToken()
      })
    }
    return this.http.delete(url, extra);
  }
  setFalta(idDiario, idAlumno, datos) {
    const url = `${environment.API_SERVER}/alumno/falta`;
    datos.diario = idDiario;
    datos.alumno = idAlumno;
    const extra = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
        'Authorization': 'Bearer ' + this.userService.getToken()
      })
    }
    return this.http.post(url, datos, extra);
  }
  getFaltas(idAula, fecha) {
    const url = `${environment.API_SERVER}/aula/${idAula}/faltas/${fecha}`;
    const extra = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
        'Authorization': 'Bearer ' + this.userService.getToken()
      })
    }
    return this.http.get(url, extra);
  }

  getDiario(idAula, fecha) {
    const url = `${environment.API_SERVER}/aula/${idAula}/diario/${fecha}`;
    const extra = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
        'Authorization': 'Bearer ' + this.userService.getToken()
      })
    }
    return this.http.get(url, extra);
  }
  setDiario(idAula, fecha, data) {
    const url = `${environment.API_SERVER}/aula/${idAula}/diario/${fecha}`;
    const extra = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
        'Authorization': 'Bearer ' + this.userService.getToken()
      })
    }
    return this.http.post(url, data, extra);

  }

  getDiarioAlumno(idDiario, idAlumno) {
    const url = `${environment.API_SERVER}/alumno/${idAlumno}/diario/${idDiario}`;
    const extra = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
        'Authorization': 'Bearer ' + this.userService.getToken()
      })
    }
    return this.http.get(url, extra);

  }
  setDiarioAlumno(idDiario, idAlumno, datos) {
    const url = `${environment.API_SERVER}/alumno/${idAlumno}/diario/${idDiario}`;
    const extra = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
        'Authorization': 'Bearer ' + this.userService.getToken()
      })
    }
    return this.http.post(url, datos, extra);

  }

  getDietario(idAula,fecha){
    const url = `${environment.API_SERVER}/aula/${idAula}/dietario/${fecha}`;
    const extra = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
        'Authorization': 'Bearer ' + this.userService.getToken()
      })
    }
    return this.http.get(url, extra);

  }

}
