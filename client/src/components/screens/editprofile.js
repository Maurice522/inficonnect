import React,{useState,useEffect,useContext} from 'react'
import M from 'materialize-css'
import {UserContext} from '../../App'
import {useHistory} from 'react-router-dom'

const EditProfile = ()=>{
const history = useHistory()
const[desc,setDesc]= useState("")
const[city,setCity]= useState("")
const[dob,setDob]= useState("")
const[image,setImage]= useState("")
const{state,dispatch} = useContext(UserContext)
const year = Date().substr(11,4)-2

useEffect(()=>{
  if(image){
    const data = new FormData()
    data.append("file",image)
    data.append("upload_preset","inficonnect")
    data.append("cloud_name","infieq")
    fetch("https://api.cloudinary.com/v1_1/infieq/image/upload",{
      method:"post",
      body: data
    })
    .then(res=>res.json())
    .then(data=>{
       fetch('/updateprofile',{
         method:"put",
         headers:{
           "Content-Type":"application/json",
           "Authorization":"Bearer "+localStorage.getItem("jwt")
         },
         body:JSON.stringify({
           photo:data.url
         })
       }).then(res=>res.json())
       .then(result=>{
         localStorage.setItem("user",JSON.stringify({...state,photo:result[0].photo}))
         dispatch({type:"UPDATEPHOTO",payload:result.photo})
       })
     })
     .catch(err=>console.log(err))
  }
},[image])

const updatePhoto = (file)=>{
  setImage(file)
}
const PostData = ()=>{
  fetch('/updateprofile',{
    method:"put",
    headers:{
      "Content-Type":"application/json",
      "Authorization":"Bearer "+localStorage.getItem("jwt")
    },
    body:JSON.stringify({
      description:desc,
      city:city,
      dob:dob
    })
  }).then(res=>res.json())
  .then(result=>{
    console.log(result[0])
    localStorage.setItem("user",JSON.stringify({...state,description:result[0].description,city:result[0].city,dob:result[0].dob}))
    dispatch({type:"UPDATEPROFILE",payload:result})
  })
  .catch(err=>console.log(err))
  history.push("/profile")
    M.toast({html:"Updated successfully",classes:"#4caf50 green"})
}

  return(
    <div className="mycard" style={{marginTop:"7%"}}>
    <div className="card auth-card input-field">
    <h2>EditProfile</h2>
    <div>
    <div className="file-field input-field">
    <textarea
    rows="3"
    cols="50"
    type="text"
    placeholder="Description"
    value={desc}
    onChange={(e)=>setDesc(e.target.value.substr(0,150))}
    />
    <input type="date" id="start" name="trip-start"
       value={dob}
       min="1980-01-01" max={year+"-12-31"}
       onChange={(e)=>setDob(e.target.value)}
       placeholder="Date of Birth"
       />
    <input
    type="text"
    placeholder="City"
    value={city}
    onChange={(e)=>setCity(e.target.value)}
    />
    <div style={{backgroundColor:"black",color:"white"}} className="btn waves-effect waves-light">
      <span>Image</span>
      <input type="file" onChange={(e)=>updatePhoto(e.target.files[0])}/>
    </div>
    <div className="file-path-wrapper">
      <input className="file-path validate" type="text"/>
    </div>
    </div>
    <button onClick={()=>PostData()} style={{color:"#279dc8",backgroundColor:"white"}} className="btn waves-effect waves-light">
      <b>upload</b>
    </button>
    </div>
    </div>
    </div>
    )
}

export default EditProfile
