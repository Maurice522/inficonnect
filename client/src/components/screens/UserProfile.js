import React,{useEffect,useState,useContext} from 'react'
import {Link,useParams} from 'react-router-dom'
import{UserContext} from '../../App'

const UserProfile = ()=> {
  const{state,dispatch} = useContext(UserContext)
  const{userid} = useParams()
  const[users,setUsers] = useState(state?!state.following.includes(userid):true)
  const[userProfile,setProfile] = useState(null)
  const [showFollow,setShowFollow] =useState(state?!state.following.includes(userid):true)
  useEffect(()=>{
    fetch(`/user/${userid}`)
    .then(res=>res.json())
    .then(result=>{
      setProfile(result)
    })
  },[])

const followUser= ()=>{
  fetch('/follow',{
    method:"put",
    headers:{
      "Content-Type":"application/json",
      "Authorization":"Bearer "+localStorage.getItem("jwt")
    },
    body:JSON.stringify({
      followId:userid
    })
  }).then(res=>res.json())
  .then(data=>{
    console.log(data)
      if(data.following.includes(userid)){
        setUsers(false)
      }
      dispatch({type:"UPDATE",payload:{following:data.following,followers:data.followers}})
      localStorage.setItem("user",JSON.stringify(data))
      setProfile((prevState)=>{
        return{
          ... prevState,
          user:{
            ... prevState.user,
            followers:[...prevState.user.followers,data._id]

          }
        }

      })
      setShowFollow(state?!state.following.includes(userid):true)
  })
}

const unfollowUser= ()=>{
  fetch('/unfollow',{
    method:"put",
    headers:{
      "Content-Type":"application/json",
      "Authorization":"Bearer "+localStorage.getItem("jwt")
    },
    body:JSON.stringify({
      followId:userid
    })
  }).then(res=>res.json())
  .then(data=>{
        console.log(data)
        if(!data.following.includes(userid)){
          setUsers(true)
        }
      dispatch({type:"UPDATE",payload:{following:data.following,followers:data.followers}})
      localStorage.setItem("user",JSON.stringify(data))
      setProfile((prevState)=>{
        const newfollower = prevState.user.followers.filter(item=>item!=data._id)
        return{
        ...prevState,
        user:{
          ...prevState.user,
          followers:newfollower
        }
      }
      })
          setShowFollow(state?!state.following.includes(userid):true)
  })
}


  return(
    <>
    {userProfile ?
      <div className="profile">
  <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css" integrity="sha384-JcKb8q3iqJ61gNV9KGb8thSsNjpSL0n8PARn9HuZOnIxN0hoP+VmmDGMN5t9UJ0Z" crossOrigin="anonymous"/>
  <script src="https://code.jquery.com/jquery-3.5.1.slim.min.js" integrity="sha384-DfXdz2htPH0lsSSs5nCTpuj/zy4C+OGpamoFVy38MVBnE+IbbVYUew+OrCXaRkfj" crossOrigin="anonymous"></script>
    <script src="https://cdn.jsdelivr.net/npm/popper.js@1.16.1/dist/umd/popper.min.js" integrity="sha384-9/reFTGAW83EW2RDu2S0VKaIzap3H66lZH81PoYlFhbGU+6BZp6G7niu735Sk7lN" crossOrigin="anonymous"></script>
    <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.min.js" integrity="sha384-B4gt1jrGC7Jh4AgTPSdUtOBvfO8shuf57BaghqFfPlYxofvL8/KUEfYiJOMMV+rV" crossOrigin="anonymous"></script>
        <div className="">
        <div className="left-side-profile" style={{boxShadow:' 1px 1px 5px 5px  #dcdcdc', position:'fixed', float:'left', textAlign:'center', backgroundColor:'#FFFFFF', paddingLeft:'3.4%', paddingRight:'3.4%', paddingTop:'3.5%', paddingBottom:"3.5%", marginLeft:'8%', width:'21.5%', border:'1px black solid'}}>
          <img src={userProfile.user.photo} style={{width:'100%', height:'200px', padding:'0px', margin:'0px', borderRadius:'10px', border:' 2px solid black'}} alt="" />
          <section style={{textAlign:'justify', marginTop:'10%'}}>
              <p style= {{position:'relative', left: '2px', fontSize:'20px'}}><b>{userProfile.user.username}</b></p>
            <p>{userProfile.user.description}</p>
            <Link to="#">Credentinals</Link>
          </section>

          <div className="credentinals" style={{marginTop:'6%', textAlign:'left'}}>
              <p style= {{position:'relative', left: '2px'}}><i className="fas fa-birthday-cake" ></i> {userProfile.user.dob&&userProfile.user.dob.substr(0,10)}</p>
              <p style= {{position:'relative', left: '2px'}}><i className="fas fa-map-marker-alt"></i> {userProfile.user.city}</p>
              <p style={{fontSize:'15px', position:'relative', left: '2px'}}><i className="fas fa-envelope" style={{marginRight:'1px'}}></i> {userProfile.user.email}</p>
          </div>
        </div>
        <div className="content" style={{boxShadow:' 1px 1px 5px 5px  #dcdcdc', width:'60%', paddingBottom:'10%', backgroundColor:'#FFFFFF',  paddingTop:'4', position:'relative', left:'32%', border:'1px black solid'}}>
        <div style={{backgroundColor:"white",color:"black",textAlign:"center",marginTop:"30px"}}>
          <h2><span style={{marginRight:"50px"}}>{userProfile.user.followers.length} Followers</span><span style={{marginRight:"50px"}}>{userProfile.user.following.length} Following</span><span>{userProfile.posts.length} Posts</span></h2>
          <h5>
          {
            users?
              <button onClick={()=>followUser()} className="btn waves-effect waves-light #03a9f4 light-blue">
              Follow
            </button> :  <button onClick={()=>unfollowUser()} className="btn waves-effect waves-light #03a9f4 light-blue">
                Unfollow
              </button>
            }</h5>

        </div>
        <div className="nav justify-content-center" style={{marginTop:'5%', borderTop:'1px solid #dcdcdc', marginLeft:'8%', marginRight:'10%'}}>
             <Link key="0" className="nav-link prof-post-nav" to="#"><i className="fas fa-th" style={{marginRight:'10px'}} id="toggler-posts"></i>Posts</Link>
             <Link key="1" className="nav-link prof-post-nav" to="#"><i className="fas fa-hashtag" style={{marginRight:'10px'}} id="toggler-tagged"></i>Tagged</Link>
        </div>

        <div className="container" style={{marginTop:'8%', paddingRight:'4%', paddingLeft:'4%'}} id="posts">
           <div className="row">
            {
              userProfile.posts.map(post=>{
                return(
                  <div key={post._id} className="col-md-4">
                    <div className="card mb-4 shadow-sm">
                      <img key={post._id} className="bd-placeholder-img card-img-top" src={post.photo} alt={post.title} />
                      <div className="card-body">
                        <div className="d-flex justify-content-between align-items-center">
                          <div className="btn-group">
                            <button type="button" className="btn btn-sm btn-outline-secondary">View</button>

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
      :
    <h2>loading...</h2>}

    </>
  )
}

export default UserProfile
