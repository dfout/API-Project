import { useState, useEffect } from "react";
const Slide = ({ currentImage, nextImage, onSlide }) => {
    const [isSliding, setIsSliding] = useState(false);
  
    useEffect(() => {
      if (currentImage !== nextImage) {
        setIsSliding(true);
        const timeout = setTimeout(() => {
          setIsSliding(false);
          onSlide(); // Callback after animation completes
        }, 300); // Adjust duration for animation (in ms)
        return () => clearTimeout(timeout);
      }
    }, [currentImage, nextImage, onSlide]);
  
    const slideStyle = {
      transform: isSliding ? `translateX(-100%)` : 'translateX(0)',
      transition: `transform 0.3s ease-in-out`, // Adjust animation properties
      width:'315px',
      height:'305px'
    };
  
    return (
        <div className="slide-container">
        <img src={currentImage} alt="" style={slideStyle} />
        <img src={nextImage} alt="" style={{ ...slideStyle, opacity: 0, visibility: 'hidden' }} /> 
      </div>
    );
  };

  export default Slide