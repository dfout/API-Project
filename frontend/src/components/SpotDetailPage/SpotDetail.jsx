import {useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import { getAllSpotsThunk, getSpotsList } from '../../store/spot';
import { IoIosStar } from "react-icons/io";
import {useParams} from 'react-router-dom';
import { useState } from "react"

import SpotReviews from './SpotReviews';
import * as spotActions from '../../store/spot';
import OpenModalMenuItem from '../Navigation/OpenModalMenuItem';
import { useModal } from '../../context/Modal';
import FeatureComingModal from '../FeatureComingModal';


const SpotDetail =()=>{
    //when this is triggered, my state is has changed because the page has navigated

    let {spotId} = useParams();
    spotId = Number(spotId)
    const dispatch = useDispatch();

    useEffect(()=>{
        dispatch(spotActions.getOneSpotThunk(spotId))
     
        
    }, [dispatch, spotId])


    // const spots = useSelector(spotActions.getSpotsList)
    // console.log(spots)

    const spot = useSelector((state)=> state.spots[spotId]);
    const closeMenu = useModal();


  
    const [timeCheck, setTimeCheck] = useState(true);

    useEffect(() => {
        let timeout;
        if (!spot) {
            timeout = setTimeout(() => setTimeCheck(false), 3000);
        }

        return () => clearTimeout(timeout);
    }, [spot]);

    if (!spot && timeCheck) return <h1>Loading...</h1>;
    else if (!spot&& !timeCheck) return <h1>Sorry, please refresh the page</h1>;

    



    
    // const getSpotData = (spotId)=>{
    //     return dispatch(spotActions.getOneSpotThunk(spotId))
    // }
    
    // const spot = getSpotData(spotId)
    // console.log("SPOT", spot)
    
    // // const closeMenu = useModal()
    // // const spotData = getSpotData(spotId)
    // // console.log("SPOTDATA",spotData)


 
  
    const { name, city, state, country, Owner, price, description,previewImage } = spot;
    



    return(
        <>
            <div className= 'spot-title'> 
                <h1>{name}</h1>
                <h2>{city}, {state}, {country}</h2>
            </div>
            <div className='spot-images'>
                <span className='first-image'>
                    <img src={previewImage} alt={`${name} in ${city, state}`} title={`${name} in ${city, state}`}/>
                </span>
                {/* <SpotImages/> */}
            </div>
            <div id='spot-details'>
                {/* Hosted by {firstName} {lastName} */}
                <p className='description'>{description}</p>
                <div className='reserve-box'>
                    <div className='reserve-box-info'>
                        <span>${price}night</span>
                        <IoIosStar />
                        {/* <span>{reviews.entries.length} reviews</span> */}
                    </div>
                    <OpenModalMenuItem itemText='Reserve' onButtonClick={closeMenu} modalComponent={<FeatureComingModal/>}/>
                </div>
            </div>
            <SpotReviews spotId={spotId}/>
        </>

        
    )
}


export default SpotDetail