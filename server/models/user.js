const mongoose = require("mongoose");
const {ObjectId} = mongoose.Schema.Types

const userSchema = new mongoose.Schema({
  username:{
    type:String,
    required: true
  },
  email:{
    type:String
  },
  password:{
    type:String
  },
  resetToken:String,
  expireToken:Date,
  photo:{
    type:String,
    default:"https://res.cloudinary.com/infieq/image/upload/v1601682393/nouser_gfgmc3.png"
  },
  description:String,
  dob:Date,
  city:String,
  followers:[{
    type:ObjectId,
    ref:"User"
  }],
  following:[{
    type:ObjectId,
    ref:"User"
  }]
})



mongoose.model("User",userSchema);
