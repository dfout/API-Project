// // import { FaRegStar } from "react-icons/fa";
// import './RatingInput.css'
// import { useState } from 'react';
// import { useEffect } from "react";
// import { useModal } from "../../context/Modal";
// import { useDispatch, useSelector } from "react-redux";

// // import { FaStarHalf } from "react-icons/fa";
// import { FaStar } from "react-icons/fa";
// // import { FaStarHalfAlt } from "react-icons/fa";

// const RatingInput = ({ stars, disabled, onChange }) => {
//   const dispatch = useDispatch();
//   const user = useSelector(state => state.session.user);
 

//   const [review, setReview] = useState("");
//   const [stars, setStars] = useState(0);
//   const [hover, setHover] = useState(0);
//   const [disabled, setDisabled] = useState(true);
//   const [errors, setErrors] = useState({});
//   const { closeModal } = useModal();

//   useEffect(() => {
//    if (review.length > 9 && stars > 0) {
//     setDisabled(false);
//    } else {
//     setDisabled(true);
//    }
//   }, [review, stars]);

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     setErrors({});
    
//     console.log("spotId:", spot.id); 
//     dispatch(
//       createAReviewThunk(
//         spot.id, // Access spotId from spot object
//         { review, stars }, // Pass review object containing review and stars
//         user
//       )
//     )
//       .then(closeModal)
//       .catch(async (res) => {
//         const data = await res.json();
//         if (data && data.message) {
//           setErrors(data.message);
//         }
//       });
//   }
  
//   return (
//     <div className="create-review-cont">
//       <h1>How was your stay?</h1>
//       <form onSubmit={handleSubmit}>
//         <textarea
//           rows={3} cols={30}
//           minLength="30"
//           value={review}
//           placeholder="Leave your review here..."
//           onChange={(e) => setReview(e.target.value)}
//           required
//         />
//         {errors.review && <p>{errors.review}</p>}

//         <div className="star-rating">
//           {[...Array(5)].map((star, index) => {
//             index += 1;
//             return (
//               <button
//                 type="button"
//                 key={index}
//                 className={index <= (hover || stars) ? "on" : "off"}
//                 onClick={() => setStars(index)}
//                 onMouseEnter={() => setHover(index)}
//                 onMouseLeave={() => setHover(stars)}
//               >
//                 <span className="star">&#9733;</span>
//               </button>
//             );
//           })}
//           {errors.stars && <p>{errors.stars}</p>}
//           <span>Stars</span>
//         </div>
//         <button className="submit-review-button" disabled={disabled} type="submit">Submit Your Review</button>
//       </form>
//     </div>
//   );
//   };
  
//   export default RatingInput;