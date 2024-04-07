
import { csrfFetch } from "./csrf";



const LOG_IN = 'session/log-in';
const LOG_OUT = 'session/log-out';


// Two POJO Action Creators
const logInUser = (user) => {
    return {
        type: LOG_IN,
        payload:user
    }
}


const logOutUser = ()=>{
    return({
        type: LOG_OUT
    })
    
}

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
    dispatch(logInUser(userData.user));
    return response

}


// add a sessionReducer
const initialState = { user: null }

const sessionReducer = (state = initialState, action)=>{
    switch (action.type){
        case LOG_IN:{
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