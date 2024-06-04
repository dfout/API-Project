//* Imports 
import { csrfFetch } from "./csrf";
import { createSelector, createStructuredSelector } from 'reselect';
//* Case Methods
const GET_SPOTS = 'spots/getAllSpots';
// const LOG_OUT = 'session/log-out';
const GET_SPOT_DETAIL = 'spots/:spotId'
const SET_SPOT_IMAGES = 'spots/images'
const UPDATE_SPOT = 'spots/:spotId/update'
const DELETE_SPOT = "/spots/:spotId/delete"


//* POJO Action Creators

const getSpots = (spots) => {
    return ({
        type: GET_SPOTS,
        spots
    })
}

const getSpotDetails = (spot) => {
    return ({
        type: GET_SPOT_DETAIL,
        spot
    })
}

const setImages = (image) => {
    return ({
        type: SET_SPOT_IMAGES,
        image
    })
}

const updateSpot = (spot) =>{
    return ({
        type: UPDATE_SPOT,
        spot
    })
}
const deleteSpot = (spot) =>{
    return({
        type: DELETE_SPOT,
        spot
    })
}

// //* Selectors 

export const getSpotsList = createSelector(
    (state) => state.spots,
    (spots) => Object.values(spots)
);






//* Thunk Actions

export const getAllSpotsThunk = () => async (dispatch) => {
    const response = await csrfFetch('/api/spots')

    if (response.ok) {
        const spotData = await response.json()
        dispatch(getSpots(spotData))
        return spotData;
    } else {
        const error = await response.json();
        return error
    }
}

export const getOneSpotThunk = (id) => async (dispatch) => {
    const response = await csrfFetch(`/api/spots/${id}`)


    if (response.ok) {
        const spotData = await response.json()
        // console.log(spotData)
        dispatch(getSpotDetails(spotData))


        return spotData;
    } else {
        const error = await response.json();
        return error
    }
}

export const createSpotThunk = (spot) => async (dispatch) => {
    const { address, city, state, country, lat, lng, name, description, price, previewImage, SpotImages } = spot;
    // try {
        const response = await csrfFetch('/api/spots', {
            method: 'POST',
            body: JSON.stringify({
                address,
                city,
                state,
                country,
                lat,
                lng,
                name,
                description,
                price,
                previewImage, 
                SpotImages
            })
        });

        if (response.ok) {
            const data = await response.json();
            dispatch(getSpotDetails(data));
            return data
        } else {
            const error = await response.json();
            return error;
        }
    // } catch (error) {
    //     const err = await error.json()
    //     return err
    // }
}

// ManageSpots 
export const userSpotsThunk = () => async(dispatch) =>{
    const response = await csrfFetch('/api/spots/current');
    if (response.ok) {
        const spotData = await response.json()
      
        dispatch(getSpots(spotData))
        //SpotData as of now, is: {Spots: [{}, {}, {}]}
    
        return spotData;
    } else {
        const error = await response.json();
        return error
    }

}
//Update Spot
export const UpdateSpotThunk = (spot) => async(dispatch) =>{
   
    const {id,country, address, city, state, lat, lng, description, name, price, previewImage, SpotImages } = spot;
    const response = await csrfFetch(`/api/spots/${id}`, {
        method: "PUT",
        headers:{
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            id,
            country, 
            address,
            city, 
            state,
            lat,
            lng,
            description,
            name,
            price,
            previewImage,
            SpotImages
        })
    });

    if (response.ok) {
        const spotData = await response.json()
      
        dispatch(updateSpot(spotData))
        //SpotData as of now, is: {Spots: [{}, {}, {}]}
        return true
    } else {
        const error = await response.json();
        return error
    }
}


// Delete Spot

export const DeleteSpotThunk = (spot) => async(dispatch) =>{
    console.log()

    const response = await csrfFetch(`/api/spots/${spot.id}`, {
        method: "DELETE",
        body: JSON.stringify({spot})
    })

    if(response.ok){
        dispatch(deleteSpot(spot))
        // dispatch(getSpots())
        return true
    }else{
        const err = await response.json()
        return err
    }
}


export const setSpotImagesThunk = (spotImage) => async (dispatch) => {
    const { url, preview, spotId } = spotImage;
    const response = await csrfFetch(`/api/spots/${spotId}/images`, {
        method: "POST",
        body: JSON.stringify({
            url,
            preview,
        })
    })

    const data = await response.json();
    dispatch(setImages)
    return response

}




//* Reducer

const initialState = {}

const spotReducer = (state = initialState, action, prevState) => {
    switch (action.type) {
        case GET_SPOTS: {
            const newState = { ...state.spots};
            action.spots.Spots.forEach((spot) => newState[spot.id] = spot)
            return {...newState}
        }
        case GET_SPOT_DETAIL: {
            const newSpotState = {...state}
            const spot = action.spot
            newSpotState[action.spot.id] = spot;
            return {...newSpotState}
        }
        case UPDATE_SPOT: {
            const newState = {...state}
            newState[action.spot.id]= {...action.spot}
            return {...newState}
        }
        case DELETE_SPOT:{
            const newState = {...state,...state.spots}
            delete newState[action.spot.id]
            return {...newState}
        }
        default:
            return state
    }

}



export default spotReducer;