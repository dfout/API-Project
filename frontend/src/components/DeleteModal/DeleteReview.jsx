// import { useState } from "react"
// import * as sessionActions from '../../store/session'
import { useDispatch } from "react-redux"
// import { Navigate } from "react-router-dom";
// import { logInUserThunk } from "../../store/session";
import {useModal} from '../../context/Modal'
// import { useSelector } from "react-redux"
// import { getAllSpotsThunk } from "../../store/spot"
// import { useEffect } from "react"

// import React from 'react';
import { deleteReviewThunk } from "../../store/review"

export const DeleteReviewModal = ({reviewId})=>{
    console.log("REVIEW ID",reviewId)
    const dispatch = useDispatch();
    const {closeModal} = useModal()
    // const reviews = useSelector((state)=> state.reviews)
    // const review = reviews[review.id]



    // useEffect(()=>{
    //     dispatch(getAllSpotsThunk())
    // },[])

    const handleDelete = async() =>{
        // e.preventDefault();
        console.log(reviewId)
        const response = await dispatch(deleteReviewThunk(reviewId))
        
        if(response == true){
            closeModal();
        }else{
            return null
        }
    }

    return (
        <>
        <button onClick={handleDelete}>Yes (Delete Review)</button>
        <button onClick={closeModal}>No(Keep Review)</button>
        </>

    )
}