
import { useSelector } from "react-redux"
import { NavLink } from "react-router-dom";


import './Navigation.css'
import ProfileButton from "./ProfileButton";
import OpenModalButton from '../OpenModalButton';
import LoginFormModal from "../LoginFormModal/LoginFormModal";


const Navigation = ({isLoaded})=>{
    const sessionUser = useSelector(state => state.session.user)
    // const dispatch = useDispatch()
    
    const navLinks = sessionUser ? (
            <li>
                <ProfileButton user={sessionUser} />
            </li>
    ) : (
        <>
            <li>
                <OpenModalButton buttonText='Log In' modalComponent={<LoginFormModal/>}/>
            </li>
            <li>
                <NavLink to='/signup'>Sign Up</NavLink>
            </li>
        </>
    )


    return (
        <ul>
            < NavLink to='/'>Home</NavLink>
            {isLoaded && navLinks}
        </ul>
    )
}


export default Navigation