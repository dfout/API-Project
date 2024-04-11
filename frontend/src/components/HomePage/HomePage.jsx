import {useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import { getAllSpotsThunk, getSpotsList } from '../../store/spot';
import { IoIosStar } from "react-icons/io";


const HomePage =()=>{
    const dispatch = useDispatch();
    const allSpots = useSelector(getSpotsList)


    useEffect(()=>{
        dispatch(getAllSpotsThunk())
    }, [dispatch])



    // const spotTiles = allSpots ? 

    return(
        <>
            <h2>Pop a Squat</h2>
            <h3>Spot List:</h3>
        {allSpots?.map(({previewImage, city, state, avgRating, price, name })=>(
            <div className='spot-tile'>
                <img src={previewImage} alt={`${name} in ${city, state}`} title={`${name} in ${city, state}`}/>
                <div className='spot-info'>
                    <span>{city}, {state}</span>
                    <IoIosStar />
                    <span>{avgRating !== null ? avgRating : 'New'}</span>
                </div>
                <div className='spot-price'>
                    <span>${price} night </span>
                </div>
            </div>

        ))}
        </>

        
    )
}


export default HomePage