import {useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import { getAllSpotsThunk, getSpotsList } from '../../store/spot';
import { IoIosStar } from "react-icons/io";
import {useParams} from 'react-router-dom';

import * as reviewActions from '../../store/review'


const SpotReviews = ({spotId}) =>{
    console.log(spotId)


    const dispatch = useDispatch();
    const getReviewsList = useSelector(reviewActions.getReviewsList)
    console.log(getReviewsList)


    useEffect((spotId)=>{ 
        dispatch(reviewActions.getReviewsForSpotThunk(spotId))

    },[dispatch])



    return

}




export default SpotReviews;