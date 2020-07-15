const mongoose=require('mongoose');

const post=new mongoose.Schema(
    {
      title: {
          type: String,
          required: [true,'This field is required!'],
          max: [10,'The field exceeded the maximum amount of letter allowed!']
          
      } ,
      content: 
      {
          type: String,
          required: true
      },
      imagePath:
       {
           type: String, 
           required: true
       },
      creator:
      {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true
      }
    }
);

module.exports=mongoose.model('Post',post);
