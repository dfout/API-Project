import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
// import { Navigate } from 'react-router-dom';
import * as spotActions from './../../store/spot'
import './CreateSpotPage.css'

function CreateSpotPage() {
  const dispatch = useDispatch();
  const sessionUser = useSelector((state) => state.session.user);
  const [country, setCountry] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");
  const [description, setDescription] = useState("");
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [previewImage, setPreviewImage] = useState("")
  const [SpotImages, setSpotImages] = useState([]);
  // const [errors, setErrors] = useState({});

  const navigate = useNavigate();


      
  const [validationErrors, setValidationErrors] = useState({});
  const [hasSubmitted, setHasSubmitted] = useState(false)


  const [spotImage1, setSpotImage1] = useState('')
  const [spotImage2, setSpotImage2] = useState('')
  const [spotImage3, setSpotImage3] = useState('')
  const [spotImage4, setSpotImage4] = useState('')

//   if (sessionUser) return <Navigate to="/" replace={true} />;





  useEffect(()=>{
    const errors = {};
    const regex = /\.(png|jpg|jpeg)$/i;
     // regexNum is true when the string is only numbers
    const onlyNum = /^\d+$/;
    // regexNum is true when the string is only numbers
    const onlyAlpha = /^\D*$/;
    //for coordinates, they have - 
    const isCoords = /^[0-9-]+$/;
   
    
    // console.log(lat.length) // shows 2
    // console.log(typeof lat) //shows string
    // console.log(isCoords.test(lat), "IS COORDS") //shows true
    // console.log(Number(lat)< -90) //false
    // console.log(Number(lat)> 90)//false
    // console.log(lat.length && isCoords.test(lat) && (Number(lat)< -90 || Number(lat)>90))//false
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

    // const imageErrors = {};
    if(spotImage1.length && !regex.test(spotImage1)) errors.image1 = "Images must end in .png, .jpg, .jpeg"
    if(spotImage2.length && !regex.test(spotImage2)) errors.image2 = "Images must end in .png, .jpg, or .jpeg"
    if(spotImage3.length!= ''  && !regex.test(spotImage3)) errors.image3 = "Images must end in .png, .jpg, or .jpeg"
    if(spotImage4!= '' && !regex.test(spotImage4)) errors.image4 = "Images must end in .png, .jpg, or .jpeg"

    // if(Object.values(imageErrors).length){
    //   errors.Images = {...imageErrors}
    // }
    // setHasSubmitted(false)
   
    setValidationErrors(errors)
  },[country, address, city, state, lat, lng, description, name, price, previewImage, SpotImages, spotImage1, spotImage2, spotImage3, spotImage4])



  const handleSubmit = async(e) => {
    e.preventDefault();
    setHasSubmitted(true)

    const images = [];
    if(spotImage1.length) images.push(spotImage1)
    if(spotImage2.length) images.push(spotImage2)
    if(spotImage3.length) images.push(spotImage3)
    if(spotImage4.length) images.push(spotImage4)

    setSpotImages(images)

    if(!Object.values(validationErrors).length){
      const newSpot = 
      {
        ownerId:sessionUser.id,
        address,
        city,
        state,
        country,
        lat,
        lng,
        name,
        description,
        price,
        previewImage, 
        SpotImages
      }
     const responseBody = await dispatch(spotActions.createSpotThunk(newSpot))
     if(!responseBody.id){
      const data = await responseBody.json()
      if (data?.errors) {
        setValidationErrors(data.errors);
      }
     }
      const createdSpotId = responseBody.id
      const createdPreviewImage = {
        url :previewImage, 
        preview:true, 
        spotId: createdSpotId
      }
      dispatch(spotActions.setSpotImagesThunk(createdPreviewImage))
      SpotImages.forEach((image)=>{
        const spotImage = {
          url:image,
          preview:false,
          spotId: createdSpotId
        }
        dispatch(spotActions.setSpotImagesThunk(spotImage))
      })
        // setAddress('')
        // setCity('')
        // setState('')
        // setCountry('')
        // setDescription('')
        // setLat('')
        // setLng('')
        // setName('')
        // setPrice('')
        // setPreviewImage('')
        // setSpotImages('')
        navigate(`/spots/${createdSpotId}`)
    }
}



  return (
    <div className="Spot-Form">
      <form onSubmit={handleSubmit}>
      <div>
      <h2>Create a new Spot</h2>
      <h3>Where is your place located?</h3>
      <p className ='paragraph'>Guests will only recieve your exact address once they have booked a reservation.</p>
      </div>
        <label>
          Country
          <input
            type="text"
            value={country}
            placeholder='Country'
            onChange={(e) => setCountry(e.target.value)}
           
          />
        </label>
        {hasSubmitted && validationErrors.country && (<p>{validationErrors.country}</p>)}
        <label>
          Street Address
          <input
            type="text"
            value={address}
            placeholder='Address'
            onChange={(e) => setAddress(e.target.value)}
            
          />
        </label>
        {hasSubmitted && validationErrors.address && <p>{validationErrors.address}</p>}
        <label>
          City
          <input
            type="text"
            placeholder='City'
            value={city}
            onChange={(e) => setCity(e.target.value)}
           
          />
        </label>
        {hasSubmitted && validationErrors.city && <p>{validationErrors.city}</p>}
        <label>
          State
          <input
            type="text"
            placeholder='STATE'
            value={state}
            onChange={(e) => setState(e.target.value)}
            
          />
        </label>
        {hasSubmitted && validationErrors.state && <p>{validationErrors.state}</p>}
        <label>
          Latitude
          <input
            type="text"
            placeholder='Optional'
            value={lat}
            onChange={(e) => setLat(e.target.value)}
            
          />
        </label>
        {hasSubmitted && validationErrors.lat && <p>{validationErrors.lat}</p>}
        <label>
          Long
          <input
            type="text"
            placeholder='Optional'
            value={lng}
            onChange={(e) => setLng(e.target.value)}
            
          />
        </label>
        {hasSubmitted && validationErrors.lng && <p>{validationErrors.lng}</p>}
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
        {hasSubmitted && validationErrors.description && <p>{validationErrors.description}</p>}
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
        {hasSubmitted && validationErrors.name && <p>{validationErrors.name}</p>}
        <label>
          Set a base price for your spot
          <p className ='paragraph'>Competitive pricing can help your listing stand out and rank higher in search results</p>
          $<input
            type="text"
            value={price}
            placeholder='Price per night (USD)'
            onChange={(e) => setPrice(e.target.value)}
          />
        </label>
        {hasSubmitted && validationErrors.price && <p>{validationErrors.price}</p>}
        <label>
            Liven up your spot with photos
            <p className='paragraph'>Submit a link to at least one photo to publish your spot</p>
            <input 
            type='text'
            placeholder='Preview Image URL'
            value={previewImage}
            onChange={(e)=> setPreviewImage(e.target.value)}
            />
          

            {hasSubmitted && validationErrors.previewImage && <p>{validationErrors.previewImage}</p>}
           
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
        </label>
        {hasSubmitted && validationErrors.image4 && (<p>{validationErrors.image4}</p>)}
        {/* {hasSubmitted && validationErrors.Images && (<p>{validationErrors.Images}</p>)} */}
        <button type="submit" onClick={handleSubmit}>Create Spot</button>
      </form>
    </div>
  );
}

export default CreateSpotPage;