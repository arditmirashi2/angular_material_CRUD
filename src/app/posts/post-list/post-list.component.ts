import { Component, OnInit, OnDestroy} from '@angular/core';
import { Post } from '../post.model';
import { PostsService } from '../posts.service';
import { Subscription } from 'rxjs';
import { PageEvent } from '@angular/material/paginator';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit,OnDestroy {

  isLoading=false;
  totalPosts=0;
  postsPerPage=2;
  currentPage=1;
  pageSizeOptions=[1,2,5,10];
  userId: string;
  public authStatus: boolean = false;
  private postSub: Subscription;
  private authStatusSub: Subscription;

  // posts=[
  //   {
  //     title: 'First Post',
  //     content: 'This is the first post'
  //   },
  //   {
  //     title: 'Second Post',
  //     content: 'This is the second post'
  //   },
  //   {
  //     title: 'Third Post',
  //     content: 'This is the third post'
  //   }
  // ]
  posts: Post[];


  constructor(private postsService: PostsService, private authService: AuthService) { }

  ngOnInit(): void {
  this.isLoading=true;
  this.postsService.getPosts(this.postsPerPage,this.currentPage);
  this.userId=this.authService.getUserId();
  this.postSub = this.postsService.getPostUpdateListener().subscribe((postData: { posts: Post[],postCount: number })=>
      {
        this.isLoading=false;
        this.posts=postData.posts;
        this.totalPosts=postData.postCount;
        console.log(this.posts);

      })
  this.authStatus=this.authService.getIsAuth();
  this.authStatusSub=this.authService.getAuthStatusListener().subscribe((authData)=>
  {
    
    this.authStatus=authData;
    this.userId=this.authService.getUserId();
  })
  
  }

  onDelete(postId: string)
  {
    this.isLoading=true;
    this.postsService.deletePost(postId).subscribe(()=>
      {
        this.postsService.getPosts(this.postsPerPage,this.currentPage);

      });
  }


  onPageChanged(pageData: PageEvent)
  {
    this.isLoading=true;
    this.currentPage=pageData.pageIndex+1;
    this.postsPerPage=pageData.pageSize;
    this.postsService.getPosts(this.postsPerPage,this.currentPage);
    
  }
  

  ngOnDestroy()
  {

    this.postSub.unsubscribe();
    this.authStatusSub.unsubscribe();
  }

}
