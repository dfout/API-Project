
import { userSpotsThunk } from "../../store/spot"
import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Link, useNavigate } from "react-router-dom";
import { IoIosStar } from "react-icons/io";
import CreateSpotPage from "../CreateSpotPage"; 
import { Navigate } from "react-router-dom";


export default function ManageSpots (){

    const dispatch = useDispatch();
    const userSpots = Object.values(useSelector((state)=>state.spots))
    console.log(userSpots)
    const navigate = useNavigate();

    useEffect(()=>{
        const spots = dispatch(userSpotsThunk())
        console.log(spots)
    },[dispatch, userSpotsThunk])

    const handleCreateButton =()=>{
        navigate('/spots/create')

    }


    return(
        <>
        <h2>Manage Your Spots</h2>


        <button onClick={handleCreateButton}>Create a New Spot</button>

        <ul className='all-spots'>
        {userSpots?.map(({id, previewImage, city, state, avgRating, price, name })=>(
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
                </Link>

                <button>Update</button>
                <button>Delete</button>
                
                </li>

        ))}
         </ul>
        </>
    )
}