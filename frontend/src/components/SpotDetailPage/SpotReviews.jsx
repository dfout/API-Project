import {useEffect, useState} from 'react';
import {useSelector} from 'react-redux';
// import { getAllSpotsThunk, getSpotsList } from '../../store/spot';
import { IoIosStar } from "react-icons/io";
// import {useParams} from 'react-router-dom';
import OpenModalButton from '../OpenModalButton';
import { useModal } from '../../context/Modal';
import ReviewModal from '../ReviewModal';
import { getReviewsList } from '../../store/review';

// import * as reviewActions from '../../store/review'

import './SpotReview.css'

const SpotReviews = ({ numReviews, avgRating, ownerId, spotId }) =>{
    

    // const [reviews, setReviews] = useState(reviewsState);

    spotId = Number(spotId)
    console.log(typeof spotId)


        

    const reviews = useSelector(getReviewsList);
    // console.log(reviews)


    //! How do I cause this component to rerender when the reviews state is updated?

    //Listen to just the reviews..... But I want new reviews to show up immediately. So I think I can still do that. 

//    useEffect(()=>{
//     dispatch(reviewActions.getReviewsForSpotThunk(spotId))
//    }, [dispatch, spotId])



    // useEffect(()=>{

    //     setReviews(review)
        
    // },[reviews])
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
    // const reviewState = useSelector((state)=>state.reviews)
    // const alreadyReviewed = reviewState[userId]


    // Reviews is an array of two objects. This will not be iterable. unless we change it to be 
   // To Make reviews Iterable:
//    const reviewsObj = useSelector((state)=>state.reviews, (reviews)=> Object.values)
    
//    const reviewsList = Object.values(reviewsObj)
//    console.log(reviewsList)
   const closeMenu = useModal()

//    reviews.forEach((review)=>console.log("a review"))


const [timeCheck, setTimeCheck] = useState(true);

useEffect(() => {
    let timeout;
   
    if (!reviews) {
        timeout = setTimeout(() => setTimeCheck(false), 3000);
        
    }

    return () => clearTimeout(timeout);
}, [reviews]);

if (!reviews  && timeCheck) return <h1>Loading...</h1>;
else if (!reviews&& !timeCheck) return <h1>Sorry, please refresh the page</h1>;
  
    //this used to be inside already reviewed
    // const reviews = useSelector(
    //     (state)=>state.reviews
    // )

    const alreadyReviewed = (sessionUser, reviews = reviews)=>{


        // const reviewsList = Object.values(reviews)
        
        // const sessionUser = useSelector((state) => state.session.user);
        if(sessionUser){
            const currUserId = sessionUser.id
            
            const hasReviewed = reviews.find((entry)=> entry.userId === currUserId);
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
   const canPostReview = (sessionUser, ownerId) => sessionUser &&!isCreator(sessionUser, ownerId) && !alreadyReviewed(sessionUser);

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

    // console.log(numReviews)

    // const handleSubmit = async(e) => {
    //     e.preventDefault()
    //     setErrors
    // };
    


    //! ISSUE: Right after submitting a new review, we have to wait to recieve that confirmation from the db

    return(
        <>
        <IoIosStar/>
        <span>{avgRating}</span>
        <span>{
            (numReviews === 0 || numReviews === null) ? "New" : (numReviews + ' reviews')
        }</span>
        {!sessionUser && (
         <button id='review-button' disabled={true}>Sign-in to post a Review</button>
        )
        }
        {alreadyReviewed(sessionUser) &&(
            <button id='review-button' disabled={true}>Review Submitted</button>
        )}
        {isCreator(sessionUser, ownerId) && (
            <button disabled={true}>You own this spot. Check out the reviews</button>
        )}
        {canPostReview(sessionUser, ownerId) && (
            <OpenModalButton id='review-button' buttonText={'Post Your Review'} onButtonClick={closeMenu} modalComponent={<ReviewModal spotId={spotId}/>}/>
        )} 
        <ul className='spot-reviews'>
        {reviews?.map(({id,User, stars, review, createdAt})=>(
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