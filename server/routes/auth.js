const express = require('express');
const mongoose = require("mongoose");
const bodyParser = require('body-parser');
const session = require("express-session");
const router= express.Router();
const crypto = require('crypto')
const bcrypt = require('bcrypt')
const {ObjectId} = mongoose.Schema.Types
const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport')
const jwt = require('jsonwebtoken');
const {JWT_SECRET} = require("../keys")
const requireLogin  = require("../middleware/requireLogin")
const cors = require("cors");
router.use(cors());

const Post = mongoose.model("Post")
const User = mongoose.model("User")
const Message = mongoose.model("Message")
// require("../models/user")

// const intializePassport = require('./passport-config');
// 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
// intializePassport(passport, username=> {
//   return users.find(user => user.username === username)
// });

const transporter = nodemailer.createTransport(sendgridTransport({
  auth:{
    api_key:"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"
  }
}))

router.use(bodyParser.urlencoded({
  extended:true
}));

// const userSchema = new mongoose.Schema({
//   username:{
//     type:String,
//     required: true
//   },
//   email:{
//     type:String
//   },
//   password:{
//     type:String
//   },
//   resetToken:String,
//   expireToken:Date,
//   photo:{
//     type:String,
//     default:"https://res.cloudinary.com/infieq/image/upload/v1601682393/nouser_gfgmc3.png"
//   },
//   followers:[{
//     type:ObjectId,
//     ref:"User"
//   }],
//   following:[{
//     type:ObjectId,
//     ref:"User"
//   }]
// })



// router.get("/signin", function(req,res){
//   res.sendFile(__dirname+"/signin.html");
// });

//<-----------post routes----------->

router.post("/signin", function(req,res){
  username = req.body.username.toLowerCase()
  User.findOne({username:username})
  .then(savedUser=>{
    if(!savedUser){
      return res.status(422).json({error:"Invalid username or password"})
    }
    bcrypt.compare(req.body.password,savedUser.password)
    .then(doMatch=>{
      if(doMatch){
        // res.json({message:"Successfully signed in"})
        const token = jwt.sign({_id:savedUser._id},JWT_SECRET)
        const {_id,username,email,followers,following,photo,description,city,dob} = savedUser
        res.json({token,user:{_id,username,email,followers,following,photo,description,city,dob}})
      }
      else{
        return res.status(422).json({error:"Invalid username or password"})
      }
    })
    .catch(err=>{
      console.log(err)
    })
  })
});

router.post("/signup", function(req,res){
  username = req.body.username.toLowerCase()
  User.findOne({username:username})
  .then((savedUser)=>{
    if(savedUser){
      return res.status(422).json({error:"User already exists with that username"})
    }
    User.findOne({email:req.body.email})
    .then((savedUser)=>{
      if(savedUser){
        return res.status(422).json({error:"User already exists with that email"})
      }
    bcrypt.hash(req.body.password,13)
    .then(hashedpassword=>{

      const user = new User({
        username:username,
        password:hashedpassword,
        email:req.body.email
      })
      user.save()
      .then(user=>{
        transporter.sendMail({
          to:user.email,
          from:"infieq@gmail.com",
          subject:"signup success",
          html:`<h1>Welcome to Inficonnect</h1>
          <p>Congratulations, you have Registered successfully!</p>
           `
        })
        res.json({message:"Registered successfully"})
      })
      .catch(err=>{
        console.log(err)
      })
    })

  })
  .catch(err=>{
    console.log(err)
  })
})
.catch(err=>{
  console.log(err)
})
})


router.post('/reset-password',(req,res)=>{
  crypto.randomBytes(32,(err,buffer)=>{
    if(err)
    {
      console.log(err)
    }
    const token = buffer.toString("hex")
    User.findOne({email:req.body.email})
    .then(user=>{
      if(!user){
        return res.status(422).json({error:"No user found"})
      }
      user.resetToken = token
      user.expireToken = Date.now()+3600000
      user.save().then((result)=>{
        transporter.sendMail({
          to:user.email,
          from:"infieq@gmail.com",
          subject:"password reset",
          html:`
          <h1>Password Reset</h1>
          <p>You have Requested for password reset</p>
          <h5>click this  <a href="http://localhost:3000/reset/${token}">link</a> to reset your password </h5>
          `
        })
        res.json({message:"Check your email"})
      })
    })
  })
})

router.post("/new-password",(req,res)=>{
  const newpassword = req.body.password
  const sentToken = req.body.token
  User.findOne({resetToken:sentToken,expireToken:{$gt:Date.now()}})
  .then(user=>{
    if(!user){
      return res.status(422).json({error:"Try again session expired"})
    }
    bcrypt.hash(newpassword,13).then(hashedpassword=>{
        user.password = hashedpassword
        user.resetToken = undefined
        user.expireToken = undefined
        user.save().then((saveduser)=>{
          res.json({message:"Password updated successfully"})
        })
    }).catch(err=>{
      conosle.log(err)
    })

  })
})

// router.post("/newpass",(req,res)=>{
//   username = req.body.username.toLowerCase()
//   User.updateOne({username:username},{password:req.body.password},(err)=>{
//     if(err){
//       console.log(err)
//     }else{
//       console.log("password updated")
//     }
//   })
// })

router.get('/allpost',requireLogin,(req,res)=>{
    Post.find()
    .populate("postedBy","_id username photo")
    .populate("comments.postedBy","_id username")
    .sort('-createdAt')
    .then(posts=>{
      res.json({posts:posts})
    })
    .catch(err=>{
      console.log(err)
    })
})

router.get('/getsubpost',requireLogin,(req,res)=>{
  Post.find({postedBy:{$in:req.user.following}})
  .populate("postedBy","_id username photo")
  .populate("comments.postedBy","_id username")
  .sort('-createdAt')
  .then(posts=>{
    res.json({posts})
  })
  .catch(err=>{
    console.log(err)
  })

})

router.post('/createpost',requireLogin,(req,res)=>{
    const title = req.body.title
    const body = req.body.body
    const photo = req.body.photo
    // if(!title||!body||!photo){
    //   res.status(422).json({error:"Please fill all the fields"})
    // }
    req.user.password = undefined
    const post = new Post({
      title,
      body,
      photo,
      postedBy:req.user
    })
    post.save().then(result=>{
      res.json({post:result})
    })
    .catch(err=>{
      console.log(err)
    })


})

router.get('/mypost',requireLogin,(req,res)=>{
    Post.find({postedBy:req.user._id})
    .populate("postedBy","_id username photo")
    .then(mypost=>{
      res.json({mypost})
    })
    .catch(err=>{
      console.log(err)
    })

})

router.put("/like",requireLogin,(req,res)=>{
  Post.findByIdAndUpdate(req.body.postId,{
    $addToSet:{likes:req.user._id}
  },{
    new:true
  })
  .populate("comments.postedBy","_id username")
  .populate("postedBy","_id username")
  .exec((err,result)=>{
    if(err){
      return res.status(422).json({error:err})
    }else{
      res.json(result)
    }
  })
})

router.put("/unlike",requireLogin,(req,res)=>{
  Post.findByIdAndUpdate(req.body.postId,{
    $pull:{likes:req.user._id}
  },{
    new:true
  })
  .populate("comments.postedBy","_id username")
  .populate("postedBy","_id username")
  .exec((err,result)=>{
    if(err){
      return res.status(422).json({error:err})
    }else{
      res.json(result)
    }
  })
})

router.put("/comment",requireLogin,(req,res)=>{
  const comment={
    text:req.body.text,
    postedBy:req.user._id
  }
  Post.findByIdAndUpdate(req.body.postId,{
    $push:{comments:comment}
  },{
    new:true
  })
  .populate("comments.postedBy","_id username")
  .populate("postedBy","_id username")
  .exec((err,result)=>{
    if(err){
      return res.status(422).json({error:err})
    }else{
      res.json(result)
    }
  })
})

router.delete('/deletepost/:postId',requireLogin,(req,res)=>{
  Post.findOne({_id:req.params.postId})
  .populate("postedBy","_id")
  .exec((err,post)=>{
    if(err || !post){
      return res.status(422).json({error:err})
    }
    if(post.postedBy._id.toString() === req.user._id.toString()){
      post.remove()
      .then(result=>{
        res.json({message:"successfully deleted"})
      }).catch(err=>console.log(err))
    }
  })
})


router.delete('/discover/deletecomment/:postId/:commentId',requireLogin,(req,res)=>{
  console.log(req.params.postId)
  console.log(req.params.commentId)
  Post.findOne({_id:req.params.postId})
  .exec((err,post)=>{
    if(err || !post){
      return res.status(422).json({error:err})
    }

    Post.update(
        {'_id': req.params.postId},
        { $pull: { "comments" : { '_id': req.params.commentId } } },{
          new:true
        }
    ).catch(err=>console.log(err))
   console.log("deleted")
    Post.find()
    .populate("postedBy","_id username photo")
    .populate("comments.postedBy","_id username")
    .sort('-createdAt')
    .then(posts=>{
      res.json({posts:posts})
    })
    .catch(err=>{
      console.log(err)
    })

    // Post.update({_id:req.params.postId},
    //   {$pull:{'comments':{_id:req.params.commentId}}})
    // post.comments.map(item=>{
    //   if(item._id.toString() === req.params.commentId.toString()){
    //     console.log(item)
    //     // .then(result=>{
    //     //   res.json({message:"successfully deleted"})
    //     // }).catch(err=>console.log(err))
    //
    //     Post.findByIdAndUpdate(req.params.postId,{
    //       $pull:{comments:{_id:item._id}}
    //     },{
    //       new:true
    //     })
    //   }
    // })
    // .then(result=>{
    //     res.json(result)
    //   }).catch(err=>console.log(err))
  })
})
router.delete('/home/deletecomment/:postId/:commentId',requireLogin,(req,res)=>{
  console.log(req.params.postId)
  console.log(req.params.commentId)
  Post.findOne({_id:req.params.postId})
  .exec((err,post)=>{
    if(err || !post){
      return res.status(422).json({error:err})
    }

    Post.update(
        {'_id': req.params.postId},
        { $pull: { "comments" : { '_id': req.params.commentId } } },{
          new:true
        }
    ).catch(err=>console.log(err))
   console.log("deleted")
   Post.find({postedBy:{$in:req.user.following}},{new:true})
   .populate("postedBy","_id username photo")
   .populate("comments.postedBy","_id username")
   .sort('-createdAt')
   .then(posts=>{
     res.json({posts})
   })
   .catch(err=>{
     console.log(err)
   })

    // Post.update({_id:req.params.postId},
    //   {$pull:{'comments':{_id:req.params.commentId}}})
    // post.comments.map(item=>{
    //   if(item._id.toString() === req.params.commentId.toString()){
    //     console.log(item)
    //     // .then(result=>{
    //     //   res.json({message:"successfully deleted"})
    //     // }).catch(err=>console.log(err))
    //
    //     Post.findByIdAndUpdate(req.params.postId,{
    //       $pull:{comments:{_id:item._id}}
    //     },{
    //       new:true
    //     })
    //   }
    // })
    // .then(result=>{
    //     res.json(result)
    //   }).catch(err=>console.log(err))
  })
})

router.get('/user/:id',(req,res)=>{
  User.findOne({_id:req.params.id})
  .select("-password")
  .then(user=>{
    Post.find({postedBy:req.params.id})
    .populate("postedBy","_id username")
    .exec((err,posts)=>{
      if(err){
        return res.status(422).json({error:err})
      }
      res.json({user,posts})
    })
  }).catch(err=>{
    return res.status(404).json({error:"User not found"})
  })
})

// router.put('follow',(req,res)=>{
//   UserfindByIdAndUpdate(req.body.followId,{
//     $addToSet:{followers:Userjson._id}
// },{new:true},(err,result)=>{
//   if(err){
//     return res.status(422).json({error:err})
//   }
//   User.findByIdAndUpdate(Userjson._id,{
//     $addToSet:{following:req.body.followId}
// },{new:true}).then(result=>{
//   res.json(result)
// }).catch(err=>{
//   res.status(422).json({error:err})
// })
// })
// })

router.put('/follow',requireLogin,(req,res)=>{
  User.findByIdAndUpdate(req.body.followId,{
    $addToSet:{followers:req.user._id}
},{new:true},(err,result)=>{
  if(err){
    return res.status(422).json({error:err})
  }
  User.findByIdAndUpdate(req.user._id,{
    $addToSet:{following:req.body.followId}
},{new:true}).select("-password").then(result=>{
  res.json(result)
}).catch(err=>{
  res.status(422).json({error:err})
})
})
})

// router.put("/follow",(req,res)=>{
//   User.findByIdAndUpdate({_id:"5f74d3208ac01b7afcd35c35"},{
//     $addToSet:{followers:Userjson._id}
//   },{
//     new:true
//   })
//   .populate("comments.postedBy","_id username")
//   .populate("postedBy","_id username")
//   .exec((err,result)=>{
//     if(err){
//       return res.status(422).json({error:err})
//     }else{
//       console.log(result)
//       res.json(result)
//     }
//   })
// })
//
// router.put('/follow',(req,res)=>{
//   console.log(req.body.followId)
//   console.log(Userjson)
//   .findByIdAndUpdate(req.body.followId,
//     {"$push":{"followers":Userjson._id}
// },{new:true},(err,result)=>{
//   console.log(result)})
// })

router.put('/unfollow',requireLogin,(req,res)=>{
  User.findByIdAndUpdate(req.body.followId,{
    $pull:{followers:req.user._id}
},{new:true},(err,result)=>{
  if(err){
    return res.status(422).json({error:err})
  }
  User.findByIdAndUpdate(req.user._id,{
    $pull:{following:req.body.followId}
},{new:true}).select("-password").then(result=>{
  res.json(result)
}).catch(err=>{
  res.status(422).json({error:err})
    })
  })
})

router.put('/updateprofile',requireLogin,(req,res)=>{
  // console.log(req.body.dob)
  // console.log(req.body.city)
  // console.log(req.body.description)
  if(req.body.photo){
    User.findByIdAndUpdate({_id:req.user._id},{$set:{photo:req.body.photo}},{new:true},
      (err,result)=>{
        if(err){
          return (res.status(422).json({error:"photo cannot be posted"}))
        }


      })
  } if(req.body.dob){
    User.findByIdAndUpdate({_id:req.user._id},{$set:{dob:req.body.dob}},{new:true},
      (err,result)=>{
        if(err){
          return (res.status(422).json({error:"dob cannot be posted"}))
        }


      })
  } if(req.body.city){
    User.findByIdAndUpdate({_id:req.user._id},{$set:{city:req.body.city}},{new:true},
      (err,result)=>{
        if(err){
          return (res.status(422).json({error:"city cannot be posted"}))
        }


      })
  } if(req.body.description){
    User.findByIdAndUpdate({_id:req.user._id},{$set:{description:req.body.description}},{new:true},
      (err,result)=>{
        if(err){
          return (res.status(422).json({error:"description cannot be posted"}))
        }

      })
  }
  User.find({_id:req.user._id},(err,result)=>{
    if(err){
      return (res.status(422).json({error:"cant find user"}))
    }
    //console.log(result)
    res.json(result)
  })

})
router.post('/search-users',(req,res)=>{
  let userPattern = new RegExp("^"+req.body.query)
  User.find({username:{$regex:userPattern}})
  .select("_id username photo")
  .then(user=>{
    res.json({user})
  }).catch(err=>{
    console.log(err)
  })
})

router.get('/userid', requireLogin,(req,res)=>{
  req.user.password = undefined
  res.json({id:req.user._id})
})

router.post('/changepassword', requireLogin,(req,res)=>{
  bcrypt.compare(req.body.password,req.user.password)
  .then(doMatch=>{
    if(doMatch){
      User.findOne({_id:req.user._id})
      .then(user=>{
        bcrypt.hash(req.body.newPassword,13).then(hashedpassword=>{
        user.password = hashedpassword
        user.save().then((saveduser)=>{
        res.json({message:"Password updated successfully"})
        })
      }).catch(err=>{
        conosle.log(err)
        })
      })
    }
    else{
      return res.status(422).json({error:"Invalid password"})
    }
  })
})

router.get('/contacts', requireLogin , (req,res)=>{
  // var contacts
  User.findById({_id:req.user._id})
  .select("-password")
  .populate("following","_id username photo")
  .exec((err,user)=>{
    if(err){
      return res.status(422).json({error:err})
    }
    console.log(user.following)
    res.json({contacts:user.following})
  })
})
  // .then(result=>{
  //   const {following}=result
  //   console.log(following)
  //   following.map(getdetails)
  //     function getdetails(id){
  //       console.log(id)
  //       User.findById({_id:id}).select("_id photo username")
  //       .then(result=>{
  //         // console.log(result)
  //         contacts = contacts + [result]
  //         console.log(contacts)
  //       })
  //     }
  //
  //    res.json({contacts:following})
  // }).catch(err=>
  //    res.json(err))
// })

router.post('/message', requireLogin , (req,res)=>{
  const text = req.body.text;
  const recipient = req.body.recipient;
  const userid = req.user._id;
  const chatid = userid+recipient
  const chatidrev =recipient+userid
  req.user.password = undefined

        const message = new Message({
          id:chatid,
          text,
          sender:userid
        })
        message.save()
        .then(()=>{
          const message = new Message({
            id:chatidrev,
            text,
            sender:userid
          })
          message.save()
          .then(()=>{
            Message.find({id:chatid},(err,result)=>{
              return res.json({messages:result})
          })
        })
        // .then(result=>{
        //   console.log(result)
        //   return res.json({messages:result})
        // })
        // .catch(err=>{
        //   console.log(err)
        // })

        })
    }
  )


router.post('/conversation', requireLogin, (req,res)=>{
    const recipient = req.body.recipient;
    const userid = req.user._id;
    const chatid = userid+recipient
    const chatidrev =recipient+userid
      req.user.password = undefined
    Message.find({id:chatid},(err,result)=>{
      console.log(result)
        return res.json({messages:result})

    })

})

module.exports = router;
