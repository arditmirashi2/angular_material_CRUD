import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit,OnDestroy {

  public userIsAuth:boolean=false;
  private authListener: Subscription;

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.authListener=this.authService.getAuthStatusListener().subscribe((authData)=>
    {
      this.userIsAuth=authData;

    })
  }


  onLogout()
  {
    this.authService.logout();
  }



  ngOnDestroy(): void
  {
    this.authListener.unsubscribe();

  }

}
