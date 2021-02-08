import React,{useState} from 'react'
import {useHistory} from 'react-router-dom'
import M from 'materialize-css'

const CreatePost=()=>{
  const history = useHistory()
  const [title,setTitle] = useState("")
  const [body,setBody] = useState("")
  const [image,setImage] = useState("")
  // const [url,setUrl] = useState("")
  var url;
  const postDetails = ()=>{
      M.toast({html:"Posting...",classes:"#4caf50 green"})
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
      // setUrl(data.url)

      url =data.url
      console.log(url)
      setTimeout(posting,1000)

    })
    .catch(err=>{
      console.log(err)
    })

  function posting(){
    fetch("/createpost",{
      method:"post",
      headers:{
        "content-Type":"application/json",
        "Authorization":"Bearer "+localStorage.getItem("jwt")
      },
      body:JSON.stringify({
        title:title,
        body:body,
        photo:url
      })
    }).then(res=>res.json())
    .then(data=>{
    }).catch(err=>{
      console.log(err)
    })
      console.log("uploaded")
      M.toast({html:"Post uploaded successfully",classes:"#4caf50 green"})
    history.push('/')
  }
}

  return(
    <div className="card input-field" style={{margin:"7% auto", maxWidth:"450px", padding:"20px",textAlign:"center"}}>
      <h3>Create Post</h3>
      <input type="text" placeholder="Title" value={title} onChange={(e)=>setTitle(e.target.value.substr(0,24))}/>
      <input type="text" placeholder="Body" value={body} onChange={(e)=>setBody(e.target.value.substr(0,200))}/>
          <div className="file-field input-field">
          <div style={{backgroundColor:"black"}} className="btn waves-effect waves-light">
            <span>File</span>
            <input type="file" onChange={(e)=>setImage(e.target.files[0])}/>
          </div>
          <div className="file-path-wrapper">
            <input className="file-path validate" type="text"/>
          </div>
          </div>
          <button onClick={()=>postDetails()} style={{color:"#279dc8",backgroundColor:"white"}} className="btn waves-effect waves-light ">
            <b>Post it</b>
          </button>
    </div>
  )
}

export default CreatePost
