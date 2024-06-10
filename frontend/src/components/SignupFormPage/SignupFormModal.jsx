import { useState } from "react"
import { useDispatch } from "react-redux"
// import { Navigate } from "react-router-dom";
import * as sessionActions from '../../store/session'
import './SignupForm.css'
import { useEffect } from "react";
import { useModal } from "../../context/Modal";
import {FaEye, FaEyeSlash} from 'react-icons/fa'


const SignupFormModal= () => {

    const [username, setUsername] = useState('')
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [email,setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [errors, setErrors] = useState({})
    const [hasSubmitted, setHasSubmitted] = useState(false)
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const dispatch = useDispatch();
    const {closeModal} =useModal();
    

    const signUpUserThunk = sessionActions.signUpUserThunk
    // const sessionUser = useSelector((state)=>state.session.user);

    // if(sessionUser) return <Navigate to='/' replace={true} />

    useEffect(()=>{
        const onlyAlpha = /^[a-zA-Z]+$/;
        const validationErrors = {};
        if(!firstName.length) validationErrors.firstName = "Please provide your first name"
        if(!onlyAlpha.test(firstName)) validationErrors.firstName = "First name can only include letters"
        if (!lastName.length) validationErrors.lastName = "Please provide your last name"
        if(!onlyAlpha.test(lastName)) validationErrors.lastName = "Last name can only include letters"
        if(username.length < 4) validationErrors.username="Username must be at least 4 characters long"
        if(password.length < 6) validationErrors.password="Password must be at least 6 characters"
        if(password !== confirmPassword) validationErrors.confirmPassword = "Confirm Password field must be the same as the Password Field"

        setErrors({...validationErrors})
        console.log("IN USE EFFECT",errors)
    },[firstName, lastName,username, password, confirmPassword])

    console.log("ERRORS BEFORE SUBMIT", errors)

    const handleSubmit = async(e)=>{
        e.preventDefault();
        setHasSubmitted(true)
        if (password === confirmPassword){
            setErrors({})
            // const response = dispatch(signUpUserThunk({username, firstName, lastName, email, password}));
            // console.log("AFTER DISPATCH", response)
            console.log(errors)

            if(!Object.values(errors).length){
                return dispatch(signUpUserThunk({username, firstName, lastName, email, password})).then(closeModal).catch(
                    async(res)=>{
                        const data = await res.json();
                        
                            
                            setErrors(data.errors)
                            console.log(errors)
                            return null
                          
                    }
                )

            }

        }
        // return setErrors({
        //     confirmPassword: "Confirm Password field must be the same as the Password Field"
        // })
        

    };
    const isFormValid = ()=> {
        // const onlyAlpha = /^\D*$/;
       const isFilled =  username && firstName && lastName && email && password && confirmPassword 
      
       if (isFilled && username.length >=4 && password.length >=6){
        return true
       }else{
        return false
       }
    }

    console.log(errors)

    return(
        <div id="sign-up-modal">
        <h1>Sign Up</h1>
            <form id='sign-up-form' onSubmit={handleSubmit}>
                <div id='inputs'
                >
                     <label className="sign-up-label">Email
                    <input type='text' value={email} onChange={(e)=> setEmail(e.target.value)} className="custom-input"required />
                </label>
                {hasSubmitted && errors.email && <p>{errors.email}</p>}
                <label className="sign-up-label">Username
                    <input type='text' value={username} onChange={(e)=> setUsername(e.target.value)} className="custom-input"required />
                </label>
                {hasSubmitted && errors.username && <p>{errors.username}</p>}
                <label className="sign-up-label">First Name
                    <input type='text' value={firstName} onChange={(e)=> setFirstName(e.target.value)} className="custom-input"required />
                </label>
                {hasSubmitted && errors.firstName && <p>{errors.firstName}</p>}
                <label className="sign-up-label">Last Name
                    <input type='text' value={lastName} onChange={(e)=> setLastName(e.target.value)} className="custom-input" required />
                </label>
                {hasSubmitted && errors.lastName && <p>{errors.lastName}</p>}
                <div id='passwords'>
                <label className="sign-up-label">Password
                    <div className="password-container">
                        <input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)}  required />
                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="password-toggle">
                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </button>
                    </div>
                </label>
                {hasSubmitted && errors.password && <p>{errors.password}</p>}
              
                <label className="sign-up-label">Confirm Password 
                <div className="password-container">
                        <input type={showConfirmPassword ? 'text' : 'password'} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}  required />
                        <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="password-toggle">
                            {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                        </button>
                    </div>
                    </label>

                </div>
                </div>
                {hasSubmitted && errors.confirmPassword && <p>{errors.confirmPassword}</p>}
                <button type='submit' className='sign-up-button' disabled={!isFormValid()}>Sign Up</button>
            </form>
        </div>
    )
}


export default SignupFormModal;