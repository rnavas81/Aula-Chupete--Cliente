import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class AlumnosService {

  constructor(
    private http: HttpClient,
    private userService: UserService,
    public router: Router,
  ) {

  }

  get(id=null){
    const url = `${environment.API_SERVER}/alumno${id!=null?`/${id}`:''}`;
    const extra = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
        'Authorization': 'Bearer ' + this.userService.getToken()
      })
    }
    return this.http.get(url, extra);
  }

  add(data) {
    const url = `${environment.API_SERVER}/alumno`;
    const extra = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
        'Authorization': 'Bearer ' + this.userService.getToken()
      })
    }
    return this.http.post(url, data, extra);
  }
  edit(idAlumno, data) {
    const url = `${environment.API_SERVER}/alumno/${idAlumno}`;
    const extra = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
        'Authorization': 'Bearer ' + this.userService.getToken()
      })
    }
    return this.http.put(url, data, extra);

  }
  delete(idAlumno) {
    const url = `${environment.API_SERVER}/alumno/${idAlumno}`;
    const extra = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
        'Authorization': 'Bearer ' + this.userService.getToken()
      })
    }
    return this.http.delete(url, extra);
  }
}
