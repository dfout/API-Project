import { useState, useEffect, useRef, } from "react"
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux"
// import { Navigate } from "react-router-dom";
import * as sessionActions from '../../store/session'
import './Navigation.css'
import './ProfileButton.css'

// import OpenModalButton from '../OpenModalButton';
import OpenModalMenuItem from './OpenModalMenuItem'
import LoginFormModal from "../LoginFormModal/LoginFormModal";
import SignupFormModal from "../SignupFormPage";

import { FaUserCircle } from "react-icons/fa";
import { IoIosMenu } from "react-icons/io";



const ProfileButton = ({user}) => {
    const [showMenu, setShowMenu] = useState(false)
    const dispatch = useDispatch();
    const ulRef = useRef()
    const navigate = useNavigate();
    // console.log(showMenu)

    useEffect(()=>{
        console.log("UPDATING STATE", showMenu)
        if(!showMenu) return;
        
        // Function that will close the menu, available to useEffect
        const closeOutsideClick = (e) => {
            // Apply logic to: only close the menu if the click does not contain any HTML elements of the drop-down Menu
            if (ulRef.current && !ulRef.current.contains(e.target)){
                // Setting the showMenu to false will trigger the closing of the dropdown menu. 
                setShowMenu(false)
            }
        }
        // Add an event Listener that will close the menu when the user clicks anywhere else on the page
        document.addEventListener('click', closeOutsideClick);

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

    const logout = async(e)=> {
        e.preventDefault()
        await dispatch(sessionActions.logoutUserThunk())
        closeMenu()

        navigate('/')
    }

    // const login = ()=>{
    //     setShowMenu(false)
    //     console.log("MENU",showMenu)
    // }

    const ulClassName = "profile-dropdown" + (showMenu ? "" : " hidden");
    



    // Add a style key directly if need be
    return(
        <div id= 'profile-bar'>
            <button className='profile-button' id='profile-button' onClick={toggleMenu}>
                <span className='menu-icon'>
                <IoIosMenu />
                </span>
                <span className="profile-icon">
                <FaUserCircle />
                </span>
            </button>
            <div className={ulClassName} ref={ulRef}>
               
                {user ? (
                    <div id='user-menu'>
                        <span id="greeting">Hello, {user.firstName}</span>
                        <div id="user-info">
                        <span>{user.username}</span>
                        <span>{user.firstName} {user.lastName}</span>
                        <span>{user.email}</span>
                        </div>
                        <div className="menu-links">
                        <Link to='/spots/manage'id="manage-spots" className="link">Manage Spots </Link>
                        <button id="logout-button" 
                        className="link"onClick={logout}>Log Out</button>
                        </div>
                
                    </div>
                ): (
                    <>
                        <div id='log-in-sign-up'>
                            <OpenModalMenuItem 
                            className='link' itemText='Log in' onButtonClick={closeMenu} 
                        style={{cursor:'pointer', textDecoration: 'none'}}modalComponent={<LoginFormModal/>}/>
                            <OpenModalMenuItem 
                            style={{cursor: 'pointer', textDecoration:'none'}}itemText='Sign up' className='modal-text item'onButtonClick={closeMenu} modalComponent={<SignupFormModal/>}/>
                        </div>
   
                        <div className="extra-info">
                            {/* <span>Gift Cards</span>
                            <span>Squatspot your home</span>
                            <span>Help Center</span> */}
                        </div>
                        </>
                )}
                
            </div>
        </div>
    )
}


export default ProfileButton