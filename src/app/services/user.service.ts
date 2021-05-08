import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  lastname: string;
  name: string;
  email: string;
  id: number;


  constructor(
    private http: HttpClient,
    public router: Router,
  ) {
    this.setUser(this.getUser());
  }
  initial() {
    this.name = "";
    this.lastname = "";
    this.email = "";
    this.id = 0;
    sessionStorage.removeItem(environment.SESSIONSTORAGE_USER);
    sessionStorage.removeItem(environment.SESSIONSTORAGE_TOKEN);
  }

  set = (data: any) => {
    this.setUser(data);
    const user = {
      id: this.id,
      name: this.name,
      lastname: this.lastname,
      email: this.email,
    };
    sessionStorage.setItem(
      environment.SESSIONSTORAGE_USER,
      JSON.stringify(user)
    );
  };
  setUser = (data: any) => {
    if (data.hasOwnProperty("name")) this.name = data.name;
    if (data.hasOwnProperty("lastname")) this.lastname = data.lastname;
    if (data.hasOwnProperty("email")) this.email = data.email;
    if (data.hasOwnProperty("id")) this.id = data.id;
  }
  getUser = () => {
    return sessionStorage.getItem(environment.SESSIONSTORAGE_USER)
            ? JSON.parse(sessionStorage.getItem(environment.SESSIONSTORAGE_USER))
            : null;
  }
  setToken = (token) => {
    sessionStorage.setItem(environment.SESSIONSTORAGE_TOKEN, token);
  };
  getToken() {
    return sessionStorage.getItem(environment.SESSIONSTORAGE_TOKEN);
  }

  login(email, password) {
    const url = `${environment.API_SERVER}/login`;
    const data = { email: email, password: password }
    const extra = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
      })
    }

    return this.http.post(url, data, extra);
  };
  logout() {
    const url = `${environment.API_SERVER}/logout`;
    const extra = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
        'Authorization': 'Bearer ' + this.getToken()
      })
    }
    return this.http.post(url, {}, extra);
  }
  isLogged() {
    const url = `${environment.API_SERVER}/test`;
    const extra = {
      headers: new HttpHeaders({
        'Content-Type': 'text/html',
        'X-Requested-With': 'XMLHttpRequest',
        'Authorization': 'Bearer ' + this.getToken()
      })
    }
    return this.http.post(url, {}, extra);
  }
  exit() {
    this.logout()
      .pipe(
        finalize(() => {
          this.initial();
          this.router.navigate(['/login']);
        })
      ).subscribe();
  }
  register(data) {
    const url = `${environment.API_SERVER}/register`;
    const extra = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
      })
    }
    return this.http.post(url, data, extra);
  }
  forget(data) {
    const url = `${environment.API_SERVER}/forget`;
    const extra = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
      })
    }
    return this.http.post(url, data, extra);

  }

  getRol() {
    const url = `${environment.API_SERVER}/getRol`;
    const extra = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
        'Authorization': 'Bearer ' + this.getToken(),
      })
    }
    return this.http.get(url, extra);
  }
  getAulas() {
    const url = `${environment.API_SERVER}/user/aulas/${this.id}`;
    const extra = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
        'Authorization': 'Bearer ' + this.getToken(),
      })
    }
    return this.http.get(url, extra);

  }
}
