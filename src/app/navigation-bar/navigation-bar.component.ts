import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { AuthenticationService } from "../authentication.service";

@Component({
  selector: 'app-navigation-bar',
  templateUrl: './navigation-bar.component.html',
  styleUrls: ['./navigation-bar.component.css']
})
export class NavigationBarComponent implements OnInit {

  loggedIn: boolean = false;
  navButtons: boolean[] = [false, false];

  constructor(private _authenticationService: AuthenticationService, private _route: ActivatedRoute, private _router: Router) { }

  ngOnInit() {
	  this.loggedIn = this._authenticationService.isAuthenticated();
	  this._route.url.subscribe( success => 
		
		  if(success.length > 0){
				if(success[0].path == "login") this.navButtons = [false, true]; //[login, register]
				else if(success[0].path == "registration") this.navButtons = [true, false];
				else this.navButtons = [false, false];
		  }
		  else this.navButtons = [false, true];
	  
	  )
  }

  logout(){	  
	  this._authenticationService.logout().subscribe( success => { this._router.navigate(['/']); } );
  }
  
  
}
