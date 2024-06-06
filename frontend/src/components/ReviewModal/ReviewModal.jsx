import { useState } from "react"
import * as reviewActions from '../../store/review'
import { useDispatch } from "react-redux"
// import { Navigate } from "react-router-dom";
// import { logInUserThunk } from "../../store/session";
import {useModal} from '../../context/Modal'
// import './LoginForm.css'
// import React from 'react';
import RatingInput from "./RatingInput"
import { useSelector } from "react-redux"

// import { FaRegStar } from "react-icons/fa";



const ReviewModal = ({spotId})=>{
    
    // const [username, setUsername] = useState('');
    // const [email, setEmail] = useState('');
    const [review, setReview] = useState('');
    const [stars, setStars] = useState("");

    const [errors, setErrors] = useState({})

    const dispatch = useDispatch();
    const {closeModal} = useModal()
    const sessionUser = useSelector((state)=>state.session.user);

    // if(sessionUser) return <Navigate to='/' replace={true} />

    // useEffect(()=>{
    //     dispatch(create)

    // }, [review, stars])


    const handleSubmit = async(e)=>{
        e.preventDefault();
        setErrors({});
        // let rating = Number(stars)
        // had const resposne = 
        return await dispatch(reviewActions.postReviewThunk({review, stars}, Number(spotId),sessionUser)).then(closeModal).catch(
            async(res)=>{
                const data = await res.json();
                
                if(res.status === 500){
                    setErrors(data.message)
                    console.log(data.message)
                }
                if (data?.errors) {
                    setErrors(data.errors);
                }
                
            }
        )
    };

    const isFormValid = ()=> review.length >=10 && stars

    // const handleStarHover = (hoveredRating) => {
    //     setStars(hoveredRating); // Update stars on hover
    // };

    // const handleClickStar = (clickedRating) => {
    //     setStars(clickedRating); // Update stars on click and persist
    // };

    const onChange = (e) => {
        const number = e.target.value;
        setStars(Number(number));
    };

    const onClickAway = () => {
        let errs = {};
        if (review.length < 10){
            console.log(review)
            errs["review"] = "Review must be at least 10 characters long"
            console.log(errs)
            setErrors(errs)
            console.log(errors)
        }
    }

   const  onChangeReview = (text) =>{
        // let newErrs = {};
        setReview(text)
        if(text.length >=10){
            if (errors.review){
               setErrors({})
            }
        }
    }

    


    //Now I want to track when the review text is = or longer than 10 char, I want to not display the review err. 

    return(
        <>
        <h4>How was your stay?</h4>
        {errors && <p>{errors.message}</p>}
        <form onSubmit={handleSubmit}>
            <label>Leave your review here...
                <input 
                type='text'
                value={review}
                onChange={(e)=>onChangeReview(e.target.value)}
                onBlur={onClickAway}
                />
            </label>
            {errors && <p>{errors.review}</p>}
            <RatingInput
            disabled={false}
            onChange={onChange}
            stars={stars}
            max="5"/>
                {errors && <p>{errors.stars}</p>}
            <button type='submit' disabled={!isFormValid()} onSubmit={handleSubmit}>Submit Your Review</button>

        </form>
        </>       
    );
};




export default ReviewModal