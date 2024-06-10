import { useNavigate, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
// import * as spotActions from '../store/spot'
// import { Navigate } from "react-router-dom";
import { useEffect } from "react";
import { useSelector } from 'react-redux';
import { useState } from "react";
import { UpdateSpotThunk } from "../store/spot";


export default function EditSpotForm (){
    const {spotId} = useParams();
   
    let spot = useSelector((state)=> state.spots[spotId])
    // const spot = spots[spotId]
   
    const dispatch = useDispatch();
    const navigate = useNavigate()



    // const sessionUser = useSelector((state) => state.session.user);
    const [country, setCountry] = useState(spot.country ? spot.country: '');
    const [address, setAddress] = useState(spot.address ? spot.address: '');
    const [city, setCity] = useState(spot.city ? spot.city: '');
    const [state, setState] = useState(spot.state ? spot.state: '');
    const [lat, setLat] = useState(spot.lat ? spot.lat: '');
    const [lng, setLng] = useState(spot.lng ? spot.lng: '');
    const [description, setDescription] = useState(spot.description ? spot.description: '');
    const [name, setName] = useState(spot.name ? spot.name: '');
    const [price, setPrice] = useState(spot.price ? spot.price :'');
    const [previewImage, setPreviewImage] = useState(spot.previewImage? spot.previewImage :'')
    const [SpotImages] = useState(spot.SpotImages);

    const [validationErrors, setValidationErrors] = useState({});
    const [hasSubmitted, setHasSubmitted] = useState(false)


    const [spotImage1, setSpotImage1] = useState(spot.SpotImages[0]? spot.SpotImages[0].url:'')
    const [spotImage2, setSpotImage2] = useState(spot.SpotImages[1]? spot.SpotImages[1].url:'')
    const [spotImage3, setSpotImage3] = useState(spot.SpotImages[2]? spot.SpotImages[2].url:'')
    const [spotImage4, setSpotImage4] = useState(spot.SpotImages[3]? spot.SpotImages[3].url:'')


    
    


    useEffect(()=>{
      const errors = {};
      const regex = /\.(png|jpg|jpeg)$/i;
       // regexNum is true when the string is only numbers
      const onlyNum = /^\d+$/;
      // regexNum is true when the string is only numbers
      const onlyAlpha = /^\D*$/;
      //for coordinates, they have - 
      const isCoords = /^[0-9-]+$/;
     
      if (!country.length) errors.country =  "Country is required"
      if(country.length && !onlyAlpha.test(country)) errors.country = "Country must not contain numbers"
      if(!address.length && typeof address == 'string') errors.address = "Address is required"
      if(!city.length) errors.city = "City is required"
      if(city.length && !onlyAlpha.test(city)) errors.city = "City must not contain numbers"
      if(!state.length) errors.state = "State is required"
      if (state.length && !onlyAlpha.test(state)) errors.state = "State must not contain numbers"
      // if(lat.length && !onlyNum.test(lat)) errors.lat = "Latitude must be a number between -90 and 90"
      if(lat.length && !isCoords.test(lat)) errors.lat = "Latitude must be a number between -90 and 90"
      if(lat.length && isCoords.test(lat) && (Number(lat)< -90 || Number(lat)>90)) errors.lat = "Latitude must be within -90 and 90"
      if(lng.length && !isCoords.test(lng)) errors.lng = "Latitude must be a number between -90 and 90"
      if(lng.length && isCoords.test(lng)&& (Number(lng)<-180 || Number(lng)> 180)) errors.lng = "Longitude must be a number between -180 and 180"
      // if(Number(lng)<-180 || Number(lng)> 180) errors.lng = "Longitude must be within -180 and 180"
      if(!description.length || description.length < 30 || typeof description !=='string') errors.description = "Please provide a description of your spot at least 30 characters long"
      if(!name) errors.name = "Please provide a name for your spot"
      if(onlyNum.test(name)) errors.name = "Title for your spot must contain letters"
      if(!price || price <1 && onlyNum.test(price)) errors.price = "Please provide a valid price in USD"
      if(!onlyNum.test(price)) errors.price = "Price must be a valid numerical input over 0 in USD"
      if(!previewImage.length) errors.previewImage = "Please provide a preview image"
      if(!regex.test(previewImage)) errors.previewImage = "Preview Image must end in .png, .jpg, or  .jpeg"
  

      if(spotImage1.length && !regex.test(spotImage1)) errors.image1 = "Images must end in .png, .jpg, .jpeg"
      if(spotImage2.length && !regex.test(spotImage2)) errors.image2 = "Images must end in .png, .jpg, or .jpeg"
      if(spotImage3.length!= ''  && !regex.test(spotImage3)) errors.image3 = "Images must end in .png, .jpg, or .jpeg"
      if(spotImage4!= '' && !regex.test(spotImage4)) errors.image4 = "Images must end in .png, .jpg, or .jpeg"
  
     
      setValidationErrors(errors)
    },[country, address, city, state, lat, lng, description, name, price, previewImage, SpotImages, spotImage1, spotImage2, spotImage3, spotImage4])


    const handleSubmit = async (e) =>{
      e.preventDefault();
      setHasSubmitted(true)

      //! Backend route does not exist yet

      // const images = [];
      // if(spotImage1.length) images.push(spotImage1)
      // if(spotImage2.length) images.push(spotImage2)
      // if(spotImage3.length) images.push(spotImage3)
      // if(spotImage4.length) images.push(spotImage4)

      // setSpotImages(images)

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



    return(
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
          <p className ='paragraph'>Catch guests attentions with a spot title that highlights what makes your place great.</p>
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
            value={spotImage1} 
            onChange={(e) => setSpotImage1(e.target.value)}
            />
                        {hasSubmitted && validationErrors.image1 && <p>{validationErrors.image1}</p>}
                 <input 
            type='text'
            placeholder='Image URL'
            value={spotImage2} 
            onChange={(e) => setSpotImage2(e.target.value)}
            />
                        {hasSubmitted && validationErrors.image2 && (<p>{validationErrors.image2}</p>)}
                 <input 
            type='text'
            placeholder='Image URL'
            value={spotImage3}
            onChange={(e) => setSpotImage3(e.target.value)}
            />
                        {hasSubmitted && validationErrors.image3 && (<p>{validationErrors.image3}</p>)}
                 <input 
            type='text'
            placeholder='Image URL'
            value={spotImage4}
            onChange={(e) => setSpotImage4(e.target.value)}
            />
                    {hasSubmitted && validationErrors.image4 && (<p>{validationErrors.image4}</p>)}
        </label>
        {validationErrors.Images && <p>{validationErrors.Images}</p>}
    
        <button type="submit" onClick={handleSubmit}>Update Spot</button>
      </form>
    </>
    )
}