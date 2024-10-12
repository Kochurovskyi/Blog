import React from "react";
import ReactDOM from "react-dom";

import "./Backdrop.css";

function Backdrop(props) {
  const backdropElement = document.getElementById("backdrop-hook");
  console.log("Backdrop element:", backdropElement); // Add this line to log the element

  if (!backdropElement) {
    console.error("Backdrop element not found!");
    return null; // Return null to avoid rendering if the element is not found
  }

  return ReactDOM.createPortal(
    <div className="backdrop" onClick={props.onClick}></div>,
    backdropElement
  );
}

export default Backdrop;
