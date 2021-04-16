import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { UserService } from '../services/user.service';

@Injectable({
  providedIn: 'root'
})
export class IsLoggedGuard {

  constructor(
    private usuarioService: UserService,
    private router: Router
  ) { }

  public canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.usuarioService.isLogged().pipe(map((response: {
      authenticated: boolean
    }) => {
      if (response) {
        this.router.navigate(['/main']);
        return false;
      }
      return true;
    }), catchError((error) => {
      this.router.navigate(['/login']);
      return of(false);
    })
    )
  }

}
