// import React from 'react';
import { useState } from 'react';
import { useModal } from '../../context/Modal';
import '../Navigation/OpenModalMenuItem.css'


function OpenModalMenuItem({
  modalComponent, // component to render inside the modal
  itemText, // text of the menu item that opens the modal
  onItemClick, // optional: callback function that will be called once the menu item that opens the modal is clicked
  onModalClose, // optional: callback function that will be called once the modal is closed
  style
}) {



  const { setModalContent, setOnModalClose } = useModal();

  const [isHovered, setIsHovered] = useState(false)

  const handleMouseEnter = () =>{
    setIsHovered(true)
  };

  const handleMouseLeave = ()=>{
    setIsHovered(false)
  }

  const spanStyle ={
    ...style,
    cursor: 'pointer',
    textDecoration: isHovered ? "underline" : 'none'

  }


  const onClick = () => {
    if (onModalClose) setOnModalClose(onModalClose);
    setModalContent(modalComponent);
    if (typeof onItemClick === "function") onItemClick();
  };

  return (
    <span className='modal-link'onClick={onClick}
    style={spanStyle}
    onMouseEnter={handleMouseEnter}
    onMouseLeave={handleMouseLeave}
    >{itemText}
    </span>
  );
}

export default OpenModalMenuItem;