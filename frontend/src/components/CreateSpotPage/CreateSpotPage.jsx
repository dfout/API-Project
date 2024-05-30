import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
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
  const [errors, setErrors] = useState({});


//   if (sessionUser) return <Navigate to="/" replace={true} />;

  const handleSubmit = (e) => {
    e.preventDefault();
    
    
      setErrors({});
      return dispatch(
        spotActions.createSpotThunk({
            ownerId: sessionUser.id,
            address,
            city,
            state,
            country,
            lat,
            lng,
            name,
            description,
            price,
            previewImage
        })
      ).catch(async (res) => {
        const data = await res.json();
        if (data?.errors) {
          setErrors(data.errors);
        }else{
          
          const createdSpotId = data.spot.id;
          const createdPreviewImage = {
            url:previewImage,
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

          return <Navigate to={`/spots/${createdSpotId}`}/>
        }
      });
  };

  return (
    <>
      <h2>Create a new Spot</h2>
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
        {errors.country && <p>{errors.country}</p>}
        <label>
          Street Address
          <input
            type="text"
            value={address}
            placeholder='Address'
            onChange={(e) => setAddress(e.target.value)}
            
          />
        </label>
        {errors.address && <p>{errors.address}</p>}
        <label>
          City
          <input
            type="text"
            placeholder='City'
            value={city}
            onChange={(e) => setCity(e.target.value)}
           
          />
        </label>
        {errors.city && <p>{errors.city}</p>}
        <label>
          State
          <input
            type="text"
            placeholder='STATE'
            value={state}
            onChange={(e) => setState(e.target.value)}
            
          />
        </label>
        {errors.state&& <p>{errors.state}</p>}
        <label>
          Latitude
          <input
            type="text"
            placeholder='Latitude'
            value={lat}
            onChange={(e) => setLat(e.target.value)}
            
          />
        </label>
        {errors.lat && <p>{errors.lat}</p>}
        <label>
          Long
          <input
            type="text"
            placeholder='Longitude'
            value={lng}
            onChange={(e) => setLng(e.target.value)}
            
          />
        </label>
        {errors.lng && <p>{errors.lng}</p>}
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
        {errors.description && <p>{errors.description}</p>}
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
        {errors.name && <p>{errors.name}</p>}
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
        {errors.price && <p>{errors.price}</p>}
        <label>
            Liven up your spot with photos
            <p className='paragraph'>Submit a link to at least one photo to publish your spot</p>
            <input 
            type='text'
            placeholder='Preview Image URL'
            value={previewImage}
            onChange={(e)=> setPreviewImage(e.target.value)}
            />
            {errors.previewImage && <p>{errors.previewImage}</p>}
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
    
        <button type="submit" onSubmit={handleSubmit}>Create Spot</button>
      </form>
    </>
  );
}

export default CreateSpotPage;