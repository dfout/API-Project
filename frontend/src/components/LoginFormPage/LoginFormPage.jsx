import { useState } from "react"
import * as sessionActions from '../../store/session'
import { useDispatch, useSelector } from "react-redux"
import { Navigate } from "react-router-dom";
// import { logInUserThunk } from "../../store/session";
import './LoginFormPage.css'



const LoginFormPage = ()=>{
    
    // const [username, setUsername] = useState('');
    // const [email, setEmail] = useState('');
    const [credential, setCredential] = useState('')
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState({})

    const dispatch = useDispatch();
    const sessionUser = useSelector((state)=>state.session.user);

    if(sessionUser) return <Navigate to='/' replace={true} />

    const handleSubmit = async(e)=>{
        e.preventDefault();
        setErrors({});

        return dispatch(sessionActions.logInUserThunk({credential, password})).catch(
            async(res)=>{
                const data = await res.json();
                if(res.status == 401){
                    setErrors(data.message)
                    console.log(errors)
                }
            }
        )
    };

    return(
        <>
        <h1>Log In</h1>
        <form onSubmit={handleSubmit}>
            <label>Username or Email
                <input 
                type='text'
                value={credential}
                onChange={(e)=>setCredential(e.target.value)}
                required
                />
            </label>
            <label>
                Password 
                <input
                type='text'
                value={password}
                onChange={(e)=>setPassword(e.target.value)}
                required
                />
            </label>
            {/* {errors.message && <p>{errors.message}</p>}
            {errors.credential && <p>{errors.credential}</p>} */}
            <button type='submit'>Log In</button>
        </form>
        </>       
    );
};




export default LoginFormPage