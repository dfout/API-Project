//* Imports 
import { csrfFetch } from "./csrf";
import { createSelector, createStructuredSelector } from 'reselect';
//* Case Methods
const GET_SPOTS = 'spots/getAllSpots';
// const LOG_OUT = 'session/log-out';
const GET_SPOT_DETAIL = 'spots/:spotId'
const SET_SPOT_IMAGES = 'spots/images'


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
    const { address, city, state, country, lat, lng, name, description, price, previewImage } = spot;
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
                previewImage
            })
        });

        if (response.ok) {
            const data = await response.json();
            dispatch(getSpotDetails(data));
            return response;
        } else {
            const error = await response.json();
            console.log("EERRR", error)
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
        // console.log(spotData)
        dispatch(getSpots(spotData))


        return spotData;
    } else {
        const error = await response.json();
        return error
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
            const newState = { ...state };
            action.spots.Spots.forEach((spot) => newState[spot.id] = spot)
            return newState
        }
        case GET_SPOT_DETAIL: {
            const newSpotState = { ...state }
            const spot = action.spot
            newSpotState[spot.id] = spot;
            return newSpotState
        }
        default:
            return state
    }

}



export default spotReducer;