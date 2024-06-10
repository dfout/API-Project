
import { userSpotsThunk } from "../../store/spot"
import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Link, useNavigate } from "react-router-dom";
import { IoIosStar } from "react-icons/io";
// import CreateSpotPage from "../CreateSpotPage"; 
// import { Navigate } from "react-router-dom";
import { DeleteModal } from "../DeleteModal/DeleteModal";
import OpenModalButton from "../OpenModalButton";
import {useModal} from '../../context/Modal'

import '../ManageSpots/ManageSpots.css'


export default function ManageSpots (){

    const dispatch = useDispatch();
    const userSpots = Object.values(useSelector((state)=>state.spots))
  
    const navigate = useNavigate();

    
    const closeMenu = useModal();
    useEffect(()=>{
        // had const spots = 
        dispatch(userSpotsThunk())
    },[dispatch])



    const handleCreateButton =()=>{
        navigate('/spots/create')

    }


    return(
        <>
        <h2 id="page-title">Manage Your Spots</h2>

        {userSpots.length === 0 &&
        (<button onClick={handleCreateButton}>Create a New Spot</button>)
        }

        <ul className='all-spots'>
        {userSpots?.map(({id, previewImage, city, state, avgRating, price, name })=>(
            <li className='manage-spot-tile' key={id}><Link to={`/spots/${id}`}className='link-tile'>
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
                </Link>

                <div id='buttons'>
                <Link to={`/spots/${id}/edit`} id='link'style={{textDecoration:'none', color: 'black'}}>
                    <button id='update-button'>Update</button>
                    </Link>
                <OpenModalButton id='delete-button' buttonText='Delete' onButtonClick={closeMenu} modalComponent={<DeleteModal spotId={id}/>}/>
                </div>

  
                
                </li>

        ))}
         </ul>
        </>
    )
}