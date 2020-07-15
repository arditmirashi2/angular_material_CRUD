import { Component, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Subscription } from 'rxjs';


@Component(
    {
    selector: 'app-signup',
    templateUrl: './signup.component.html',
    styleUrls: ['./signup.component.css']
    }
)


export class SignupComponent implements OnInit, OnDestroy
{
    isLoading: boolean=false;
    private authStatusSub: Subscription;

    constructor(private authService: AuthService)
    {

    }

    // Getting the form data
    @ViewChild('signupForm') signupForm: NgForm;

    onSubmit()
    {
        if(this.signupForm.invalid)
        {
            return;
        }
        this.signupForm.reset();
        this.isLoading=true;
        this.authService.createUser(this.signupForm.value.email, this.signupForm.value.password);
        console.log(this.signupForm.value.email);
    }

    ngOnInit()
    {
      this.authStatusSub=this.authService.getAuthStatusListener().subscribe(authStatus=>
        {
            this.isLoading=authStatus;
        })
    }

    ngOnDestroy()
    {
     this.authStatusSub.unsubscribe();
    }


}