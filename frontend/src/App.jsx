// Imports 
import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";

// Import Components
import SpotsPage from './components/SpotsPage/SpotsPage';
import Navigation from './components/Navigation'
import ManageSpots from './components/ManageSpots';

// Import Actions
import * as sessionActions from './store/session';
// import * as spotActions from './store/spot'
import SpotDetail from './components/SpotDetailPage/SpotDetail';
import CreateSpotPage from './components/CreateSpotPage';
import EditSpotForm from './components/EditSpotForm';




// Page Layout and effects directly on the original page Layout
function Layout(){
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded]= useState(false)


  useEffect(()=>{
    dispatch(sessionActions.restoreUserThunk()).then(()=>{
      setIsLoaded(true)
    })
    // dispatch(spotActions.getAllSpotsThunk())
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
        element:<SpotsPage />
      },
      {
        path: '/spots/:spotId',
        element: <SpotDetail/>
      },
      {
        path: '/spots/create',
        element:<CreateSpotPage />
      },
      {
        path:'/spots/:spotId/edit',
        element: <EditSpotForm/>

      },
      {
        path:'/spots/manage',
        element: <ManageSpots />

      }
    ]
  }

])


// Router Providing to the Application
function App() {
  return <RouterProvider router={router}/>
}

export default App;
