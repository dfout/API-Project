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

import './SpotDetail.css'


const SpotDetail =()=>{
    //when this is triggered, my state is has changed because the page has navigated

    let {spotId} = useParams();
    spotId = Number(spotId)
    const dispatch = useDispatch();
    const spot = useSelector((state)=> state.spots[spotId]);
    const reviews = useSelector(getReviewsList)

    useEffect(()=>{
       dispatch(spotActions.getOneSpotThunk(spotId))
       dispatch(reviewActions.getReviewsForSpotThunk(spotId))
    
    }, [spotId])



    // const getSpotDetails =(spotId)= async (dispatch)=> (spotActions.getOneSpotThunk(spotId));
    // const spots = useSelector(spotActions.getSpotsList)
    // console.log(spots)


    let sessionUser = useSelector((state) => state.session.user);
    if (sessionUser === null) {
        sessionUser = false
    }
    // console.log(reviews)
    // console.log(reviews)
    const [timeCheck, setTimeCheck] = useState(true);

    useEffect(() => {
        let timeout;
       
        if (!spot || !spot.Owner || !spot.Reviews) {
            timeout = setTimeout(() => setTimeCheck(false), 3000);
            
        }
    
        return () => clearTimeout(timeout);
    }, [spot, reviews]);

    if (!spot || !spot.Owner || !reviews && timeCheck) return <h1>Loading...</h1>;
    else if (!spot || !spot.Owner || !reviews && !timeCheck) return <h1>Sorry, please refresh the page</h1>;
    
   
    
    const closeMenu = useModal();

    // if (!spot || !spot.Owner) return null

    
    const { name, city, state, country, Owner, price, avgRating, numReviews, description,previewImage, SpotImages, Reviews, ownerId } = spot;


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

        // const reviews = useSelector(
        //     (state)=>state.reviews
        // )
        if(reviews){
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

    }

    const canPostReview = (sessionUser, ownerId) => sessionUser &&!isCreator(sessionUser, ownerId) && !alreadyReviewed(sessionUser);


    console.log("REVIEWS", reviews)
    // console.log("SPOT", spot)

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
                        <span>{avgRating}</span>
                        {numReviews === 0 || numReviews === null ? (
                        <span>New</span>
                        ) : (
                        <>
                            <span>{numReviews === 1 || numReviews === '1' ? `${numReviews} review` : `${numReviews} reviews`}</span>
                            <BsDot />
                        </>
                        )}
                    </div>
                    <OpenModalButton id='reserve-button' buttonText='Reserve' onButtonClick={closeMenu} modalComponent={<FeatureComingModal/>}/>
                </div>
            </div>
        </section>
        {/* <SpotReviews reviewsState= {reviews} avgRating={avgRating} numReviews={numReviews} ownerId={Owner.id} spotId={Number(spotId)}/> */}


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
        </>
    )
}


export default SpotDetail