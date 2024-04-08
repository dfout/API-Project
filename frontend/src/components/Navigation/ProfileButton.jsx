import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Navigate } from "react-router-dom";
import * as sessionActions from '../../store/session'
import './Navigation.css'

import { CgProfile } from "react-icons/cg";



const ProfileButton = () => {

    // Add a style key directly if need be
    return(
        <div>
            <CgProfile />
        </div>
    )

}


export default ProfileButton