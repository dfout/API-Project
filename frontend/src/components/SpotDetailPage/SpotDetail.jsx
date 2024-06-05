import {useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import { getAllSpotsThunk, getSpotsList } from '../../store/spot';
import { IoIosStar } from "react-icons/io";
import { BsDot } from "react-icons/bs";
import {useParams} from 'react-router-dom';
import { useState } from "react"

import SpotReviews from './SpotReviews';
import * as spotActions from '../../store/spot';
import * as reviewActions from '../../store/review'
import OpenModalButton from '../../components/OpenModalButton'
import { useModal } from '../../context/Modal';
import FeatureComingModal from '../FeatureComingModal';
import { getReviewsList } from '../../store/review';
import ReviewModal from '../ReviewModal';
// import OpenModalButton from '../../components/OpenModalButton';
import {DeleteReviewModal} from '../DeleteModal/DeleteReview'
// import LoginFormModal from '../FeatureComingModal/FeatureComingModal';

import OpenModalMenuItem from '../Navigation/OpenModalMenuItem';

import './SpotDetail.css'
import LoginFormModal from '../LoginFormModal/LoginFormModal';


//! Once I post a review, the state of reviews changes. 
//! However, the numReviews and avg rating of reviews does not update here on the SpotDetail page. 
//! I need to make sure, I am getting the numReviews and avRating from the reviews state slice ONLY. 

//* The number of reviews now updates. But I still have an issue with:
//! '1 reviews'
//! Avg Rating
// Plan of action:
// Grab from the list of reviews. Iterate over them 
// 


const SpotDetail =()=>{
    //when this is triggered, my state is has changed because the page has navigated

    let {spotId} = useParams();
    spotId = Number(spotId)
    const dispatch = useDispatch();
    const spot = useSelector((state)=> state.spots[spotId]);
    let reviews = (useSelector(getReviewsList))
    reviews = [...reviews].reverse();
    let numReviews = reviews.length

    const closeMenu = useModal();

    const [timeCheck, setTimeCheck] = useState(true);

    let sessionUser = useSelector((state) => state.session.user);
    if (sessionUser === null) {
        sessionUser = false
    }

    useEffect(()=>{
       dispatch(spotActions.getOneSpotThunk(spotId))
       dispatch(reviewActions.getReviewsForSpotThunk(spotId))
    
    }, [spotId])

    let avgRating = reviews.reduce((accumulator, currentItem)=> accumulator + currentItem.stars, 0)
    avgRating = (avgRating / numReviews).toFixed(2)
   
    useEffect(() => {
        let timeout;
       
        if (!spot || !spot.Owner || !spot.Reviews) {
            timeout = setTimeout(() => setTimeCheck(false), 3000);
            
        }
    
        return () => clearTimeout(timeout);
    }, [spot, reviews]);

    if (!spot || !spot.Owner || !reviews && timeCheck) return <h1>Loading...</h1>;
    else if (!spot || !spot.Owner || !reviews && !timeCheck) return <h1>Sorry, please refresh the page</h1>;
    
   
    
    const { name, city, state, country, Owner, price, description,previewImage, SpotImages, Reviews, ownerId } = spot;


    const isCreator =(sessionUser, ownerId)=>{
        if(sessionUser){
         const userId = sessionUser.id
             if (userId === ownerId){
                 return true
             }
        }
        return false
    }

    const alreadyReviewed = (sessionUser, reviews)=>{

        if(reviews){
            const reviewsList = Object.values(reviews)
        
            // const sessionUser = useSelector((state) => state.session.user);
            if(sessionUser){
                const currUserId = sessionUser.id
                
                const hasReviewed = reviewsList.find((entry)=> entry.userId === currUserId);
                if(hasReviewed){
                    return true
                }else{
                    return false
                }
               
            }

        }

    }

    const canPostReview = (sessionUser, ownerId, reviews) => sessionUser && !isCreator(sessionUser, ownerId) && !alreadyReviewed(sessionUser, reviews)

    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    return(
        <>
        <section className='spot-detail'>
            <div className= 'spot-title'> 
                <h2>{name}</h2>
                <h3>{city}, {state}, {country}</h3>
            </div>
            <div className='spot-images'>
                <span className='first-image'>
                    <img src={previewImage} alt={`${name} in ${city, state}`} title={`${name} in ${city, state}`}/>
                </span>
                {SpotImages?.length > 0 && (
                    <div className='other-images-container'>
                        {SpotImages.map((imageObject, index) => (
                        imageObject.preview === false && (
                            <img key={index} src={imageObject.url} className='other-image' id={`image-${index + 1}`} alt="" />
                        ) 
                        ))}
                    </div>
                )}
            </div>
            <div id='spot-details'>
                <span id='host+description'>
                <h4>Hosted by {Owner.firstName} {Owner.lastName}</h4>
                <p className='description'>{description}</p>
                </span>

                <div className='reserve-box'>
                    <div className='reserve-box-info'>
                        <span>${price}night</span>
                        <IoIosStar />
                        {numReviews!==0 &&
                            (<span>{avgRating}</span>)
                        }
                        {numReviews === 0 || numReviews === null ? (
                        <span>New</span>
                        ) : (
                        <>
                        <BsDot />
                            <span>{numReviews === 1 || numReviews === '1' ? `${numReviews} review` : `${numReviews} reviews`}</span>
                            
                        </>
                        )}
                    </div>
                    <OpenModalButton id='reserve-button' buttonText='Reserve' onButtonClick={closeMenu} modalComponent={<FeatureComingModal/>}/>
                </div>
            </div>
        </section>
        {/* <SpotReviews reviewsState= {reviews} avgRating={avgRating} numReviews={numReviews} ownerId={Owner.id} spotId={Number(spotId)}/> */}
        <>
        <div id='review-intro'>
        <IoIosStar/>
        {numReviews !== 0 &&(
            <span>{avgRating}</span>
        )}
        {numReviews === 0 || numReviews === null ? (
                        <span>New</span>
                        ) : (
                        <>
                        <BsDot />
                            <span>{numReviews === 1 || numReviews === '1' ? `${numReviews} review` : `${numReviews} reviews`}</span>
                            
                        </>
                        )}
        {!sessionUser && (
        //  <button id='review-button' disabled={true}>Sign-in to post a Review</button>
        <OpenModalButton buttonText='Sign-in to post a Review' className='modal-text'onButtonClick={closeMenu} modalComponent={<LoginFormModal/>}/>
        )
        }
        {alreadyReviewed(sessionUser, reviews) &&(
            <button id='review-button' disabled={true}>Review Submitted</button>
        )}
        {isCreator(sessionUser, ownerId) && (
            <button disabled={true}>You own this spot. Check out the reviews</button>
        )}
        {canPostReview(sessionUser, ownerId, reviews) && (
            <OpenModalButton id='review-button' buttonText={'Post Your Review'} onButtonClick={closeMenu} modalComponent={<ReviewModal spotId={spotId}/>}/>
        )} 

        </div>

        <ul className='spot-reviews'>
            {reviews.length == 0 && 
            <span>Be the first to post a review!</span>
            }
            {reviews.length != 0 && reviews?.map(({ id, userId, User, stars, review, createdAt, updatedAt }) => {
                const date = new Date(createdAt);
                const monthName = monthNames[date.getMonth()];
                const year = date.getFullYear();

                return (
                    <li className='review-tile' key={id}>
                        <h4>{User.firstName}</h4>
                        <p className='review-info'>{monthName} {year}</p>
                        <p className='review-info'>{stars} stars</p>
                        <p className='review-info'>{review}</p>
                        {sessionUser.id === userId && 
                        (<OpenModalButton id="delete-button" buttonText={'Delete'} onButtonClick={closeMenu} modalComponent={<DeleteReviewModal reviewId={id}/>}/>)}
                    </li>
                );
            })}
        </ul>
        
        </>
        </>
    )
}


export default SpotDetail


// {createdAt.split('-')[2].split('T')[0]}