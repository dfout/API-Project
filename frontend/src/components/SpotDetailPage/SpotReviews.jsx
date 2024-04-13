import {useEffect, useState} from 'react';
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

    const reviews = useSelector((state)=> state.reviews);

    const [timeCheck, setTimeCheck] = useState(true);

    useEffect(() => {
        let timeout;
        if (!reviews) {
            timeout = setTimeout(() => setTimeCheck(false), 3000);
        }

        return () => clearTimeout(timeout);
    }, [ reviews]);

    if ( !reviews && timeCheck) return <h1>Loading...</h1>;
    else if ( !reviews && !timeCheck) return <h1>Sorry, please refresh the page</h1>;

    return;

}




export default SpotReviews;