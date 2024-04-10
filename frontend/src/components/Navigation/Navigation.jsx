
import { useSelector } from "react-redux"
import { NavLink } from "react-router-dom";


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
                <NavLink to='/' className='logo-link'><h1>NEST AWAY</h1></NavLink>
                
            </li>
            {isLoaded && (
                <div className='right-side'>
                {sessionUser && (
                        <li id='create-spot'>
                        <NavLink to='/create-a-spot' className='create-link'><span >Got a spot for a squat?</span></NavLink>
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