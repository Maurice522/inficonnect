import React,{useState,useEffect,useContext} from 'react'
import M from 'materialize-css'
import {useHistory} from 'react-router-dom'

const ChangePassword = ()=>{
const history = useHistory()
const[confirmPwd,setConfirmPwd]= useState("")
const[newPwd,setNewpwd]= useState("")
const[currentPwd,setCurrentPwd]= useState("")

const CheckPwd = ()=>{
  if(newPwd===""||currentPwd===""||confirmPwd===""){
    M.toast({html:"Please fill all the fields",classes:"#d32f2f red darken-2"})
  }else if(newPwd===confirmPwd){
    if(!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#$^+=!*()@%&]).{8,100}$/.test(newPwd)){
        M.toast({html:"Invalid password",classes:"#d32f2f red darken-2"})
        M.toast({html:"Use special character"})
        M.toast({html:"Numbers like 1 2 3 "})
        M.toast({html:"upper and lower case character"})
        M.toast({html:"Minimum 8 character long"})
    }
    else{
    return PostData()
    }
  }
  else{
    return M.toast({html:"Password do not match",classes:"#d32f2f red darken-2"})
  }
}

const PostData = ()=>{

  fetch('/changepassword',{
    method:"post",
    headers:{
      "Content-Type":"application/json",
      "Authorization":"Bearer "+localStorage.getItem("jwt")
    },
    body:JSON.stringify({
      password:currentPwd,
      newPassword:newPwd
    })
  }).then(res=>res.json())
  .then(data=>{
    if(data.error){
      M.toast({html:data.error,classes:"#d32f2f red darken-2"})
    }else{
      M.toast({html:data.message,classes:"#4caf50 green"})
        history.push("/")
  }
})

}

  return(
    <div className="mycard" style={{marginTop:"7%"}}>
    <div className="card auth-card input-field">
    <h3>ChangePassword</h3>
    <div>
    <div className="file-field input-field">
    <input
    type="password"
    placeholder="Current Password"
    value={currentPwd}
    onChange={(e)=>setCurrentPwd(e.target.value)}
    />
    <input
    type="password"
    placeholder="New Password"
    value={newPwd}
    onChange={(e)=>setNewpwd(e.target.value)}
    />
    <input
    type="password"
    placeholder="Confirm Password"
    value={confirmPwd}
    onChange={(e)=>setConfirmPwd(e.target.value)}
    />

    </div>
    <button onClick={()=>CheckPwd()} style={{color:"#279dc8",backgroundColor:"white"}} className="btn waves-effect waves-light">
      <b>Send</b>
    </button>
    </div>
    </div>
    </div>
    )
}

export default ChangePassword
