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

  getAlumnos(id){
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

}
