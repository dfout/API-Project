// Imports 
import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";

// Import Components
// import LoginFormPage from './components/LoginFormPage'
import SignupFormPage from './components/SignupFormPage'
import Navigation from './components/Navigation'

// Import Actions
import * as sessionActions from './store/session';



// Page Layout and effects directly on the original page Layout
function Layout(){
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded]= useState(false)


  useEffect(()=>{
    dispatch(sessionActions.restoreUserThunk()).then(()=>{
      setIsLoaded(true)
    })
  }, [dispatch])

  return(
    <>
      <Navigation isLoaded={isLoaded} />
      {isLoaded && <Outlet/>}
    
    </>
  )

}


// Router/Browser pathways
const router = createBrowserRouter([
  {
    element: <Layout/>,
    children: [
      {
        path:'/',
        element:<h1>Welcome!</h1>
      },
      {
        path: '/signup',
        element: <SignupFormPage/>
      }
    ]
  }

])


// Router Providing to the Application
function App() {
  return <RouterProvider router={router}/>
}

export default App;
