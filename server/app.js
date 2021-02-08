const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const session = require("express-session");
const app = express();
const socket = require('socket.io');
const cors = require("cors");
app.use(cors());
const PORT = 5000;
const {MONGOURI} = require('./keys');



var server = app.listen(PORT, ()=>{
  console.log("server is running on",PORT);
});


const io = socket(server);

require('./models/user');
require('./models/post');
require('./models/message');


app.use(bodyParser.json(  {extended:true}))
app.use(express.json())
app.use(bodyParser.urlencoded({
  extended:true
}));
app.use(function(req,res,next){
  res.header('Access-Control-Allow-Origin', "*");
  next();
})
app.use(require('./routes/auth'));


// app.use(require('./routes/post'));

mongoose.connect(MONGOURI,{useNewUrlParser:true,useUnifiedTopology:true});
mongoose.connection.on('connected',()=>{
  console.log("connected to mongo");
});
mongoose.connection.on('error',(err)=>{
  console.log("err connecting",err);
});

// io.on('connection', socket => {
//   console.log("made socket connection")
//   const id = socket.handshake.query.id
//   socket.join(id)
//
//   socket.on('send-message', ({ recipients, text }) => {
//     recipients.forEach(recipient => {
//       const newRecipients = recipients.filter(r => r !== recipient)
//       newRecipients.push(id)
//       socket.broadcast.to(recipient).emit('receive-message', {
//         recipients: newRecipients, sender: id, text
//       })
//     })
//   })
// })

io.on('connection', socket => {
  const id = socket.handshake.query.id
  socket.join(id)

  socket.on('send-message', ({ recipients, text }) => {
    recipients.forEach(recipient => {
      const newRecipients = recipients.filter(r => r !== recipient)
      newRecipients.push(id)
      socket.broadcast.to(recipient).emit('receive-message', {
        recipients: newRecipients, sender: id, text
      })
    })
  })
})

//io.on('connection', (socket)=>console.log("made socket connection",socket.id));
