import {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import { getAllSpotsThunk, getSpotsList } from '../../store/spot';
import { IoIosStar } from "react-icons/io";
import {useParams} from 'react-router-dom';

import * as reviewActions from '../../store/review'


const SpotReviews = ({numReviews, avgRating, ownerId, reviews }) =>{
    
    // For Post Review Button:

    // Check if user is logged in         T: GreenLight           F: RedLight
    const sessionUser = useSelector((state) => state.session.user);

    // Check if user is the creator of the post   T: RedLight        F: GreenLight
    const userId = sessionUser.id
    const isCreator = (userId, ownerId)=> userId === ownerId

    // Check if user has already posted a reivew for this spot      T: RightLight   F: GreenLight


    // Need access to the user information on the review: COMPLETED. User is joined on the each review in the Reviews key. 

    // Reviews is an array of two objects. This will not be iterable. unless we change it to be 
    
    // const Reviews = useSelector((state)=>)

   


    return(
        <>
        <IoIosStar/>
        <span>{avgRating}</span>
        <span>{
            (numReviews === 0 || numReviews === null) ? "New" : numReviews + ' reviews'
        }</span>
        <button>Post Your Review</button>
        <ul className='spot-reviews'>
        {reviews?.map(({id, userId, User, stars, review, createdAt, updatedAt })=>(
            <li className='review-tile' key={id}>
                <h4>{User.firstName}</h4>

            </li>

        ))}
         </ul>
        
        
        </>
    );
    

}




export default SpotReviews;