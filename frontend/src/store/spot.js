//* Imports 
import { csrfFetch } from "./csrf";
import { createSelector } from 'reselect';
//* Case Methods
const GET_SPOTS = 'spots/getAllSpots';
// const LOG_OUT = 'session/log-out';


//* POJO Action Creators

const getSpots = (spots)=>{
    return({
        type: GET_SPOTS,
        spots
    })
}

// //* Selectors 

export const getSpotsList = createSelector(
    (state) => state.spots,
    (spots) => Object.values(spots)
);



//* Thunk Actions

export const getAllSpotsThunk = () => async(dispatch)=>{
    const response = await csrfFetch('/api/spots')

    if(response.ok){
        const spotData = await response.json()
        dispatch(getSpots(spotData))
        return spotData;
    }else{
        const error = await response.json();
        return error
    }
}



//* Reducer

const initialState = {}

const spotReducer = (state = initialState, action) =>{
    switch(action.type){
        case GET_SPOTS:{
            const newState ={};
            action.spots.Spots.forEach((spot)=> newState[spot.id] = spot)
            return newState
        }
        default:
            return state
    }

}


export default spotReducer;