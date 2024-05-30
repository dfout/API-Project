import { useParams } from "react-router-dom";
import SpotForm from "./SpotForm";
import { useSelector } from 'react-redux';


export const EditSpotForm = ()=>{
    const {spotId} = useParams();
    let spot;
    let spots = useSelector((state)=> state.spots)
}