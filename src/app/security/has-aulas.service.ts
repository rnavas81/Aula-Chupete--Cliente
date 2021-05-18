import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { UserService } from '../services/user.service';

@Injectable({
  providedIn: 'root'
})
export class HasAulasGuard {

  constructor(
    private userService: UserService,
    private router: Router,
  ) { }

  public canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {

    return this.userService.getAulas().pipe(map((response: {
      authenticated: boolean
    }) => {
      if (Array.isArray(response) && response.length==0) {
        this.router.navigate(['/aulas/formulario']);
        return false;
      }
      return true;
    }), catchError((error) => {
      this.userService.exit();
      return of(false);
    })
    )
  }
}
