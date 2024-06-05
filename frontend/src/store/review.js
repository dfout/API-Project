import { csrfFetch } from "./csrf";
import { createSelector, createStructuredSelector } from 'reselect';


const GET_REVIEWS = 'reviews/getReviews';
const POST_REVIEW = 'reviews/postReview';


const getReviews = (reviews) => {
    return ({
        type:GET_REVIEWS,
        reviews
        
    })
};

const postReview = (review)=>{
    return({
        type: POST_REVIEW,
        review
    })
}


export const getReviewsList = createSelector(
    (state)=> state.reviews,
    (Reviews)=> Object.values(Reviews)
)




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


export const postReviewThunk = ({review, stars}, spotId, sessionUser)=> async(dispatch)=>{
    console.log(review, stars, spotId, sessionUser)
    const response = await csrfFetch(`/api/spots/${spotId}/reviews`, {
        method: "POST",
        body: JSON.stringify({
            review,
            stars
        })
    })

    if (response.ok){
        const reviewData = await response.json();
        
        console.log(reviewData, "REVIEW DATA FROM THUNK")
        reviewData['User'] = {...sessionUser}
        console.log(reviewData, "AFTER ADDING KEY")
        dispatch(postReview(reviewData))
        
        return reviewData
    }else{
        const error = await response.json();
        console.log(error)
        return error

    }
}


const initialState = {};

const reviewReducer = (state = initialState, action, prevState) => {
    switch(action.type){
        case GET_REVIEWS:{
            const newState = {...state.reviews}
            action.reviews.Reviews.forEach((review)=> newState[review.userId] = review)
            return {...newState}
        }
        case POST_REVIEW:{
            const newState = { ...state}
            newState[action.review.id] = {...action.review}
            return {...newState}
        }
        default:
            return state
    }
}


export default reviewReducer;