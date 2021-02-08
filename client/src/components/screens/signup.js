import React, {useState} from 'react'
import {Link, useHistory} from 'react-router-dom'
import M from 'materialize-css'
// x-www-form-urlencoded
const Signup = ()=> {
  const history = useHistory()
  const [name,setName] = useState("")
  const [password,setPassword] = useState("")
  const [email,setEmail] = useState("")

  const PostData =()=>{
    console.log("posting data")
    if(name===""||email===""||password===""){
      M.toast({html:"Please fill all the fields",classes:"#d32f2f red darken-2"})
    }else if(!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)){
      M.toast({html:"Invalid Email",classes:"#d32f2f red darken-2"})
    }else if(!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#$^+=!*()@%&]).{8,100}$/.test(password)){
        M.toast({html:"Invalid password",classes:"#d32f2f red darken-2"})
        M.toast({html:"Use special character"})
        M.toast({html:"Numbers like 1 2 3 "})
        M.toast({html:"upper and lower case character"})
        M.toast({html:"Minimum 8 character long"})
    }
    else{

    fetch("/signup",{
      method:"post",
      headers:{
        "content-Type":"application/json"
      },
      body:JSON.stringify({
        username:name,
        password:password,
        email:email
      })
    }).then(res=>res.json())
    .then(data=>{
      if(data.error){
        M.toast({html:data.error,classes:"#d32f2f red darken-2"})
      }else{
        M.toast({html:data.message,classes:"#4caf50 green"})
      history.push('/signin')
      }
    }).catch(err=>{
      console.log(err)
    })
  }

  }
  return(
    <div className="mycard" style={{marginTop:"7%"}}>
      <div className="card auth-card input-field">
        <h3 style={{fontFamily: "Audiowide, cursive",paddingBottom:"0%"}}> <span style={{color:"#279dc8"}}>Infi</span>connect </h3>
        <input
        type="text"
        placeholder="Username"
        value={name}
        onChange={(e)=>setName(e.target.value)}
        />
        <input
        type="text"
        placeholder="Email"
        value={email}
        onChange={(e)=>setEmail(e.target.value)}
        />
        <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e)=>setPassword(e.target.value)}
        />
        <div style={{marginTop:"5%",marginBottom:"5%"}}>
        <button onClick={()=>PostData()} style={{color:"#279dc8",backgroundColor:"white"}} className="btn waves-effect waves-light">
          Sign up
        </button>
        <Link to="/signin" style={{marginLeft:"10%",color:"white",backgroundColor:"black"}}  className="btn waves-effect waves-light ">
          Sign in
        </Link>
        </div>

     </div>
    </div>
  )
}
export default Signup
