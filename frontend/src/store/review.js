import { csrfFetch } from "./csrf";
import { createSelector, createStructuredSelector } from 'reselect';


const GET_REVIEWS = 'reviews/getReviews'


const getReviews = (reviews) => {
    return ({
        type:GET_REVIEWS,
        reviews
        
    })
};


// export const getReviewsList = createSelector(
//     (state)=> state.reviews,
//     (Reviews)=> Object.values(Reviews)
// )




export const getReviewsForSpotThunk = (id) => async(dispatch) =>{
    const response = await csrfFetch(`/api/spots/${id}/reviews`);

    if (response.ok){
        const reviewData = await response.json();
        dispatch(getReviews(reviewData))
        return reviewData
    }else{
        const error = await response.json();
        return error
    }
};

// export const getUserReviewsThunk = () => async(dispatch)=>{
//     const response = await 
// }



const initialState = {};

const reviewReducer = (state = initialState, action, prevState) => {
    switch(action.type){
        case GET_REVIEWS:{
            const newState = {...state}
            action.reviews.Reviews.forEach((review)=> newState[review.id] = review)
            return newState

        }
        default:
            return state
    }
}


export default reviewReducer;