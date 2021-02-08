export const intialState = null

export const reducer =(state,action)=>{
  if(action.type==="USER"){
    return action.payload
  }
  if(action.type==="CLEAR"){
    return null
  }
  if(action.type==="UPDATE"){
    return {
      ...state,
      followers:action.payload.followers,
      following:action.payload.following
    }
  }
  if(action.type==="UPDATEPHOTO"){
    return{
      ...state,
      photo:action.payload
    }
  }
  if(action.type==="UPDATEPROFILE"){
    return{
      ...state,
      description:action.payload.description,
      city:action.payload.city,
      dob:action.payload.dob
    }
  }
  return state
}
