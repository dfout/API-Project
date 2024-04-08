import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { NavLink, Navigate } from "react-router-dom";

import * as sessionActions from '../../store/session'
import './Navigation.css'
import ProfileButton from "./ProfileButton";


const Navigation = ({isLoaded})=>{
    const sessionUser = useSelector(state => state.session.user)
    const dispatch = useDispatch()

    const logout = (e)=> {
        e.preventDefault()
        dispatch(sessionActions.logOutUserThunk())
    }
    
    const navLinks = sessionUser ? (
        <>
            <li>
                <ProfileButton user={sessionUser} />
            </li>
            <li>
                <button onClick={logout}>Log Out</button>
            </li>
        </>
    ) : (
        <>
            <li>
                <NavLink to='/login'>Log In</NavLink>
            </li>
            <li>
                <NavLink to='/signup'>Sign Up</NavLink>
            </li>
        </>
    )


    return (
        <ul>
            <li Navigate to='/'>Home</li>
            {isLoaded && navLinks}
        </ul>
    )
}


export default Navigation