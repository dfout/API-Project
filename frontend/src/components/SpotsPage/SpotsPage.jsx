import {useEffect, useRef} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import { getAllSpotsThunk, getSpotsList } from '../../store/spot';
import { IoIosStar } from "react-icons/io"; 

import { Navigate } from "react-router-dom";


const SpotsPage =()=>{
    const dispatch = useDispatch();
    const allSpots = useSelector(getSpotsList)
  
    const ulRef = useRef()

    



    useEffect(()=>{
        dispatch(getAllSpotsThunk())
    }, [dispatch])

    useEffect(()=>{
        const openDetails = (e) => {

        }
    })


    // const spotTiles = allSpots ? 

    return(
        <>

        <ul className='all-spots'>
        {allSpots?.map(({id, previewImage, city, state, avgRating, price, name })=>(
            <li className='spot-tile' key={id}><a href={`/spots/${id}`}>
                <img src={previewImage} alt={`${name} in ${city, state}`} title={`${name} in ${city, state}`}/>
                <div className='spot-info'>
                    <span>{city}, {state}</span>
                    <IoIosStar />
                    <span>{avgRating !== null ? avgRating : 'New'}</span>
                </div>
                <div className='spot-price'>
                    <span>${price} night </span>
                </div>
                </a></li>

        ))}
         </ul>
        </>
        
    )
}


export default SpotsPage;