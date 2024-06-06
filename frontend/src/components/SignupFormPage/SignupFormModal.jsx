import { useState } from "react"
import { useDispatch } from "react-redux"
// import { Navigate } from "react-router-dom";
import * as sessionActions from '../../store/session'
import './SignupForm.css'
import { useEffect } from "react";
import { useModal } from "../../context/Modal";


const SignupFormModal= () => {

    const [username, setUsername] = useState('')
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [email,setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [errors, setErrors] = useState({})
    const [hasSubmitted, setHasSubmitted] = useState(false)

    const dispatch = useDispatch();
    const {closeModal} =useModal();
    

    const signUpUserThunk = sessionActions.signUpUserThunk
    // const sessionUser = useSelector((state)=>state.session.user);

    // if(sessionUser) return <Navigate to='/' replace={true} />

    useEffect(()=>{
        const validationErrors = {};
        if(username.length < 4) validationErrors.username="Username must be at least 4 characters long"
        if(password.length < 6) validationErrors.password="Password must be at least 6 characters"

        setErrors(validationErrors)
    },[username, password])

    const handleSubmit = async(e)=>{
        e.preventDefault();
        setHasSubmitted(true)
        if (password === confirmPassword){
            setErrors({})
            // const response = dispatch(signUpUserThunk({username, firstName, lastName, email, password}));
            // console.log("AFTER DISPATCH", response)

            return dispatch(signUpUserThunk({username, firstName, lastName, email, password})).then(closeModal).catch(
                async(res)=>{
                    const data = await res.json();
                    if(res.status !== 200){
                        
                        setErrors(data.errors)
                      
                    }
                }
            )
        }
        return setErrors({
            confirmPassword: "Confirm Password field must be the same as the Password Field"
        })
        

    };
    const isFormValid = ()=> {
       const isFilled =  username && firstName && lastName && email && password && confirmPassword 
      
       if (isFilled && username.length >=4 && password.length >=6){
        return true
       }else{
        return false
       }
    }



    return(
        <>
        <h1>Sign Up</h1>
            <form onSubmit={handleSubmit}>
                <label>Email
                    <input type='text' value={email} onChange={(e)=> setEmail(e.target.value)} required />
                </label>
                {hasSubmitted && errors.email && <p>{errors.email}</p>}
                <label>Username
                    <input type='text' value={username} onChange={(e)=> setUsername(e.target.value)} required />
                </label>
                {hasSubmitted && errors.username && <p>{errors.username}</p>}
                <label>First Name
                    <input type='text' value={firstName} onChange={(e)=> setFirstName(e.target.value)} required />
                </label>
                {hasSubmitted && errors.firstName && <p>{errors.firstName}</p>}
                <label>Last Name
                    <input type='text' value={lastName} onChange={(e)=> setLastName(e.target.value)} required />
                </label>
                <div>
                {hasSubmitted && errors.lastName && <p>{errors.lastName}</p>}
                </div>
                <label>Password 
                    <input type='password' value={password} onChange={(e)=> setPassword(e.target.value)} required />
                </label>
                {hasSubmitted && errors.password && <p>{errors.password}</p>}
                <label>Confirm Password 
                    <input type='password' value={confirmPassword} onChange={(e)=> setConfirmPassword(e.target.value)} required />
                </label>
                {hasSubmitted && errors.confirmPassword && <p>{errors.confirmPassword}</p>}
                <button type='submit' disabled={!isFormValid()}>Sign Up</button>
            </form>
        </>
    )
}


export default SignupFormModal;