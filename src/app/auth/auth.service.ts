import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthData } from './authData.model';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';




@Injectable(
    {
        providedIn: 'root'
    }
)

export class AuthService 
{
    private isAuth=false;
    private tokenTimer: any;
    private userId: string;
    private token: string='';
    private authStatusListener=new Subject<boolean>();
    constructor(private http: HttpClient, private router: Router)
    {

    }
    
    getToken()
    {
        return this.token;
    }

    getIsAuth()
    {
        return this.isAuth;
    }

    getAuthStatusListener()
    {
        return this.authStatusListener.asObservable();
    }

    createUser(email: string, password: string)
    {
        const authData: AuthData={
            email: email,
            password: password
        }
       this.http.post('http://localhost:3000/api/user/signup/',authData).subscribe(()=>
       {
           this.router.navigate(['/posts'])
       },(error)=>
       {
           this.authStatusListener.next(false);
       })
    }

    login(email: string, password: string)
    {
        const authData: AuthData =
        {
            email: email,
            password: password
        }
        this.http.post<{token: string, expiresIn: number, userId: string}>('http://localhost:3000/api/user/signup/',authData).subscribe(
            responseData=>
            {
                const token=responseData.token;
                this.token=token;
                if(token)
                {
                const expiresInDuration=responseData.expiresIn;
                this.isAuth=true;
                this.authStatusListener.next(true);
                this.userId=responseData.userId;
                this.setAuthTimer(responseData.expiresIn);
                const now=new Date();
                const expirationDate=new Date(now.getTime()+expiresInDuration*1000);
                
                this.saveAuthData(token,expirationDate,this.userId);
                this.router.navigate(['/']);

                }
                
            },
            error=>
            {
                this.authStatusListener.next(true);
            }
        )
    }

    private setAuthTimer(duration: number)
    {
        console.log('Setting timer:' + duration)
        this.tokenTimer=setTimeout(()=>
        {
            this.logout();

        },duration*1000)    
    }

    autoAuthUser()
    {
      const authInformation=this.getAuthData();
      if(!authInformation)
      {
          return;
      }
      const now=new Date();
      const isInFuture= authInformation.expirationDate > now;
      const expiresIn=authInformation.expirationDate.getTime() - now.getTime();
      if(isInFuture)
      {
          this.token=authInformation.token;
          this.isAuth=true;
          this.userId=authInformation.userId;
          this.setAuthTimer(expiresIn/1000);
          this.authStatusListener.next(true);

          
      }

    }

    logout()
    {
        this.token=null;
        this.isAuth=false;
        this.authStatusListener.next(false);
        clearTimeout(this.tokenTimer);
        this.userId=null;
        this.router.navigate(['/']);
    }

    private saveAuthData(token: string, expirationDate: Date, userId: string)
    {
        localStorage.setItem('token', token);
        localStorage.setItem('expiration', expirationDate.toISOString());
        localStorage.setItem('userId',userId);

    }

    private clearAuthData()
    {
        localStorage.removeItem('token');
        localStorage.removeItem('expiration');
        localStorage.removeItem('userId');
    }

    getUserId()
    {
        return this.userId;
    }

    private getAuthData()
    {
        const token= localStorage.getItem('token');
        const expirationDate=localStorage.getItem('expiration');
        const userId=localStorage.getItem('userId')
        if(!token && !expirationDate)
        {
            return;
        }
        const authObject=
        {
            token: token,
            expirationDate: new Date(expirationDate),
            userId: userId
        }

        return authObject;
        
    }
}