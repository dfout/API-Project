import {useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import { getAllSpotsThunk, getSpotsList } from '../../store/spot';
import { IoIosStar } from "react-icons/io"; 
import {Link} from 'react-router-dom';
// import SpotDetail from '../SpotDetailPage/SpotDetail';


import './SpotsPage.css'



const SpotsPage =()=>{
    const dispatch = useDispatch();
    const allSpots = useSelector(getSpotsList)
  
    // const ulRef = useRef()

    



    useEffect(()=>{
        dispatch(getAllSpotsThunk())
    }, [dispatch])

    // useEffect(()=>{
    //     const openDetails = (e) => {

    //     }
    // })


    // const spotTiles = allSpots ? 

    return(
        <>

        <ul className='all-spots'>
        {allSpots?.map(({id, previewImage, city, state, avgRating, price, name })=>(
            <li className='spot-tile' key={id}><Link to={`/spots/${id}`}className='link-tile'>
                <div className='image-container'>
                <img id='preview-image' src={previewImage} alt={`${name} in ${city, state}`} title={`${name} in ${city, state}`}/>
                </div>
                <div className='spot-info'>
                    <h3>{city}, {state}</h3>
                    <span id='ratings'>
                        <IoIosStar />
                    <span>{avgRating !== null ? avgRating : 'New'}</span>
                    </span>
                </div>
                <div className='spot-price'>
                    <span>${price} night </span>
                </div>
                </Link></li>

        ))}
         </ul>
        </>
        
    )
}


export default SpotsPage;