import { useState } from "react"
import { useDispatch } from "react-redux"
// import { Navigate } from "react-router-dom";
import * as sessionActions from '../../store/session'
import './SignupForm.css'

import { useModal } from "../../context/Modal";


const SignupFormModal= () => {

    const [username, setUsername] = useState('')
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [email,setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [errors, setErrors] = useState({})

    const dispatch = useDispatch();
    const {closeModal} =useModal();

    const signUpUserThunk = sessionActions.signUpUserThunk
    // const sessionUser = useSelector((state)=>state.session.user);

    // if(sessionUser) return <Navigate to='/' replace={true} />

    const handleSubmit = async(e)=>{
        e.preventDefault();
        if (password === confirmPassword){
            setErrors({})
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
                <div>
                {errors.email && <p>{errors.email}</p>}
                </div>
                <label>Username
                    <input type='text' value={username} onChange={(e)=> setUsername(e.target.value)} required />
                </label>
                {errors.username && <p>{errors.username}</p>}
                <label>First Name
                    <input type='text' value={firstName} onChange={(e)=> setFirstName(e.target.value)} required />
                </label>
                {errors.firstName && <p>{errors.firstName}</p>}
                <label>Last Name
                    <input type='text' value={lastName} onChange={(e)=> setLastName(e.target.value)} required />
                </label>
                <div>
                {errors.lastName && <p>{errors.lastName}</p>}
                </div>
                <label>Password 
                    <input type='password' value={password} onChange={(e)=> setPassword(e.target.value)} required />
                </label>
                {errors.password && <p>{errors.password}</p>}
                <label>Confirm Password 
                    <input type='password' value={confirmPassword} onChange={(e)=> setConfirmPassword(e.target.value)} required />
                </label>
                {errors.confirmPassword && <p>{errors.confirmPassword}</p>}
                <button type='submit' disabled={!isFormValid()}>Sign Up</button>
            </form>
        </>
    )
}


export default SignupFormModal;