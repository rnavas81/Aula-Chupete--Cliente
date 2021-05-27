import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class MenusService {

  constructor(
    private http: HttpClient,
    private userService: UserService,
  ) { }

  get(id=null) {
    const url = `${environment.API_SERVER}/menu${id!==null?'/'+id:''}`;
    const extra = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
        'Authorization': 'Bearer ' + this.userService.getToken()
      })
    }
    return this.http.get(url, extra);
  }
  getDias(idMenu) {
    const url = `${environment.API_SERVER}/menu/${idMenu}/dias`;
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
    const url = `${environment.API_SERVER}/menu`;
    const extra = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
        'Authorization': 'Bearer ' + this.userService.getToken()
      })
    }
    return this.http.post(url, data, extra);
  }

  set(data) {
    const url = `${environment.API_SERVER}/menu/${data.id}`;
    const extra = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
        'Authorization': 'Bearer ' + this.userService.getToken()
      })
    }
    return this.http.put(url, data, extra);
  }
}
