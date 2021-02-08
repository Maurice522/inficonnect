import React,{useState,useContext} from 'react'
import {Link,useHistory} from 'react-router-dom'
import {UserContext} from '../../App'
import M from 'materialize-css'

const Signin = ()=> {
  const {state,dispatch} = useContext(UserContext)
  const history = useHistory()
  const [name,setName] = useState("")
  const [password,setPassword] = useState("")

  const PostData =()=>{
    console.log("posting data")
    if(name===""||password===""){
      M.toast({html:"Please fill all the fields",classes:"#d32f2f red darken-2"})
    } else{
    fetch("/signin",{
      method:"post",
      headers:{
        "content-Type":"application/json"
      },
      body:JSON.stringify({
        username:name,
        password:password
      })
    }).then(res=>res.json())
    .then(data=>{
      if(data.error){
        M.toast({html:data.error,classes:"#d32f2f red darken-2"})
      }else{
      localStorage.setItem("jwt",data.token)
      localStorage.setItem("user",JSON.stringify(data.user))
      // console.log(JSON.parse(localStorage.getItem("user")))
      dispatch({type:"USER",payload:data.user})
      M.toast({html:"<p>Signed in successfully</p>",classes:"#4caf50 green"})
    history.push('/')
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
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e)=>setPassword(e.target.value)}
        />
        <div style={{marginTop:"5%"}}>
        <button onClick={()=>PostData()} style={{color:"#279dc8",backgroundColor:"white",marginBottom:"5%"}} className="btn waves-effect waves-light">
          Sign in
        </button>
        <Link to="/signup" style={{marginLeft:"10%",backgroundColor:"black",color:"white", marginBottom:"5%"}}  className="btn waves-effect waves-light ">
          Sign up
        </Link>
        </div>
        <p>
        <Link to="/reset">
        Forgot password?
        </Link>
        </p>
     </div>
    </div>
  )
}

export default Signin
