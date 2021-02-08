import React,{useEffect,useState,useContext} from 'react'
import {Link} from 'react-router-dom'
import{UserContext} from '../../App'
import {Modal} from 'react-bootstrap'

const Profile = ()=> {
  const[isModalActive, setModalActive] = useState(false)
  const[mypics,setPics] = useState([])
  const{state,dispatch} = useContext(UserContext)
  const [src, setSrc] = useState()
  const [likes, setLikes] = useState({})
  const [comments, setComments] = useState({})
  const [data,setData] = useState([])
  const [id,setId]= useState()
  useEffect(()=>{
    fetch('/mypost',{
      headers:{
        "Authorization":"Bearer "+localStorage.getItem("jwt")
      }
    })
    .then(res=>res.json())
    .then(result=>{
      setPics(result.mypost)
      // window.location.reload()
    })
  },[])

  const likePost =(id)=>{
    fetch('/like',{
      method:"put",
      headers:{
        "Content-Type":"application/json",
        "Authorization":"Bearer "+localStorage.getItem("jwt")
      },
      body:JSON.stringify({
        postId:id
      })
    }).then(res=>res.json())
    .then(result=>{
      const newData =data.map(item=>{
        if(item._id===result._id){
          return result
        }else{
          return item
        }
      })
      setData(newData)
    }).catch(err=>console.log(err))
  }
  const unlikePost =(id)=>{
    fetch('/unlike',{
      method:"put",
      headers:{
        "Content-Type":"application/json",
        "Authorization":"Bearer "+localStorage.getItem("jwt")
      },
      body:JSON.stringify({
        postId:id
      })
    }).then(res=>res.json())
    .then(result=>{
      const newData =data.map(item=>{
        if(item._id===result._id){
          return result
        }else{
          return item
        }
      })
      setData(newData)
    }).catch(err=>console.log(err))
  }


  return(
    <div className="profile">
<link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css" integrity="sha384-JcKb8q3iqJ61gNV9KGb8thSsNjpSL0n8PARn9HuZOnIxN0hoP+VmmDGMN5t9UJ0Z" crossOrigin="anonymous"/>
<script src="https://code.jquery.com/jquery-3.5.1.slim.min.js" integrity="sha384-DfXdz2htPH0lsSSs5nCTpuj/zy4C+OGpamoFVy38MVBnE+IbbVYUew+OrCXaRkfj" crossOrigin="anonymous"></script>
  <script src="https://cdn.jsdelivr.net/npm/popper.js@1.16.1/dist/umd/popper.min.js" integrity="sha384-9/reFTGAW83EW2RDu2S0VKaIzap3H66lZH81PoYlFhbGU+6BZp6G7niu735Sk7lN" crossOrigin="anonymous"></script>
  <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.min.js" integrity="sha384-B4gt1jrGC7Jh4AgTPSdUtOBvfO8shuf57BaghqFfPlYxofvL8/KUEfYiJOMMV+rV" crossOrigin="anonymous"></script>
      <div className="">
      <div className="left-side-profile" style={{boxShadow:' 1px 1px 5px 5px  #dcdcdc', position:'fixed', float:'left', textAlign:'center', backgroundColor:'#FFFFFF', paddingLeft:'3.4%', paddingRight:'3.4%', paddingTop:'2.5%', paddingBottom:"2%", marginLeft:'8%', width:'21%', border:'1px black solid'}}>
        <img src={state?state.photo:"https://res.cloudinary.com/infieq/image/upload/v1601682393/nouser_gfgmc3.png"} style={{width:'100%', height:'200px', padding:'0px', margin:'0px', borderRadius:'10px', border:' 2px solid black'}} alt="" />
        <section style={{textAlign:'justify', marginTop:'10%'}}>
            <p style= {{marginBottom:"1%",position:'relative', left: '1px', fontSize:'20px'}}><b>{state?state.username:"loading"}</b></p>
          <p>{state?state.description?state.description:"Add your description":"loading"}</p>
          <Link to="#">Credentinals</Link>
        </section>

        <div className="credentinals" style={{marginTop:'6%', textAlign:'left'}}>
            <p style= {{position:'relative', left: '2px'}}><i className="fas fa-birthday-cake" ></i> {state?state.dob?state.dob.substr(0,10):"Add your Date of birth":"loading"}</p>
            <p style= {{position:'relative', left: '2px'}}><i className="fas fa-map-marker-alt"></i> {state?state.city?state.city:"Add your city":"loading"}</p>
            <p style={{fontSize:'15px', position:'relative', left: '2px'}}><i className="fas fa-envelope" style={{marginRight:'1px'}}></i>{state?state.email:"loading"}</p>
              <Link type="button" className="btn" name="popup" to="/editprofile" style={{ backgroundColor:'black', color:'white', marginTop:'2%', padding:'3%', width:'100%'}}>Edit profile</Link>
        </div>
      </div>
      <div className="content" style={{boxShadow:' 1px 1px 5px 5px  #dcdcdc', width:'60%', paddingBottom:'10%', backgroundColor:'#FFFFFF',  paddingTop:'4', position:'relative', left:'32%', border:'1px black solid'}}>
      <div style={{backgroundColor:"white",color:"black",textAlign:"center",marginTop:"30px"}}>
        <h2><span style={{marginRight:"50px"}}>{state?state.followers.length:"0"} Followers</span><span style={{marginRight:"50px"}}>{state?state.following.length:"0"} Following</span><span>{mypics.length} Posts</span></h2>
      </div>
      <div className="nav justify-content-center" style={{marginTop:'5%', borderTop:'1px solid #dcdcdc', marginLeft:'8%', marginRight:'10%'}}>
           <Link key="0" className="nav-link prof-post-nav" to="#"><i className="fas fa-th" style={{marginRight:'10px'}} id="toggler-posts"></i>Posts</Link>
           <Link key="1" className="nav-link prof-post-nav" to="#"><i className="fas fa-hashtag" style={{marginRight:'10px'}} id="toggler-tagged"></i>Tagged</Link>
      </div>

      <div className="container" style={{marginTop:'8%', paddingRight:'4%', paddingLeft:'4%'}} id="posts">
         <div className="row">
          {
            mypics.map(post=>{
              return(
                <div key={post._id} className="col-md-4">
                  <div className="card mb-4 shadow-sm">
                    <img key={post._id} className="bd-placeholder-img card-img-top" src={post.photo} alt={post.title} />
                    <div className="card-body">
                      <div className="d-flex justify-content-between align-items-center">
                        <div className="btn-group">
                          <button type="button" onClick={()=>{setModalActive(true)
                            setSrc(post.photo)
                            setLikes(post.likes)
                            setComments(post.comments)
                            setId(post._id)

                          }} className="btn btn-sm" style={{border:"1px solid #279dc8", color:"#279dc8"}}>View</button>
                          <Modal style={{maxWidth:"35%",top:"10%", maxHeight:"665px"}} show={isModalActive}>
                            <Modal.Header>
                                  <h5><Link to ={post.postedBy._id === state._id?"/profile":"/profile/"+post.postedBy._id}><img src={post.postedBy.photo} style={{width:"30px",borderRadius:"20px",marginLeft:"10px"}} /> <span style={{position:"relative",bottom:"-2px"}}>{post.postedBy.username}</span></Link></h5>
                            </Modal.Header>
                            <Modal.Body>
                              <img key={post._id} className="bd-placeholder-img card-img-top" src={src} alt={post.title}/>
                              {state?post.likes.includes(state._id)?
                                <span><span className="numbers" style={{position:"relative",bottom:"4px",fontSize:"22px"}}>{likes.length} </span><i className="fas fa-handshake" style={{fontSize:"24px"}} onClick={()=>{unlikePost(id)}}></i></span>
                                :
                                <span><span className="numbers" style={{position:"relative",bottom:"4px",fontSize:"22px"}}>{likes.length} </span><i className="fas fa-handshake" style={{fontSize:"24px"}} onClick={()=>{likePost(id)}}></i></span>:<h1>Loading...</h1>}
                                  <span><span className="numbers" style={{marginLeft:"20px",position:"relative",bottom:"4px",fontSize:"22px"}}>{comments.length} </span><i className="fas fa-comment" style={{fontSize:"24px"}}></i></span>
                                <h6>
                                </h6>
                            </Modal.Body>
                            <button  className="btn waves-effect waves-light" style={{position:"absolute", top:"6%", right:"6%", color:"#279dc8",backgroundColor:"white", boxShadow:"none" }} onClick={()=>setModalActive(false)}>
                            <i class="material-icons">close</i>
                            </button>


                          </Modal>
                        </div>
                        <small className="text-muted">{post.createdAt.substr(0,10)}</small>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })
          }


           </div>
        </div>
        </div>
      </div>
    </div>
  )
}

export default Profile
