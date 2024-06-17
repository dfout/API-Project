import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllSpotsThunk, getSpotsList } from '../../store/spot';
import { IoIosStar } from "react-icons/io";
import { Link } from 'react-router-dom';
import { MdKeyboardArrowRight, MdKeyboardArrowLeft } from "react-icons/md";
import './SpotsPage.css';

const SpotsPage = () => {
    const dispatch = useDispatch();
    const allSpots = useSelector(getSpotsList);
    const [currentImageIndex, setCurrentImageIndex] = useState({});

    useEffect(() => {
        dispatch(getAllSpotsThunk());
    }, [dispatch]);

    const handleNextImage = (spotId, spotImages) => {
        setCurrentImageIndex(prev => ({
            ...prev,
            [spotId]: (prev[spotId] || 0) < spotImages.length - 1 ? (prev[spotId] || 0) + 1 : prev[spotId]
        }));
    };

    const handlePrevImage = (spotId) => {
        setCurrentImageIndex(prev => ({
            ...prev,
            [spotId]: (prev[spotId] || 0) > 0 ? (prev[spotId] || 0) - 1 : prev[spotId]
        }));
    };

    return (
        <ul className='all-spots'>
            {allSpots?.map(({ id, previewImage, city, state, avgRating, price, name, SpotImages }) => {
                const currentIndex = currentImageIndex[id] || 0;
                const currentImage = SpotImages?.[currentIndex]?.url || previewImage;
                const isPreviewImage = currentIndex === 0;
                const isLastImage = SpotImages && currentIndex === SpotImages.length - 1;

                return (
                    <li className='spot-tile' key={id} id='spot-tile'>
                        <Link to={`/spots/${id}`} className='link-tile' id='link-tile'>
                            <div className='image-container'>
                                <img id='preview-image' src={currentImage} alt={`${name} in ${city}, ${state}`} title={`${name} in ${city}, ${state}`} />
                                {SpotImages && SpotImages.length > 1 && (
                                    <>
                                        {!isPreviewImage && (
                                            <div className='arrow-container arrow-left' onClick={(e) => { e.preventDefault(); handlePrevImage(id); }}>
                                                <MdKeyboardArrowLeft className='arrow-left-icon' />
                                            </div>
                                        )}
                                        {!isLastImage && (
                                            <div className='arrow-container arrow-right' onClick={(e) => { e.preventDefault(); handleNextImage(id, SpotImages); }}>
                                                <MdKeyboardArrowRight className='arrow-right-icon' />
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>
                            <div className='spot-info'>
                                <h3>{city}, {state}</h3>
                                <span id='ratings'>
                                    <IoIosStar />
                                    <span>{avgRating !== null ? avgRating : 'New'}</span>
                                </span>
                            </div>
                            <div className='spot-price'>
                                <span>${price} night </span>
                            </div>
                        </Link>
                    </li>
                );
            })}
        </ul>
    );
};

export default SpotsPage;

