
import { csrfFetch } from "./csrf";



const SET_USER = 'session/log-in';
const LOG_OUT = 'session/log-out';


// RESTORE is to continue to make sure the login page, once a user is logged in, will redirect them to the home page
//How to Restore:
// Load application after accessing the GET route to obtain the session user
// add the user info to the Redux store again


// POJO Action Creators

// setUser is for logging in and persisting the log in throughout refreshes and navigation
const setUser = (user) => {
    return {
        type: SET_USER,
        payload:user
    }
}



const logOutUser = ()=>{
    return({
        type: LOG_OUT
    })
    
}

// REDUX Thunk Actions

export const logInUserThunk = (user) => async (dispatch) =>{
    const {credential, password} = user;
    const response = await csrfFetch('/api/session',{
        method: 'POST',
        body:JSON.stringify({
            credential,
            password
        })
    })
    // const logInData = await response.json();
    // await dispatch(logInUser(logInData))
    // return response


    const userData = await response.json();
    dispatch(setUser(userData.user));
    return response

}

export const restoreUserThunk = () => async (dispatch)=>{
    // Why do I not need to specify method and a body to return 
    const response = await csrfFetch('/api/session');
    console.log(response)
    const data = await response.json()
    console.log("DATA",data)
    dispatch (setUser(data.user))
    return response
}








// add a sessionReducer
const initialState = { user: null }

const sessionReducer = (state = initialState, action)=>{
    switch (action.type){
        case SET_USER:{
            return {...state, user:action.payload}
        }
        case LOG_OUT:{
            return {...state, user:null}
        }
        default:{
            return state;
        }
    }

}

export default sessionReducer;