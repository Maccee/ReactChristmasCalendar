import React, { useState, useEffect } from "react";

const Door = ({ door, onClick, onDecorationClick }) => {
    const handleDoorClick = () => {
      onClick(door.number);
    };
  
    if (door.status === "image") {
        return (
            <img
                src={`./src/assets/${door.decoration}`}
                alt="Decoration"
                className="door gray-background"
                onClick={() => {
                    handleDoorClick();  // This will change the status to "gray"
                    onDecorationClick(door.decoration);  // This will update the local storage
                }}
            />
        );
    }
  
    if (door.status === "gray") {
      return <div className="door gray-background"></div>;
    }
  
    return (
      <div className="door" onClick={handleDoorClick}>
        {door.number}
      </div>
    );
  };
  

export default Door;
