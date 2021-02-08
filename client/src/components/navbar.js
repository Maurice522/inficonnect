import React,{useContext,useRef,useEffect,useState,useCallback} from "react"
import {Link, useHistory} from "react-router-dom"
import {UserContext} from '../App'
import M from 'materialize-css'
import {CSSTransition} from 'react-transition-group'
import io from 'socket.io-client'
import { Form, InputGroup, Button } from 'react-bootstrap'
const Navbar = ()=>{
  // const [contacts, setContacts] = useState([])
  const [msgBox, setMsgBox] =useState(false)
  const [menuHeight, setMenuHeight] =useState(null);
  const [activeMenu, setActiveMenu] = useState('main');
  const [open, setOpen] = useState(false);
  const [msgBar, setMsgBar] = useState(false);
  const [userDetails,setUserDetails]= useState([])
  const searchModal = useRef(null)
  const [search,setSearch] = useState('')
  const {state,dispatch} = useContext(UserContext)
  const history = useHistory()
  const [contacts,setContacts] = useState([])
  const [id,setId]=useState()
  const [name,setName]=useState()
  const [img,setImg]=useState()
  const [msg, setMsg]=useState()
  const [conversation, setConversation] = useState()
  const [text, setText] = useState('')
  const setRef = useCallback(node => {
    if (node) {
      node.scrollIntoView({ smooth: true })
    }
  }, [])
  useEffect(()=>{
    var socket = io.connect('http://localhost:3000')
    M.Modal.init(searchModal.current)
  },[])

const getcontacts=()=>{
  fetch('/contacts',{
    headers:{"Authorization":"Bearer "+localStorage.getItem("jwt")}
  })
  .then(res=>res.json())
  .then(result=>{
    setContacts(result.contacts)
    contacts.map(contact=>{console.log(contact._id)})
  })
}

const getconversation=(id)=>{
  fetch('/conversation',{
    method:"post",
    headers:{
        "Content-Type":"application/json",
      "Authorization":"Bearer "+localStorage.getItem("jwt")},
      body:JSON.stringify({
        recipient:id
  })
}).then(res=>res.json())
.then(result=>{
  setConversation(result)
  })
}


const SendMessage =(id,msg)=>{

  fetch('/message',{
    method:"post",
    headers:{
        "Content-Type":"application/json",
      "Authorization":"Bearer "+localStorage.getItem("jwt")},
      body:JSON.stringify({
        recipient:id,
        text:msg
  })
}).then(res=>res.json())
.then(result=>{
  setText("")
  setConversation(result)
})
}

  const renderList = ()=>{
    if(state){
      return [
        <li key="5">
         <i data-target="modal1" className="large material-icons modal-trigger">search</i>
        </li>,
        <li key="6">
          <Link  to="/discover" className="hover"><i className="fas fa-compass" style={{fontSize:"16px"}}> </i> Discover</Link>
        </li>,
        <li key="2"><Link to="/create"  className="hover"><i className="fas fa-paper-plane" style={{fontSize:"16px"}}></i> Post</Link></li>,
        <li key="3"><a
        onClick={()=> {setMsgBar(!msgBar)
        getcontacts() }}
        className="icon-button" style={{marginTop:"17px"}}><i className="fas fa-comment-dots" style={{fontSize:"18px"}}></i></a>
        {msgBar && <div className="msgbar" style={{ height: "700px"}}>
          <CSSTransition in ={activeMenu === 'main'} unmountOnExit timeout={500} classNames="menu-primary">
          <div className="menu">
          <a className="menu-header"><h3 style={{marginLeft:"60px", marginBottom:"50px"}}>Messages</h3><span className="icon-right" style={{right:"10px"}} onClick={()=>setMsgBar(!msgBar)}><i className="fas fa-times"></i></span></a>
          {contacts.map(contact=><h6 className="menu-item" onClick={()=>{
            setActiveMenu("msgbox")
            setId(contact._id)
            setName(contact.username)
            setImg(contact.photo)
            getconversation(contact._id)
        }}  ><span style={{marginRight:"10px"}} className="icon-button"><img src={contact.photo} alt="profile" style={{width:"30px",borderRadius:"20px",marginRight:"5px"}}/></span> {contact.username}<span className="icon-right"></span></h6>)}
          </div>
          </CSSTransition>
            <CSSTransition in ={activeMenu === 'msgbox'} unmountOnExit timeout={500} classNames="menu-secondary">
            <div className="menu">
             <a className="menu-item" onClick={()=>setActiveMenu('main')}><span className="icon-button"><i className="fas fa-arrow-left"></i></span> <h5 style={{position:"relative", top:"-5px", right:"-5px"}}> {name}</h5><span className="icon-right"></span></a>
             <div className="menu-item" className="flex-grow-1 overflow-auto" style={{width:"100%",height:"550px",paddingTop:"20px" ,backgroundColor:"#DCDCDC",borderRadius:"5%"}}>
             <div className="flex-grow-1 overflow-auto">
             <div className="d-flex flex-column align-items-start justify-content-end px-3">
           {conversation&&conversation.messages.map((message, index) => {
             const lastMessage = conversation.messages.length - 1 === index
             return (
               <div
               ref={lastMessage ? setRef : null}
                 key={index}
                 className={`my-1 d-flex flex-column ${message.sender===state._id ? 'align-self-end align-items-end' : 'align-items-start'}`}
               >
                 <div
                   className={`rounded px-2 py-1 ${message.sender===state._id ? 'bg-primary text-white' : 'black'}`}>
                   {message.text}
                 </div>
               </div>
             )
           })}
         </div>
       </div>

     </div>
     <Form onSubmit={(e)=>e.preventDefault()}>
       <Form.Group className="m-2">
         <InputGroup>
           <Form.Control
             as="textarea"
             required
             value={text}
             onChange={e => setText(e.target.value)}
             style={{ height: '50px', resize: 'none' }}
           />
           <InputGroup.Append>
             <Button style={{marginTop:"8px"}} onClick={()=>SendMessage(id,text)}>Send</Button>
           </InputGroup.Append>
         </InputGroup>
       </Form.Group>
     </Form>
             </div>

            </CSSTransition>

          <CSSTransition in ={activeMenu === 'settings'} unmountOnExit timeout={500} classNames="menu-secondary">
          <div className="menu">
          <a className="menu-item" onClick={()=>setActiveMenu('main')}><span className="icon-button"><i className="fas fa-arrow-left"></i></span> <h4 style={{position:"relative", top:"-6px", right:"-5px"}}> Settings</h4><span className="icon-right"></span></a>
          <Link to="/editprofile"
          onClick={()=>{setOpen(!open)
            setActiveMenu('main')}}
            className="menu-item"><span style={{marginRight:"10px"}} className="icon-button"><i style={{fontSize:"15px"}} className="fas fa-user-edit"></i></span> Edit profile<span className="icon-right"></span></Link>
          <Link to="/changepassword"
          onClick={()=>{setOpen(!open)
            setActiveMenu('main')}}
            className="menu-item"><span style={{marginRight:"10px"}} className="icon-button"><i style={{fontSize:"15px"}}  className="fas fa-key"></i></span> Change Password<span className="icon-right"></span></Link>
          <a className="menu-item"><span style={{marginRight:"10px"}} className="icon-button"><i style={{fontSize:"15px"}}  className="fas fa-language"></i></span> Language<span className="icon-right"></span></a>
          </div>
          </CSSTransition>
          <CSSTransition in ={activeMenu === 'help'} unmountOnExit timeout={500} classNames="menu-secondary">
          <div className="menu">
          <a className="menu-item" onClick={()=>setActiveMenu('main')}><span className="icon-button"><i className="fas fa-arrow-left"></i></span> <h5 style={{position:"relative", top:"-5px", right:"-5px"}}> Help & support</h5><span className="icon-right"></span></a>
          <a className="menu-item"><span style={{marginRight:"10px"}} className="icon-button"><i style={{fontSize:"15px"}} className="fas fa-question-circle"></i></span> Help center<span className="icon-right"></span></a>
          <a className="menu-item"><span style={{marginRight:"10px"}} className="icon-button"><i style={{fontSize:"15px"}}  className="fas fa-envelope"></i></span> Support inbox<span className="icon-right"></span></a>
            <a className="menu-item"><span style={{marginRight:"10px"}} className="icon-button"><i style={{fontSize:"15px"}}  className="fas fa-exclamation"></i></span> Report a problem<span className="icon-right"></span></a>
          </div>
          </CSSTransition>
        </div>
        }

        </li>,
        <li key="7" className="navddli">
          <a className="icon-button" onClick={()=> setOpen(!open)}>{open?<i className="fas fa-caret-up"></i> :<i className="fas fa-caret-down"></i>}</a>
          {open && <div className="dropdown" style={{ height: "240px"}}>
            <CSSTransition in ={activeMenu === 'main'} unmountOnExit timeout={500} classNames="menu-primary">
            <div className="menu">
            <Link to="/profile" onClick={()=>setOpen(!open)} className="menu-item"><span style={{marginRight:"10px"}} className="icon-button"><i className="fas fa-user"></i></span>My profile<span className="icon-right"></span></Link>
            <Link className="menu-item" onClick={()=>setActiveMenu('settings')}><span style={{marginRight:"10px"}} className="icon-button"><i style={{fontSize:"20px"}} className="fas fa-cog"></i></span>Settings<span className="icon-right"><i className="fas fa-caret-right"></i></span></Link>
            <Link className="menu-item" onClick={()=>setActiveMenu('help')}><span style={{marginRight:"10px"}} className="icon-button"><i style={{fontSize:"20px"}} className="fas fa-question-circle"></i></span>Help & support<span className="icon-right"><i className="fas fa-caret-right"></i></span></Link>
            <Link onClick={()=>{
               setOpen(!open)
              localStorage.clear()
              dispatch({type:"Clear"})
              history.push('/signin')
              window.location.reload()
            }} className="menu-item"><span style={{marginRight:"10px"}} className="icon-button"><i style={{fontSize:"15px"}} className="fas fa-door-closed"></i></span>Logout<span className="icon-right"></span></Link>
            </div>
            </CSSTransition>
            <CSSTransition in ={activeMenu === 'settings'} unmountOnExit timeout={500} classNames="menu-secondary">
            <div className="menu">
            <Link className="menu-item" onClick={()=>setActiveMenu('main')}><span className="icon-button"><i className="fas fa-arrow-left"></i></span> <h4 style={{position:"relative", top:"-6px", right:"-5px"}}> Settings</h4><span className="icon-right"></span></Link>
            <Link to="/editprofile"
            onClick={()=>{setOpen(!open)
              setActiveMenu('main')}}
              className="menu-item"><span style={{marginRight:"10px"}} className="icon-button"><i style={{fontSize:"15px"}} className="fas fa-user-edit"></i></span> Edit profile<span className="icon-right"></span></Link>
            <Link to="/changepassword"
            onClick={()=>{setOpen(!open)
              setActiveMenu('main')}}
              className="menu-item"><span style={{marginRight:"10px"}} className="icon-button"><i style={{fontSize:"15px"}}  className="fas fa-key"></i></span> Change Password<span className="icon-right"></span></Link>
            <Link className="menu-item"><span style={{marginRight:"10px"}} className="icon-button"><i style={{fontSize:"15px"}}  className="fas fa-language"></i></span> Language<span className="icon-right"></span></Link>
            </div>
            </CSSTransition>
            <CSSTransition in ={activeMenu === 'help'} unmountOnExit timeout={500} classNames="menu-secondary">
            <div className="menu">
            <Link className="menu-item" onClick={()=>setActiveMenu('main')}><span className="icon-button"><i className="fas fa-arrow-left"></i></span> <h5 style={{position:"relative", top:"-5px", right:"-5px"}}> Help & support</h5><span className="icon-right"></span></Link>
            <Link className="menu-item"><span style={{marginRight:"10px"}} className="icon-button"><i style={{fontSize:"15px"}} className="fas fa-question-circle"></i></span> Help center<span className="icon-right"></span></Link>
            <Link className="menu-item"><span style={{marginRight:"10px"}} className="icon-button"><i style={{fontSize:"15px"}}  className="fas fa-envelope"></i></span> Support inbox<span className="icon-right"></span></Link>
              <Link className="menu-item"><span style={{marginRight:"10px"}} className="icon-button"><i style={{fontSize:"15px"}}  className="fas fa-exclamation"></i></span> Report a problem<span className="icon-right"></span></Link>
            </div>
            </CSSTransition>
          </div>}
        </li>
      ]
    }else{
      return [

        <li key="0"><Link to="/signin">Signin</Link></li>,
        <li key="1"><Link to="/signup">Signup</Link></li>

      ]
    }
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
    <div className="navbar-fixed">
    <nav style={{backgroundColor:"black"}}>
    <div className="nav-wrapper">
      <Link to={state?"/":"/signin"} className="brand-logo"><img src="/images/inficonnect_blackbg_noicon.jpg" width="30%"/></Link>
      <ul id="nav-mobile" className="right navdd">
        {renderList()}
      </ul>
    </div>
          <div id="modal1" className="modal" ref={searchModal} style={{color:"black", maxWidth:"700px", height:"450px"}}>
          <div className="modal-content">
          <input
          type="text"
          placeholder="Search username"
          value={search}
          onChange={(e)=>fetchUsers(e.target.value)}
          />
          <ul className="collection">
          {userDetails.map(item=>{
            return <Link to ={item._id !== state._id?"/profile/"+item._id:"/profile"} onClick={()=>{
              M.Modal.getInstance(searchModal.current).close()
              setSearch("")
            }}> <li key={item._id} style={{color:"black"}} className="collection-item"><img src={item.photo} style={{width:"30px",borderRadius:"20px"}} /> <span style={{marginLeft:"4px", position:"relative",bottom:"7px"}}> {item.username} </span></li> </Link>
          })}
          </ul>
          </div>
          <div className="modal-footer">
            <button className="modal-close waves-effect waves-green btn-flat" onClick={()=>setSearch("")}>Close</button>
          </div>
        </div>
  </nav>
  </div>
  )
}

export default Navbar
