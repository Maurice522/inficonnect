import React,{useEffect,createContext,useReducer,useContext} from 'react'
import Navbar from './components/navbar'
import "./App.css"
import {BrowserRouter,Route,Switch,useHistory} from 'react-router-dom'
import Home from './components/screens/home'
import Discover from './components/screens/discover'
import Signin from './components/screens/signin'
import Profile from './components/screens/profile'
import EditProfile from './components/screens/editprofile'
import Signup from './components/screens/signup'
import CreatePost from './components/screens/createpost'
import Reset from './components/screens/reset'
import Newpass from './components/screens/newpass'
import {reducer,intialState} from './reducers/userReducer'
import UserProfile from './components/screens/UserProfile'
import Login from './components/Login'
import useLocalStorage from './hooks/useLocalStorage'
import Dashboard from './components/Dashboard'
import {ContactsProvider} from './contexts/ContactsProvider'
import {ConversationsProvider} from './contexts/ConversationsProvider'
import {SocketProvider} from './contexts/SocketProvider'
import ChangePassword from './components/screens/changepassword'

export const UserContext = createContext()

const Routing = ()=>{
  const history = useHistory()
  const {state,dispatch} = useContext(UserContext)
  useEffect(()=>{
    const user = JSON.parse(localStorage.getItem("user"))
    if(user){
      dispatch({type:"USER",payload:user})
    }else{
      if(!history.location.pathname.startsWith('/reset'))
      history.push('/signin')
    }
  },[])
  const [id, setId] = useLocalStorage('id')
  // const dashboard = (
  //   <SocketProvider id={id}>
  //     <ContactsProvider>
  //       <ConversationsProvider id={id}>
  //         <Dashboard id={id} />
  //       </ConversationsProvider>
  //     </ContactsProvider>
  //   </SocketProvider>
  // )

  return(
    <Switch>
    <Route exact path = "/">
      <Home />
    </Route>
    <Route path = "/signin">
      <Signin />
    </Route>
    <Route path = "/discover">
      <Discover />
    </Route>
    <Route path = "/signup">
      <Signup />
    </Route>
    <Route exact path = "/profile">
      <Profile />
    </Route>
    <Route path = "/create">
      <CreatePost />
    </Route>
    <Route path = "/profile/:userid">
      <UserProfile />
    </Route>
    <Route path = "/editprofile">
      <EditProfile />
    </Route>
    <Route exact path = "/reset">
      <Reset />
    </Route>
    <Route path = "/reset/:token">
      <Newpass />
    </Route>
    <Route path ="/message">
    <>{state&&<SocketProvider id={state._id}>
      <ContactsProvider>
        <ConversationsProvider id={state._id}>
          <Dashboard id={state._id} />
        </ConversationsProvider>
      </ContactsProvider>
    </SocketProvider>}</>
    </Route>
    <Route path="/changepassword">
    <ChangePassword />
    </Route>
    </Switch>
  )
}

function App() {
  const [state,dispatch] = useReducer(reducer,intialState)

  return (
    <UserContext.Provider value={{state,dispatch}}>
    <BrowserRouter>
    <Navbar />
    <Routing />
    </BrowserRouter>
    </UserContext.Provider>
  );
}

export default App;
