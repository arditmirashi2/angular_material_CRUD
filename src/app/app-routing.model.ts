import {RouterModule, Routes} from '@angular/router';
import { NgModule } from '@angular/core';
import { PostListComponent } from './posts/post-list/post-list.component';
import { PostCreateComponent } from './posts/post-create/post-create.component';
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';
import { AuthGuard } from './auth/auth.guard';




const appRoutes: Routes=[
    {
        path: 'posts' ,
        component: PostListComponent 
    },
    {
        path: 'create',
        component: PostCreateComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'edit/:postId',
        component: PostCreateComponent
    },
    {
        path: 'login',
        component: LoginComponent
    },
    {
        path: 'signup',
        component: SignupComponent
    }
]

@NgModule(
    {
        imports: [RouterModule.forRoot(appRoutes)],
        exports: [RouterModule],
        providers: [AuthGuard]

    }
)

export class AppRoutingModule 
{

}