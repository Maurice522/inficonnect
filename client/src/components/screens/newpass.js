import React,{useState,useContext} from 'react'
import {Link,useHistory,useParams} from 'react-router-dom'
import M from 'materialize-css'

const Newpass = ()=> {
  const history = useHistory()
  const [password,setPassword] = useState("")
  const{token}= useParams()
  const PostData =()=>{
    if(password===""){
      M.toast({html:"Please fill all the fields",classes:"#d32f2f red darken-2"})
    }
    else if(!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#$^+=!*()@%&]).{8,100}$/.test(password)){
        M.toast({html:"Invalid password",classes:"#d32f2f red darken-2"})
        M.toast({html:"Use special character"})
        M.toast({html:"Numbers like 1 2 3 "})
        M.toast({html:"upper and lower case character"})
        M.toast({html:"Minimum 8 character long"})
    }
    else
    {
    fetch("/new-password",{
      method:"post",
      headers:{
        "content-Type":"application/json"
      },
      body:JSON.stringify({
        password:password,
        token
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
    <div className="mycard">
      <div className="card auth-card input-field">
        <h2> Inficonnect </h2>
        <input
        type="password"
        placeholder=" Enter new password"
        value={password}
        onChange={(e)=>setPassword(e.target.value)}
        />
        <button onClick={()=>PostData()} className="btn waves-effect waves-light #03a9f4 light-blue">
          Reset password
        </button>
     </div>
    </div>
  )
}

export default Newpass
