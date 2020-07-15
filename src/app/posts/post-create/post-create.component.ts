import { Component, OnInit } from '@angular/core';
import {  FormGroup, FormControl, Validators } from '@angular/forms';
import { PostsService } from '../posts.service';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Post } from '../post.model';
import {mimeType} from './mime-type.validator';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent implements OnInit {

  
  enteredName='';
  enteredContent='';
  post: Post;
  isLoading = false;
  imagePreview: string='';
  form: FormGroup;
  private mode='create';
  private postId: string;
  newPost='NO CONTENT';


  constructor(private postsService: PostsService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {

    // Creating a reactive form
    this.form=new FormGroup(
      {
        'title': new FormControl(null,{
          validators: [Validators.required,Validators.minLength(3)] 
        }),
        'content': new FormControl(null,{
          validators: [Validators.required ]
        }),
        'image': new FormControl(null,
          {
            validators: [Validators.required],
            asyncValidators: [mimeType]
          })
      }
    )
    // Checking the route params
    this.route.paramMap.subscribe((paramMap: ParamMap)=>
      {
        if(paramMap.has('postId'))
        {
          this.mode='edit';
          this.postId=paramMap.get('postId')
          this.isLoading=true;
         this.postsService.getPost(this.postId).subscribe(postData=>
          {
            this.post={
              id: postData._id,
              title: postData.title,
              content: postData.content,
              imagePath: postData.imagePath
            }
            this.isLoading=false;
            this.form.setValue(
              {
                'title': this.post.title,
                'content' : this.post.content,
                'image': this.post.imagePath
              }
            );
          },(err=>
            {
              console.log('An error occured');
            }));
          console.log(this.post);
          
          

        }
        else 
        {
          this.mode='create';
          this.postId=null;
        }

        

      })
  }

  // Image Picker
  onImagePicked(event: Event)
  {

    const file=(event.target as HTMLInputElement).files[0];
    this.form.patchValue({
      'image': file
    })
    this.form.get('image').updateValueAndValidity();
    console.log(file);
    console.log(this.form);
    const reader=new FileReader();
    reader.onload=()=>
    {
      this.imagePreview=reader.result as string; 
      console.log(this.imagePreview);
    }
    reader.readAsDataURL(file);
  }

  onAddPost()
  {
    if(this.form.invalid)
    {
      return;
    }
    this.isLoading=true;

    if(this.mode==='create')
    {
    this.postsService.addPost(this.form.value.title,this.form.value.content, this.form.value.image);
    this.form.reset();
    this.router.navigate(['/posts']);


    }
    else 
    {
      this.postsService.updatePost(this.postId,this.form.value.title,this.form.value.content, this.form.value.image);
      this.form.reset();
      this.router.navigate(['/posts']);
    }

    
  }

}
