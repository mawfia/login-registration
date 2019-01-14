import { Component, OnInit } from '@angular/core';
import { User } from '../user';
import { Observable, BehaviorSubject, Observer, of, from } from 'rxjs';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { AuthenticationService } from "../authentication.service";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
	
  user: User = new User();

  constructor(private _authenticationService: AuthenticationService, private _route: ActivatedRoute, private _router: Router) { }

  ngOnInit() {
	  //this._authenticationService.userObservers.subscribe( (user: User) => this.user = user );
	  this._authenticationService.getLoggedInUser().subscribe( success => this.user = success['user'] );
	  //this._route.url.subscribe( success => success[0]['path']);
  }
  
  

}
