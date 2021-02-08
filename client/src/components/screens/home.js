import React,{useState,useEffect,useContext} from 'react'
import {UserContext} from '../../App'
import {Link} from 'react-router-dom'
const Home = ()=>{
  var cmtstyle = "none"
  const [isDDActive,setDDActive] = useState(false)
  const [cmtted,setcmtted] = useState()
  const [cmtid, setcmtid] = useState(1)
  const [data,setData] = useState([])
  const {state,dispatch} = useContext(UserContext)
  const [search,setSearch] = useState('')
  const [userDetails,setUserDetails]= useState([])
  useEffect(()=>{
    fetch('/getsubpost',{
      headers:{"Authorization":"Bearer "+localStorage.getItem("jwt")}
    }).then(res=>res.json())
    .then(result=>{
      setData(result.posts)
      console.log(result)
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
  const makeComment = (text,postId)=>{
    fetch('/comment',{
      method:"put",
      headers:{
        "Content-Type":"application/json",
        "Authorization":"Bearer "+localStorage.getItem("jwt")
      },
      body:JSON.stringify({
        postId:postId,
        text:text
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
      setcmtted("")
      setData(newData)
    }).catch(err=>console.log(err))
  }
  const cmt = (id)=>{
    if(cmtid===id){
      return (cmtstyle="block")
    }else{
      return (cmtstyle="none")
    }
  }
  const deleteComment =(postid,commentid)=>{
    fetch(`/home/deletecomment/${postid}/${commentid}`,{
      method:"delete",
      headers:{
        Authorization:"Bearer "+localStorage.getItem("jwt")
      }
    }).then(res=>res.json())
    .then(result=>{
      setData(result.posts)
      window.location.reload()
    })
  }
  const deletePost =(postId)=>{
    console.log('deleting')
    fetch(`/deletepost/${postId}`,{
      method:"delete",
      headers:{
        "Authorization":"Bearer "+localStorage.getItem("jwt")
      }
    }).then(res=>res.json())
    .then(result=>{
      const newData = data.filter(item=>{
        return item._id !== result._id
      })
      setData(newData)
      window.location.reload()
    })
  }
  const fetchUsers = (query)=>{
    setSearch(query)
    fetch('/search-users',{
      method:"post",
      headers:{
        "Content-Type":"application/json"
      },
      body:JSON.stringify({
        query:query
      })
    }).then(res=>res.json())
    .then(results=>{
      setUserDetails(results.user)
    })
  }
  return(
    <div className="home">
    {
      data.map(item=>{
        return(
          <div key="1">
          <div key="2">

          <ul style={{float:"left", position:"fixed",backgroundColor:"white",borderRight:"solid #DCDCDC 1px",width:"25%"}} className="nav flex-column">
            <li className="nav-item" style={{marginTop:"5%"}}>
              <Link className="nav-link" to="/"><i className="fas fa-home"> </i> Home</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="#"><i className="fas fa-book"> </i> Courses</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="#"><i className="fas fa-calendar-alt"> </i> Events</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="#"><i className="fas fa-chart-line"> </i> Career</Link>
            </li>
            <li className="nav-item" style={{marginBottom:"70%"}}>
              <Link className="nav-link" to="#"><i className="fas fa-ellipsis-h"> </i> More</Link>
            </li>
          </ul>

          </div>
          <div>
          <ul style={{position:"fixed", left:"75%",backgroundColor:"white",borderLeft:"solid #DCDCDC 1px",width:"25%"}} className="nav flex-column">
            <li className="nav-item" style={{marginTop:"5%"}}>
            <input
            type="text"
            placeholder="Search"
            value={search}
            onChange={(e)=>fetchUsers(e.target.value)}
            onClick={()=>isDDActive?setDDActive(false):setDDActive(true)}
            />
            <button  className="btn waves-effect waves-light" style={{position:"absolute", top:"2.5%", right:"7%", color:"#279dc8",backgroundColor:"white", boxShadow:"none" }} onClick={()=>{
              setDDActive(false)
              setSearch("") }}>
            <i className="material-icons">close</i>
            </button>
            <div style={isDDActive?{display:"block"}:{display:"none"}}>
            <ul className="collection">
            {userDetails.map(item=>{
              return <Link to ={item._id !== state._id?"/profile/"+item._id:"/profile"} onClick={()=>{setSearch("")}}>
                <li key={item._id} style={{color:"black"}} className="collection-item">
                <img src={item.photo} style={{width:"30px",borderRadius:"20px"}} />
                <span style={{marginLeft:"4px", position:"relative",bottom:"7px"}}> {item.username} </span></li> </Link>
            })}
            </ul>
            </div>
            </li>
            <li className="nav-item">
            <div style={{textAlign:"center"}}>
            <h6>Suggestions to follow</h6>
            <ul style={{padding:"5%"}}>
              <li style={{padding:"5%"}}>
              Wear Elon mask
              </li>
              <li style={{padding:"5%"}}>
              Wear Elon mask
              </li>
              <li style={{padding:"5%"}}>
              Wear Elon mask
              </li>
              <li style={{padding:"5%"}}>
              Wear Elon mask
              </li>
              <li style={{paddingBottom:"800%",paddingTop:"75%"}} >
              &copy; <strong>InfiConnect</strong> 2020
              </li>
            </ul>

            </div>
            </li>
          </ul>
          </div>

          <div className="card home-card" key={item._id}>
            <h5><Link to ={item.postedBy._id === state._id?"/profile":"/profile/"+item.postedBy._id}><img src={item.postedBy.photo} style={{width:"30px",borderRadius:"20px",marginLeft:"10px"}} /> <span style={{position:"relative",bottom:"-2px"}}>{item.postedBy.username}</span></Link> {item.postedBy._id === state._id &&<i className="fas fa-trash" style={{float:"right",marginRight:"10px", position:"relative",bottom:"-5px"}} onClick={()=>deletePost(item._id)}></i>}</h5>
            <div className="card-image">
              <img src={item.photo}/>
            </div>
            <div className="card-content input-field">
            {state?item.likes.includes(state._id)?
              <span><span className="numbers" style={{position:"relative",bottom:"4px",fontSize:"22px"}}>{item.likes.length} </span><i className="fas fa-handshake" style={{fontSize:"24px"}} onClick={()=>{unlikePost(item._id)}}></i></span>
              :
              <span><span className="numbers" style={{position:"relative",bottom:"4px",fontSize:"22px"}}>{item.likes.length} </span><i className="fas fa-handshake" style={{fontSize:"24px"}} onClick={()=>{likePost(item._id)}}></i></span>:<h1>Loading...</h1>}
                <span><span className="numbers" style={{marginLeft:"20px",position:"relative",bottom:"4px",fontSize:"22px"}}>{item.comments.length} </span><i className="fas fa-comment" style={{fontSize:"24px"}} onClick={()=>{setcmtid(item._id)}}></i></span>
              <h6>
              </h6>
              <h6><b>{item.title}</b> - {item.body}</h6>

              <div className="commentbox" style={{display:cmt(item._id)}} >
              {
                item.comments.map(record=>{
                  return(
                    <h6 key = {record._id}><span><b>{record.postedBy.username}</b></span> {record.text}{record.postedBy._id === state._id &&< i className="fas fa-trash" style={{float:"right"}} onClick={()=>deleteComment(item._id,record._id)}></i>} </h6>
                  )
                })
              }
              </div>
              <form onSubmit={(e)=>{e.preventDefault()
                makeComment(e.target[0].value,item._id)
              }}>
              <input type="text" value={cmtted} onChange={()=>{setcmtid(item._id)}} placeholder="Comment..."/>
              </form>
            </div>
          </div>

        </div>

        )
      })
    }

    </div>

  )
}
export default Home
