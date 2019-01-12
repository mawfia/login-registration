import { AuthenticationService } from './authentication.service';
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, Route } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable()

export class AuthGuard implements CanActivate {

  constructor(private _authenticationService: AuthenticationService, private _router: Router) {
  }

  canActivate(route: ActivatedRouteSnapshot, status: RouterStateSnapshot): boolean {
    if (this._authenticationService.isAuthenticated()) {
        return true;
    }

    // navigate to login page

    this._router.navigate(['/login']);

    // you can save redirect url so after authing we can move them back to the page they requested
    return false;
  }
}