import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useModal } from '../../context/Modal';
import { postReviewThunk } from "../../store/review";
import { FaStar, FaRegStar } from "react-icons/fa";
import './ReviewModal.css'; // Ensure you import your CSS file

const ReviewModal = ({ spotId }) => {
  const dispatch = useDispatch();
  const user = useSelector(state => state.session.user);
  const [review, setReview] = useState("");
  const [stars, setStars] = useState(0);
  const [disabled, setDisabled] = useState(true);
  const [errors, setErrors] = useState({});
//   const [reviewErrors, setReviewErrors] = useState("")
  const [filled, setFilled] = useState(0);
  const [active, setActive] = useState(0);
  const [hasSubmitted, setHasSubmitted] = useState(false)
  const [beforeSubErrors, setBeforeSubErrors] = useState({})
  const { closeModal } = useModal();
  const ratings = [1, 2, 3, 4, 5];

  useEffect(() => {
    const errors = {};
    if (review.length > 9 && stars > 0) {
      setDisabled(false);
    } else {
      setDisabled(true);
    }

    if(review.length < 10) errors.review = "Review must be at least 10 characters"
    if(review.length >= 10) errors.review = ""
    if(!stars) errors.stars = "Please enter a star rating by clicking on the stars"

    setErrors(errors)
  }, [review, stars]);

  const handleSubmit = (e) => {
    e.preventDefault();
   setHasSubmitted(true)


    
    return dispatch(postReviewThunk({ review, stars }, spotId, user))
      .then(closeModal)
      .catch(async (res) => {
        const data = await res.json();
        if (data && data.message) {
          setErrors(data.message);
        }
      });
  };

  const handleBlur = () =>{
    let errors ={}
    if(review.length < 10){
        errors.review = ("Review must be at least 10 characters")
    }
    if(review.length >=10){
        errors.review = ""
    }
    setBeforeSubErrors(errors)
    
  }

  return (
    <div className="create-review-cont">
      <h1>How was your stay?</h1>
      <form onSubmit={handleSubmit}>
        <textarea
          rows={3}
          cols={30}
          minLength="30"
          value={review}
          placeholder="Leave your review here..."
          onChange={(e) =>{
            setReview(e.target.value)
            if(review.length >=10) beforeSubErrors.review = ""

          }}
          required
          onBlur={handleBlur}
        />
        {beforeSubErrors.review && <p>{beforeSubErrors.review}</p>}
        { hasSubmitted && errors.review && <p>{errors.review}</p>}
        <div className="star-rating">
          {ratings.map((star, index) => {
            let starRating = index + 1;
            return (
              <label key={starRating}>
                <input 
                  type="radio" 
                  name="starRating" 
                  value={starRating} 
                  onClick={() => {
                    setStars(starRating);
                    setFilled(starRating);
                  }} 
                  onChange={() => setStars(starRating)}
                />
                <i 
                  onMouseEnter={() => setActive(starRating)}
                  onMouseLeave={() => setActive(0)}
                  style={{ color: active >= starRating || starRating <= filled ? "gold" : "grey" }}
                >
                  {active >= starRating || starRating <= filled ? <FaStar /> : <FaRegStar />}
                </i>
              </label>
            );
          })}
          <span>{stars} Stars</span>
          {hasSubmitted && errors.stars && <p>{errors.stars}</p>}
        </div>
        <button className="submit-review-button" disabled={disabled} type="submit">Submit Your Review</button>
      </form>
    </div>
  );
};

export default ReviewModal;