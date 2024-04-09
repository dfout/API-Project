import { useState, useEffect, useRef} from "react"
import { useDispatch } from "react-redux"
// import { Navigate } from "react-router-dom";
import * as sessionActions from '../../store/session'
import './Navigation.css'

import OpenModalButton from '../OpenModalButton';
import LoginFormModal from "../LoginFormModal/LoginFormModal";
import SignupFormModal from "../SignupFormPage";

import { CgProfile } from "react-icons/cg";



const ProfileButton = ({user}) => {
    const [showMenu, setShowMenu] = useState(false)
    const dispatch = useDispatch();
    const ulRef = useRef()

    useEffect(()=>{
        if(!showMenu) return;
        
        // Function that will close the menu, available to useEffect
        const closeMenu = (e) => {
            // Apply logic to: only close the menu if the click does not contain any HTML elements of the drop-down Menu
            if (ulRef.current && !ulRef.current.contains(e.target)){
                // Setting the showMenu to false will trigger the closing of the dropdown menu. 
                setShowMenu(false)
            }
        }
        // Add an event Listener that will close the menu when the user clicks anywhere else on the page
        document.addEventListener('click', closeMenu);

        // useEffect clean-up function will be used to then remove the event listener when the user then clicks away from the drop down. 
        return ()=> document.removeEventListener('click', closeMenu);
    },[showMenu])

    const closeMenu = () =>setShowMenu(false)

    // Create a callback that will stop any potential issues with the order of the listener and the click 
    // ? Still not exactly quite understanding what it is doing and what the issue it is trying to solve is. 
    // toggleMenu will replace the <button onClick={()=> setShowMenu(!showMenu)}

    const toggleMenu = (e) => {
        e.stopPropagation();
        setShowMenu(!showMenu)
    }

    const logout = (e)=> {
        e.preventDefault()
        dispatch(sessionActions.logOutUserThunk())
        closeMenu()
    }

    const ulClassName = "profile-dropdown" + (showMenu ? "" : " hidden");



    // Add a style key directly if need be
    return(
        <>
            <button onClick={toggleMenu}>
                <CgProfile />
            </button>
            <ul className={ulClassName} ref={ulRef}>
                {user ? (
                    <>
                        <li>{user.username}</li>
                        <li>{user.firstName} {user.lastName}</li>
                        <li>{user.email}</li>
                        <li><button onClick={logout}>Log Out</button></li>
                
                    </>
                ): (
                    <>
                    <li>
                        <OpenModalButton buttonText='Log in' onButtonClick={closeMenu} modalComponent={<LoginFormModal/>}/>
                    </li>
                    <li>
                        <OpenModalButton buttonText='Sign up' onButtonClick={closeMenu} modalComponent={<SignupFormModal/>}/>
                    </li>
                        
                    </>
                )}
                
            </ul>
        </>
    )
}


export default ProfileButton