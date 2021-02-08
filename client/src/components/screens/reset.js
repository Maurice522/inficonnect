import React,{useState,useContext} from 'react'
import {Link,useHistory} from 'react-router-dom'
import M from 'materialize-css'

const Reset = ()=> {

  const history = useHistory()
  const [email,setEmail] = useState("")

  const PostData =()=>{
    console.log("posting data")
    if(email===""){
      M.toast({html:"Please fill all the fields",classes:"#d32f2f red darken-2"})
    } else{
    fetch("/reset-password",{
      method:"post",
      headers:{
        "content-Type":"application/json"
      },
      body:JSON.stringify({
        email:email,
      })
    }).then(res=>res.json())
    .then(data=>{

      M.toast({html:data.message,classes:"#4caf50 green"})
    history.push('/signin')
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
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e)=>setEmail(e.target.value)}
        />
        <div style={{marginTop:"5%",marginBottom:"5%"}}>
        <button onClick={()=>PostData()} style={{color:"#279dc8",backgroundColor:"white"}} className="btn waves-effect waves-light">
          Reset Password
        </button>
        </div>
     </div>
    </div>
  )
}

export default Reset
