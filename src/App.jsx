import { v4 as uuidv4 } from 'uuid';


import React, { useState } from "react";
import Calendar from "./components/Calendar";
import Tree from "./components/Tree";
import "./App.css";

const App = () => {
  const decorations = [
    "bauble1.svg",
    "bauble2.svg",
    "bauble3.svg",
    "bauble4.svg",
    "bauble5.svg",
    "bauble6.svg",
    "lights1.svg",
    "star.svg",
  ];
  const [view, setView] = useState("calendar");
  const [doors, setDoors] = useState(() => {
    const numbers = Array.from({ length: 24 }).map((_, index) => index + 1);
    for (let i = numbers.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [numbers[i], numbers[j]] = [numbers[j], numbers[i]]; // Swap
    }

    return numbers.map((num) => ({
      number: num,
      status: "closed",
      decoration:
        num === 1
          ? "lights1.svg"
          : num === 24
            ? "star.svg"
            : num === 10
              ? "garland.svg"
              : decorations[Math.floor(Math.random() * 6)],
    }));
  });
  const updateLocalStorage = (decorationType) => {
    const storedDecorations = JSON.parse(localStorage.getItem("decorations") || "[]");

    // Add the new decoration to the stored data with a unique ID
    storedDecorations.push({ id: uuidv4(), type: decorationType });

    localStorage.setItem("decorations", JSON.stringify(storedDecorations));
};



  const handleDoorClick = (doorNumber) => {
    setDoors((prevDoors) => {
      return prevDoors.map((door) => {
        if (door.number !== doorNumber) return door;

        let newStatus;
        switch (door.status) {
          case "closed":
            newStatus = "image";
            break;
          case "image":
            newStatus = "gray";
            break;
          default:
            newStatus = "closed";
        }

        return { ...door, status: newStatus };
      });
    });
  };
  const handleDecorationClick = (decoration) => {
    updateLocalStorage(decoration);
  };
  return (
    <div className="app-container">
      <div className="buttons">
        <button onClick={() => setView("calendar")}>Calendar</button>
        <button onClick={() => setView("tree")}>Decorations</button>
      </div>

      {view === "calendar" ? (
        <Calendar
          doors={doors}
          onDoorClick={handleDoorClick}
          onDecorationClick={handleDecorationClick}
        />
      ) : (
        <Tree />
      )}
    </div>
  );
};

export default App;
