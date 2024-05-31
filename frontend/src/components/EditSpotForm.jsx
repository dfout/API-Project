import { useNavigate, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import * as spotActions from '../store/spot'
import { Navigate } from "react-router-dom";
import { useEffect } from "react";
import { useSelector } from 'react-redux';
import { useState } from "react";
import { UpdateSpotThunk } from "../store/spot";


export default function EditSpotForm (){
    const {spotId} = useParams();
   
    let spot = useSelector((state)=> state.spots[spotId])
    // const spot = spots[spotId]
    console.log(spot)
    const dispatch = useDispatch();
    const navigate = useNavigate()

    // useEffect(()=>{

    //     dispatch(UpdateSpotThunk(spot))

    // },[spot])




    const sessionUser = useSelector((state) => state.session.user);
    const [country, setCountry] = useState(spot.country);
    const [address, setAddress] = useState(spot.address);
    const [city, setCity] = useState(spot.city);
    const [state, setState] = useState(spot.state);
    const [lat, setLat] = useState(spot.lat);
    const [lng, setLng] = useState(spot.lng);
    const [description, setDescription] = useState(spot.description);
    const [name, setName] = useState(spot.name);
    const [price, setPrice] = useState(spot.price);
    const [previewImage, setPreviewImage] = useState(spot.previewImage)
    const [SpotImages, setSpotImages] = useState(spot.SpotImages);
    const [validationErrors, setValidationErrors] = useState({});
    const [hasSubmitted, setHasSubmitted] = useState(false)




    const regex = /\.(png|jpg|jpeg)$/i;


    useEffect(()=>{
      const errors = {};
      if (!country.length) errors.country =  "Country is required"
      if(!address.length) errors.address = "Address is required"
      if(!city.length) errors.city = "City is required"
      if(!state.length) errors.state = "State is required"
      if(!lat) errors.lat = "Latitude must be within -90 and 90"
      if(!lng) errors.lng = "Longitude must be within -180 and 180"
      if(!description.length && description.length >= 30) errors.description = "Please provide a description of your spot at least 30 characters long"
      if(!name) errors.name = "Please provide a name for your spot"
      if(!price && price <1) errors.price = "Please provide a price per night"
      if(!previewImage.length) errors.previewImage = "Please provide a preview image"
      if(!regex.test(previewImage)) errors.previewImage = "Preview Image must end in .png, .jpg, or  .jpeg"

      setValidationErrors(errors)
    },[country, address, city, state, lat, lng, description, name, price, previewImage, SpotImages])


    const handleSubmit = async (e) =>{
      e.preventDefault();
      setHasSubmitted(true)

      if (!Object.values(validationErrors).length){
        const updatedSpot = {
          id:spotId, 
          country, 
          address,
          city, 
          state, 
          lat,
          lng,
          description,
          name, 
          price, 
          previewImage, 
          SpotImages
        }

        const response = await dispatch(UpdateSpotThunk(updatedSpot))
        if (response === true){
          navigate(`/spots/${spotId}`)
        }else{
          return null

          }
          
        }
      }

    // const handleSubmit = (e) => {
    //     e.preventDefault();
        
        
    //       setErrors({});
    //       return dispatch(
    //         UpdateSpotThunk({
    //             ownerId: sessionUser.id,
    //             address,
    //             city,
    //             state,
    //             country,
    //             lat,
    //             lng,
    //             name,
    //             description,
    //             price,
    //             previewImage,
    //             id:spotId
               
    //         })
    //       ).catch(async (res) => {
    //         console.log(res)
    //         const data = await res.json();
    //         console.log(data)
    //         if (data?.errors) {
    //           setErrors(data.errors);
    //         }else{
              
              
    //           const createdPreviewImage = {
    //             url:previewImage,
    //             preview:true,
    //             spotId: spotId
    //           }
    //           dispatch(spotActions.setSpotImagesThunk(createdPreviewImage))
    //           SpotImages.forEach((image)=>{
    //             const spotImage = {
    //               url:image,
    //               preview:false,
    //               spotId: spotId
    //             }
    //             dispatch(spotActions.setSpotImagesThunk(spotImage))
    //           })
    
    //           navigate(`/spots/${spotId}`)
    //         }
    //         navigate(`/spots/${spotId}`)
    //       });

    //   };


    return(
        // <SpotForm formType={'Edit Your Spot'} spot={spot}/>
        <>
      <h2>Edit Your Spot</h2>
      <h3>Where is your place located?</h3>
      <p className ='paragraph'>Guests will only recieve your exact address once they have booked a reservation.</p>
      <form onSubmit={handleSubmit}>
        <label>
          Country
          <input
            type="text"
            value={country}
            placeholder='Country'
            onChange={(e) => setCountry(e.target.value)}
           
          />
        </label>
        {validationErrors.country && <p>{validationErrors.country}</p>}
        <label>
          Street Address
          <input
            type="text"
            value={address}
            placeholder='Address'
            onChange={(e) => setAddress(e.target.value)}
            
          />
        </label>
        {validationErrors.address && <p>{validationErrors.address}</p>}
        <label>
          City
          <input
            type="text"
            placeholder='City'
            value={city}
            onChange={(e) => setCity(e.target.value)}
           
          />
        </label>
        {validationErrors.city && <p>{validationErrors.city}</p>}
        <label>
          State
          <input
            type="text"
            placeholder='STATE'
            value={state}
            onChange={(e) => setState(e.target.value)}
            
          />
        </label>
        {validationErrors.state&& <p>{validationErrors.state}</p>}
        <label>
          Latitude
          <input
            type="text"
            placeholder='Latitude'
            value={lat}
            onChange={(e) => setLat(e.target.value)}
            
          />
        </label>
        {validationErrors.lat && <p>{validationErrors.lat}</p>}
        <label>
          Long
          <input
            type="text"
            placeholder='Longitude'
            value={lng}
            onChange={(e) => setLng(e.target.value)}
            
          />
        </label>
        {validationErrors.lng && <p>{validationErrors.lng}</p>}
        <label>
          Describe your place to Guests
          <p className ='paragraph'>Mention the best fearutes of your space, any special amenitites like fast wifi or parking, and what you love about the neighborhood.</p>
          <input
            type="text"
            value={description}
            placeholder='Please write at least 30 characters'
            onChange={(e) => setDescription(e.target.value)}
            
          />
        </label>
        {validationErrors.description && <p>{validationErrors.description}</p>}
        <label>
          Create a title for your spot
          <p className ='paragraph'>Catch guests' attentions with a spot title that highlights what makes your place great.</p>
          <input
            type="text"
            value={name}
            placeholder='Name of your spot'
            onChange={(e) => setName(e.target.value)}
            
          />
        </label>
        {validationErrors.name && <p>{validationErrors.name}</p>}
        <label>
          Set a base price for your spot
          <p className ='paragraph'>Competitive pricing can help your listing stand out and rank higher in search results</p>
          $<input
            type="text"
            value={price}
            placeholder='Price per night (USD)'
            onChange={(e) => setPrice(Number(e.target.value))}
          />
        </label>
        {validationErrors.price && <p>{validationErrors.price}</p>}
        <label>
            Liven up your spot with photos
            <p className='paragraph'>Submit a link to at least one photo to publish your spot</p>
            <input 
            type='text'
            placeholder='Preview Image URL'
            value={previewImage}
            onChange={(e)=> setPreviewImage(e.target.value)}
            />
            {validationErrors.previewImage && <p>{validationErrors.previewImage}</p>}
            <input 
            type='text'
            placeholder='Image URL'
            value={SpotImages[0] || ''} 
            onChange={(e) => setSpotImages([e.target.value, ...SpotImages.slice(1)])}

            />
                 <input 
            type='text'
            placeholder='Image URL'
            value={SpotImages[1] || ''} 
            onChange={(e) => setSpotImages([...SpotImages.slice(0, 1), e.target.value, ...SpotImages.slice(2)])}
            />
                 <input 
            type='text'
            placeholder='Image URL'
            value={SpotImages[2] || ''}
            onChange={(e) => setSpotImages([...SpotImages.slice(0, 2), e.target.value, ...SpotImages.slice(3)])}
            />
                 <input 
            type='text'
            placeholder='Image URL'
            value={SpotImages[3] || ''}
            onChange={(e) => setSpotImages([...SpotImages.slice(0, 3), e.target.value])}
            />
          
        </label>
    
        <button type="submit" onClick={handleSubmit}>Update Spot</button>
      </form>
    </>
    )
}