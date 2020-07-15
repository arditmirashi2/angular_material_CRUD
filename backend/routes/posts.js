const express=require('express');
const multer=require('multer');

const router=express.Router();
const Post=require('../models/post');
const checkAuth=require('../middleware/check-auth');

const MIME_TYPE_MAP={
    'image/png': 'png',
    'image/jpeg': 'jpg',
    'image/jpg': 'jpg'
}

const storage=multer.diskStorage(
    {
        destination: (req,file,cb)=>
        {
            const isValid=MIME_TYPE_MAP[file.mimetype];
            let error=new Error('Invalid mime type');
            
            if(isValid)
            {
                error=null;
            }
            cb(error,"backend/images");

        },
        filename: (req,file,cb)=>
        {
            const name=file.originalname.toLowerCase().split(' ').join('-');
            const ext= MIME_TYPE_MAP[file.mimetype];
            cb(null, name + '-' + Date.now() + '.' + ext);
        }
    }
)

router.post('',checkAuth,multer({storage: storage}).single("image"),(req,res,next)=>
{ 
    const url=req.protocol + '://' + req.get('host');

    const post=new Post({
        title: req.body.title,
        content: req.body.content,
        imagePath: url+ '/images/' + req.file.filename,
        creator: req.userData.userId
    });
    post.save().then(createdPost=>
        {
            console.log(createdPost);
            res.status(201).json({
                message: 'Post added successfully',
                post: {
                    ...createdPost,
                    id: createdPost._id
                }
            });
        console.log(createdPost);
        }
        ).catch(err=>
            {
                res.status(500).json(
                    {
                        message: 'Creating a post failed';
                    }
                )
            });
    console.log(post);
    
});

router.put('/:id',checkAuth,multer({storage: storage}).single("image"),(req,res,next)=>
{
    let imagePath=req.body.imagePath;
    if(req.file)
    {
        const url=req.protocol + '://'+ req.get('host');
        imagePath=url + '/image/' + req.file.filename;
    }
    const post=new Post(
        {
            _id: req.body.id,
            title: req.body.title,
            content: req.body.content,
            imagePath: imagePath
        }
    )

    Post.updateOne({_id: req.params.id, creator: req.userData.userId},post).then(
        (result)=> 
        {
            if(result.nModified > 0)
            {
                res.status(200).json({
                message: 'Updated Successfully'
                })
            }
            else 
            {
                res.status(401).json(
                    {
                        message: "An error occured!"
                    }
                )
            }

            
            
            
        }
    ).catch(()=>
    {
        res.status(500).json(
            {
                message: "Couldn't update post";
            }
        )
    })
})



router.get('',(req,res,next)=>
{
 const pageSize= +req.query.pageSize;
 const currentPage= +req.query.page;
 const postQuery=Post.find();
 let fetchedPosts;
 if(pageSize && currentPage)
 {
     postQuery.skip(pageSize * (currentPage-1)).limit(pageSize)

 }
 postQuery.then(documents=>
    {
        fetchedPosts=documents;
        return Post.countDocuments();
            }).then(count=>
                {
                    const updatedDocuments=fetchedPosts.map(document=>
                        {
                            return document={
                                id: document._id,
                                title: document.title,
                                content: document.content,
                                imagePath: document.imagePath
            
                            }
                        })
        res.status(200).json({
            message: 'Posts fetched successfully',
            posts: updatedDocuments,
            maxPosts: count
    }
    )
    console.log(documents);
    
  
}).catch(err=>
    {
       res.status(404).json(
           {
               message: 'Posts not found';
           }
       )
    });
});

router.delete('/:id',checkAuth,(req,res,next)=>
{
Post.deleteOne({_id: req.params.id, creator: req.userData.userId}).then((result)=>
{
    if(result.n > 0)
    {
    res.status(200).json({
        message: 'Post deleted'
    })
    }
    else 
    {
        res.status(401).json(
            {
                message: "An error occured";
            }
        )
    }
})

});

router.get('/:id',(req,res,next)=>
{
    
    Post.findById(req.params.id).then(post=>
        {
            if(!post)
            {
             res.status(404).json(
                 {
                     message: 'Post not found'
                 }
             )
            }
            else 
            {
                res.status(200).json(post);
            }
        })
})

module.exports=router;



