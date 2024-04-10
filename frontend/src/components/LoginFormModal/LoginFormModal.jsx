import { useState } from "react"
import * as sessionActions from '../../store/session'
import { useDispatch } from "react-redux"
// import { Navigate } from "react-router-dom";
// import { logInUserThunk } from "../../store/session";
import {useModal} from '../../context/Modal'
import './LoginForm.css'
// import React from 'react';



const LoginFormModal = ()=>{
    
    // const [username, setUsername] = useState('');
    // const [email, setEmail] = useState('');
    const [credential, setCredential] = useState('')
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState({})

    const dispatch = useDispatch();
    const {closeModal} = useModal()
    // const sessionUser = useSelector((state)=>state.session.user);

    // if(sessionUser) return <Navigate to='/' replace={true} />

    const handleSubmit = async(e)=>{
        e.preventDefault();
        setErrors({});

        return dispatch(sessionActions.logInUserThunk({credential, password})).then(closeModal).catch(
            async(res)=>{
                const data = await res.json();
                if(res.status == 401){
                    setErrors(data)
                    console.log(errors)
                }
            }
        )
    };

    const isFormValid = ()=> credential.length >=4 && password.length >=6

    const demoUserLogIn = (e) =>{
       return dispatch(sessionActions.logInUserThunk({credential:'Demo-lition', password: 'password'})).then(closeModal)
    }

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
                type='password'
                value={password}
                onChange={(e)=>setPassword(e.target.value)}
                required
                />
            </label>
            {errors.message && <p>{errors.message}</p>}
            {errors.credential && <p>{errors.credential}</p>}
            <button onClick={(e)=>demoUserLogIn(e)}>Demo User</button>
            <button type='submit' disabled={!isFormValid()}>Log In</button>
        </form>
        </>       
    );
};




export default LoginFormModal