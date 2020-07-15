const express=require('express');
const app=express();
const mongoose=require('mongoose');
const router=require('./routes/posts');
const path=require('path');

const Post=require('./models/post');
const userRoutes=require('./routes/user');
const key='mongodb+srv://aurel123:aurel123@cluster0-dlwaf.mongodb.net/test';

mongoose.connect(key,
{
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex:true,
    useFindAndModify: false
}).then(()=>
{
    console.log('MongoDB Connection Started')
}).catch(
    (err)=>
    {
        console.log(err);
    }
);

app.use(express.json());
app.use("/images",express.static(path.join("backend/images")));

app.use((req,res,next)=>
{
    res.setHeader('Access-Control-Allow-Origin','*');
    res.setHeader('Access-Control-Allow-Headers','Origin,X-Requested-With,Content-Type,Accept, Authorization');
    res.setHeader('Access-Control-Allow-Methods','GET,POST,PATCH,DELETE,OPTIONS,PUT');
    next();
});

app.use('/api/posts/',router);
app.use('/api/user/',userRoutes);




module.exports=app;


const jwt=require('jsonwebtoken');
