import {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import { getAllSpotsThunk, getSpotsList } from '../../store/spot';
import { IoIosStar } from "react-icons/io";
import {useParams} from 'react-router-dom';
import OpenModalButton from '../OpenModalButton';
import { useModal } from '../../context/Modal';
import ReviewModal from '../ReviewModal';

import * as reviewActions from '../../store/review'

import './SpotReview.css'

const SpotReviews = ({numReviews, avgRating, ownerId, reviews, spotId }) =>{
    const dispatch = useDispatch()

    

   useEffect(()=>{
    dispatch(reviewActions.getReviewsForSpotThunk(spotId))
   }, [dispatch, spotId])
    
    // For Post Review Button:
    // Check if user is logged in         T: GreenLight           F: RedLight
    let sessionUser = useSelector((state) => state.session.user);
    if (sessionUser === null) {
        sessionUser = false
    }
    // const userId = sessionUser.id
    
    // Check if user is the creator of the post   T: RedLight        F: GreenLight
    const isCreator =(sessionUser, ownerId)=>{
       if(sessionUser){
        const userId = sessionUser.id
            if (userId === ownerId){
                return true
            }
       }
       return false
    }
    // Check if user has already posted a reivew for this spot      T: RightLight   F: GreenLight
    const reviewState = useSelector((state)=>state.reviews)
    // const alreadyReviewed = reviewState[userId]


    // Reviews is an array of two objects. This will not be iterable. unless we change it to be 
   // To Make reviews Iterable:
   const reviewsObj = useSelector((state)=>state.reviews, (reviews)=> Object.values)
    
   const reviewsList = Object.values(reviewsObj)
   const closeMenu = useModal()

//    reviews.forEach((review)=>console.log("a review"))
  

    const alreadyReviewed = (sessionUser)=>{

        const reviews = useSelector(
            (state)=>state.reviews
        )
        const reviewsList = Object.values(reviews)
        
        // const sessionUser = useSelector((state) => state.session.user);
        if(sessionUser){
            const currUserId = sessionUser.id
            
            const hasReviewed = reviewsList.find((entry)=> entry.userId === currUserId);
                // if (entry.userId === currUserId) {
                //     return true;
                // }
            
            if(hasReviewed){
                return true
            }else{
                return false
            }
           
        }
    }
    // console.log("ALREADY REVIEWED",alreadyReviewed(sessionUser))
    
    // console.log("SESSIONUSER",sessionUser)
   const canPostReview = (sessionUser, ownerId) => sessionUser && !isCreator(sessionUser, ownerId) && !alreadyReviewed(sessionUser);

//    console.log( "CAN POST REVIEW",canPostReview(sessionUser, ownerId, reviews))
//    console.log("IS CREATOR",isCreator(sessionUser, ownerId), "USERID", sessionUser.id, "OWNERID", ownerId)

  

   // Logic for displayButton will need to be flipped. Button will be disabled={!displayButton}
   // Because when the displayButton function is false, we want disabled to equal true. 
    // Need access to the user information on the review: COMPLETED. User is joined on the each review in the Reviews key. 

    //! CURRENT CASE:
    //* Resolved
    /* 
    - sessionUser === false
    - Therefore, 
            - Cannot post review
            - Need to display, sign in to post a review. 
    
    */



    return(
        <>
        <IoIosStar/>
        <span>{avgRating}</span>
        <span>{
            (numReviews === 0 || numReviews === null) ? "New" : numReviews + ' reviews'
        }</span>
        {!sessionUser && (
                <button id='review-button' disabled={true}>Sign-in to post a Review</button>
        )
        }
        {canPostReview(sessionUser, ownerId, reviews) && (
            <OpenModalButton id='review-button' buttonText='Post Your Review' onButtonClick={closeMenu} modalComponent={<ReviewModal spotId={spotId}/>}/>
        )} 
        {alreadyReviewed(sessionUser) &&(
            <button id='review-button' disabled={true}>Review Submitted</button>
        )}
        {isCreator(sessionUser, ownerId) && (
            <button disabled={true}>You own this spot. Check out the reviews</button>
        )}
        <ul className='spot-reviews'>
        {reviews?.map(({id, userId, User, stars, review, createdAt, updatedAt })=>(
            <li className='review-tile' key={id}>
                <h4>{User.firstName}</h4>
                <span>{createdAt.split('-')[1]}/{createdAt.split('-')[2].split('T')[0]}/{createdAt.split('-')[0]}</span>
                <span>{stars} stars</span>
                <span>{review}</span>
            </li>

        ))}
         </ul>
        
        
        </>
    );
    

}




export default SpotReviews;