const mongoose = require('mongoose');
const {ObjectId} = mongoose.Schema.Types

const messageSchema = new mongoose.Schema({
  text:{
    type:String
  },
  id:{
    type:String,
    require:true
  },
  sender:{
    type:String,
    require:true
  }

})

mongoose.model("Message", messageSchema)
