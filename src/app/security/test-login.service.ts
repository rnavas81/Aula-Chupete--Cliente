import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { UserService } from '../services/user.service';

@Injectable({
  providedIn: 'root'
})
export class TestLoginGuard {

  constructor(
    private usuarioService: UserService,
    private router: Router
  ) { }

  public canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.usuarioService.isLogged().pipe(map((response: {
      authenticated: boolean
    }) => {
      this.router.navigate(['/main']);
      return true;
    }), catchError((error) => {
      return of(true);
    })
    )
  }

}
