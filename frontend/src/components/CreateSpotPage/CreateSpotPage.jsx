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
  const [SpotImage, setSpotImages] = useState([]);
  const [errors, setErrors] = useState({});
  const SpotImages = [];

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
            onChange={(e) => setCountry(e.target.value)}
           
          />
        </label>
        {errors.country && <p>{errors.country}</p>}
        <label>
          Street Address
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            
          />
        </label>
        {errors.address && <p>{errors.address}</p>}
        <label>
          City
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
           
          />
        </label>
        {errors.city && <p>{errors.city}</p>}
        <label>
          State
          <input
            type="text"
            value={state}
            onChange={(e) => setState(e.target.value)}
            
          />
        </label>
        {errors.state&& <p>{errors.state}</p>}
        <label>
          Latitude
          <input
            type="text"
            value={lat}
            onChange={(e) => setLat(e.target.value)}
            
          />
        </label>
        {errors.lat && <p>{errors.lat}</p>}
        <label>
          Long
          <input
            type="text"
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
            value={SpotImage}
            onChange={(e)=> setSpotImages(e.target.value)}
            />
                 <input 
            type='text'
            placeholder='Image URL'
            value={SpotImage}
            onChange={(e)=> setSpotImages.push(e.target.value)}
            />
                 <input 
            type='text'
            placeholder='Image URL'
            value={SpotImage}
            onChange={(e)=> setSpotImages.push(e.target.value)}
            />
                 <input 
            type='text'
            placeholder='Image URL'
            value={SpotImage}
            onChange={(e)=> setSpotImages.push(e.target.value)}
            />
          
        </label>
    
        <button type="submit">Sign Up</button>
      </form>
    </>
  );
}

export default CreateSpotPage;