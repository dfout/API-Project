
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


export default function ManageSpots (){

    const dispatch = useDispatch();
    const userSpots = Object.values(useSelector((state)=>state.spots))
  
    const navigate = useNavigate();
    // const [timeCheck, setTimeCheck] = useState(true);
    
    const closeMenu = useModal();
    useEffect(()=>{
        // had const spots = 
        dispatch(userSpotsThunk())
    },[dispatch])

    // useEffect(() => {
    //     let timeout;
       
    //     if (!spot || !spot.Owner || !spot.Reviews) {
    //         timeout = setTimeout(() => setTimeCheck(false), 3000);
            
    //     }
    
    //     return () => clearTimeout(timeout);
    // }, []);

    // if (!spot || !spot.Owner || !reviews && timeCheck) return <h1>Loading...</h1>;
    // else if (!spot || !spot.Owner || !reviews && !timeCheck) return <h1>Sorry, please refresh the page</h1>;

    const handleCreateButton =()=>{
        navigate('/spots/create')

    }
    // const handleUpdateButton = (id)=>{
    //     return <Navigate to= {`/spots/${id}/edit`}/>
    // }


    return(
        <>
        <h2>Manage Your Spots</h2>

        {userSpots.length === 0 &&
        (<button onClick={handleCreateButton}>Create a New Spot</button>)
        }

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

                <button><Link to={`/spots/${id}/edit`}>Update</Link></button>
                <OpenModalButton id='delete-button' buttonText='Delete' onButtonClick={closeMenu} modalComponent={<DeleteModal spotId={id}/>}/>
                
                </li>

        ))}
         </ul>
        </>
    )
}