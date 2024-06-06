// import { FaRegStar } from "react-icons/fa";
import './RatingInput.css'

// import { FaStarHalf } from "react-icons/fa";
import { FaStar } from "react-icons/fa";
// import { FaStarHalfAlt } from "react-icons/fa";

const RatingInput = ({ stars, disabled, onChange }) => {



    return (
      <>
        <input
        type="number"
        max="5"
        disabled={disabled}
        value={stars}
        onChange={onChange}
      />
      <div className='rating-input'>
        <div className='filled'>
        <FaStar />
        </div>
        <div className='filled'>
        <FaStar />
        </div>
        <div className='filled'>
        <FaStar />
        </div>
        <div className='filled'>
        <FaStar />
        </div>
        <div className='filled'>
        <FaStar />
        </div>
      </div>
      </>

      
    );
  };
  
  export default RatingInput;