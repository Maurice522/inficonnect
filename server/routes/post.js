// const express = require('express')
// const router = express.Router()
// const mongoose = require('mongoose')
// const Post = mongoose.model("Post")
// router.post('/createpost',(req,res)=>{
//   const [title,body] = req.body
//   if(!title||!body){
//     res.status(422).json({error:"Please fill all the fields"})
//   }
//   const post = new Post({
//     title,
//     body,
//     postedBy:Userjson
//   })
//   post.save().then(result=>{
//     res.json({post:result})
//   })
//   .catch(err=>{
//     console.log(err)
//   })
// })
//
//
// module.exports = router
