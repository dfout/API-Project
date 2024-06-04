import { useState } from "react"
import * as sessionActions from '../../store/session'
import { useDispatch } from "react-redux"
// import { Navigate } from "react-router-dom";
// import { logInUserThunk } from "../../store/session";
import {useModal} from '../../context/Modal'
import { useSelector } from "react-redux"
import { getAllSpotsThunk } from "../../store/spot"
import { useEffect } from "react"

// import React from 'react';
import { DeleteSpotThunk } from "../../store/spot"

export const DeleteModal = ({spotId})=>{
    console.log(spotId)

    const dispatch = useDispatch();
    const {closeModal} = useModal()


    const spots = useSelector((state)=> state.spots)
    const spot = spots[spotId]



    // useEffect(()=>{
    //     dispatch(getAllSpotsThunk())
    // },[])

    const handleDelete = async(e) =>{
        // e.preventDefault();
        const response = dispatch(DeleteSpotThunk(spot))
        
        if(response){
            closeModal();
        }
    }

    return (
        <>
        <button onClick={handleDelete}>Yes (Delete Spot)</button>
        <button onClick={closeModal}>No(Keep Spot)</button>

        </>

    )
}