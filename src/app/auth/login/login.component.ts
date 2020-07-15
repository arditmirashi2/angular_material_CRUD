import { Component, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Subscription } from 'rxjs';


@Component(
    {
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
    }
)


export class LoginComponent implements OnInit, OnDestroy
{
    authStatusSub: Subscription;
    isLoading: boolean=false;
    constructor(private authService: AuthService)
    {

    }


    // Getting the form data
    @ViewChild('loginForm') loginForm: NgForm;

    onSubmit()
    {
        if(this.loginForm.invalid)
        {
            return;
        }
        this.authService.login(this.loginForm.value.email, this.loginForm.value.password);

    }

    ngOnInit()
    {
        this.authStatusSub=this.authService.getAuthStatusListener().subscribe(authData=>
            {
                this.isLoading=authData;
            })

    }

    ngOnDestroy()
    {
      this.authStatusSub.unsubscribe();
    }
}