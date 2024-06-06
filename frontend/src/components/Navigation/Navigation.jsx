
import { useSelector } from "react-redux"
import { NavLink } from "react-router-dom";
// import { PiStripeLogo } from "react-icons/pi";


import './Navigation.css'
import ProfileButton from "./ProfileButton";
// import OpenModalButton from '../OpenModalButton';
// import LoginFormModal from "../LoginFormModal/LoginFormModal";
// import SignupFormModal from "../SignupFormPage";


const Navigation = ({isLoaded})=>{
    const sessionUser = useSelector(state => state.session.user)
    // const dispatch = useDispatch()



    return(
        <ul id= 'Navigation'>
            <li id='logo'>
                <NavLink to='/' className='logo-link'>
                    <img id="logo-image" src="https://squatspot.s3.us-east-2.amazonaws.com/Untitled-4+(1).png"/>
                    <h1>squatspot</h1>
                    </NavLink>
                
            </li>
            {isLoaded && (
                <div className='right-side'>
                {sessionUser && (
                        <li id='create-spot'>
                        <NavLink to='/spots/create' className='create-link'><span >Create a New Spot</span></NavLink>
                        </li>

                )}
                    <li id= 'profile'>
                        <ProfileButton user={sessionUser} className='profile-button' />
                    </li>
                </div>

            )}
        </ul>
    )
    
    // const navLinks = sessionUser ? (
    //         <li>
    //             <ProfileButton user={sessionUser} />
    //         </li>
    // ) : (
    //     <>
    //         <li>
    //             <OpenModalButton buttonText='Log In' modalComponent={<LoginFormModal/>}/>
    //         </li>
    //         <li>
    //             <OpenModalButton buttonText='Sign up' modalComponent={<SignupFormModal/>}/>
    //         </li>
    //     </>
    // )


    // return (
    //     <ul>
    //         < NavLink to='/'>Home</NavLink>
    //         {isLoaded && navLinks}
    //     </ul>
    // )
}


export default Navigation