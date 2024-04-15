import {useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import { getAllSpotsThunk, getSpotsList } from '../../store/spot';
import { IoIosStar } from "react-icons/io";
import {useParams} from 'react-router-dom';
import { useState } from "react"

import SpotReviews from './SpotReviews';
import * as spotActions from '../../store/spot';
import OpenModalButton from '../../components/OpenModalButton'
import { useModal } from '../../context/Modal';
import FeatureComingModal from '../FeatureComingModal';

import './SpotDetail.css'


const SpotDetail =()=>{
    //when this is triggered, my state is has changed because the page has navigated

    let {spotId} = useParams();
    spotId = Number(spotId)
    const dispatch = useDispatch();

    useEffect(()=>{
       dispatch(spotActions.getOneSpotThunk(spotId))
    
    }, [dispatch, spotId])

    // const getSpotDetails =(spotId)= async (dispatch)=> (spotActions.getOneSpotThunk(spotId));
    // const spots = useSelector(spotActions.getSpotsList)
    // console.log(spots)

    const spot = useSelector((state)=> state.spots[spotId]);
    
    const closeMenu = useModal();

    // if (!spot || !spot.Owner) return null

    
  
    const [timeCheck, setTimeCheck] = useState(true);

    useEffect(() => {
        let timeout;
       
        if (!spot || !spot.Owner || !spot.Reviews) {
            timeout = setTimeout(() => setTimeCheck(false), 3000);
            
        }
    
        return () => clearTimeout(timeout);
    }, [spot]);

    if (!spot || !spot.Owner || !spot.Reviews && timeCheck) return <h1>Loading...</h1>;
    else if (!spot || !spot.Owner || !spot.Reviews && !timeCheck) return <h1>Sorry, please refresh the page</h1>;

   

    const { name, city, state, country, Owner, price, avgRating, numReviews, description,previewImage, SpotImages, Reviews } = spot;
    

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
                        <span>{
                            (numReviews === 0 || numReviews === null) ? "New" : numReviews + ' reviews'
                        }</span>
                    </div>
                    <OpenModalButton id='reserve-button' buttonText='Reserve' onButtonClick={closeMenu} modalComponent={<FeatureComingModal/>}/>
                </div>
            </div>
        </section>
        <SpotReviews reviews={Reviews} avgRating={avgRating} numReviews={numReviews} ownerId={Owner.id}/>
        </>
    )
}


export default SpotDetail