
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
        <ul>
            <li>
                <NavLink to='/'>Home</NavLink>
            </li>
            {isLoaded && (
                <li>
                    <ProfileButton user={sessionUser} />
                </li>
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