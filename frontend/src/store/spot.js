//* Imports 
import { csrfFetch } from "./csrf";
import { createSelector } from 'reselect';
//* Case Methods
const GET_SPOTS = 'spots/getAllSpots';
// const LOG_OUT = 'session/log-out';
const GET_SPOT_DETAIL = 'spots/:spotId'


//* POJO Action Creators

const getSpots = (spots)=>{
    return({
        type: GET_SPOTS,
        spots
    })
}

const getSpotDetails = (spot) =>{
    return({
        type: GET_SPOT_DETAIL,
        spot
    })
}

// //* Selectors 

export const getSpotsList = createSelector(
    (state) => state.spots,
    (spots) => Object.values(spots)
);
// export const getSpotDetails = createSelector(
//     (state) => state.spot
// )

// export const getSpotObject = createSelector(
//     (state) => state.spots,
//     (spots)=> spots[id]
// )


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

export const getOneSpotThunk = (id) => async(dispatch)=>{
    const response = await csrfFetch(`/api/spots/${id}`)


    if(response.ok){
        const spotData = await response.json()
        // console.log(spotData)
        dispatch(getSpotDetails(spotData))
        
       
        return spotData;
    }else{
        const error = await response.json();
        return error
    }
}


//* Reducer

const initialState = {}

const spotReducer = (state = initialState , action, prevState) =>{
    switch(action.type){
        case GET_SPOTS:{
            const newState ={};
            action.spots.Spots.forEach((spot)=> newState[spot.id] = spot)
            return {...state, ...newState}
        }
        case GET_SPOT_DETAIL:{
            const newSpotState = {}
            const spot = action.spot
            newSpotState[spot.id] = spot;
            return {...state, ...newSpotState}
        }
        default:
            return state
    }

}


export default spotReducer;