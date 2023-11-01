import { v4 as uuidv4 } from "uuid";
import React, { useState, useEffect, useReducer } from "react";
import Calendar from "./components/Calendar";
import Tree from "./components/Tree";
import "./App.css";

const DECORATIONS = ["bauble1.svg", "bauble2.svg", "bauble3.svg", "bauble4.svg", "bauble5.svg", "bauble6.svg", "lights1.svg", "star.svg"];
const SPECIAL_DOORS = {
  1: "lights1.svg",
  10: "garland.svg",
  24: "star.svg"
};
const RANDOM_DECORATIONS = DECORATIONS.filter(deco => !Object.values(SPECIAL_DOORS).includes(deco));

const VIEWS = {
  CALENDAR: "calendar",
  TREE: "tree"
};

const doorStatusReducer = (state, action) => {
  switch (action.type) {
    case "initialize":
      return action.doors;
    case "toggle":
      return state.map(door => {
        if (door.number !== action.number) return door;
        return { ...door, status: getNextStatus(door.status) };
      });
    default:
      return state;
  }
};

const getNextStatus = (currentStatus) => {
  switch (currentStatus) {
    case "closed":
      return "image";
    case "image":
      return "gray";
    default:
      return "closed";
  }
};

const App = () => {
  const [view, setView] = useState(VIEWS.CALENDAR);
  const [doors, dispatchDoorAction] = useReducer(doorStatusReducer, []);

  useEffect(() => {
    initializeDoors();
  }, []);

  const initializeDoors = () => {
    const numbers = Array.from({ length: 24 }).map((_, index) => index + 1).sort(() => Math.random() - 0.5);
    const initializedDoors = numbers.map(num => ({
      number: num,
      status: "closed",
      decoration: SPECIAL_DOORS[num] || RANDOM_DECORATIONS[Math.floor(Math.random() * RANDOM_DECORATIONS.length)]
    }));
    dispatchDoorAction({ type: "initialize", doors: initializedDoors });
  };

  const updateLocalStorage = (decorationType) => {
    try {
      const storedDecorations = JSON.parse(localStorage.getItem("decorations") || "[]");
      storedDecorations.push({ id: uuidv4(), type: decorationType });
      localStorage.setItem("decorations", JSON.stringify(storedDecorations));
    } catch (error) {
      console.error("Failed to update local storage", error);
    }
  };

  const handleDoorClick = (doorNumber) => {
    dispatchDoorAction({ type: "toggle", number: doorNumber });
  };

  const handleDecorationClick = (decoration) => {
    updateLocalStorage(decoration);
  };

  return (
    <div className="app-container">
      <div className="buttons">
        <button onClick={() => setView(VIEWS.CALENDAR)} aria-label="View calendar">Calendar</button>
        <button onClick={() => setView(VIEWS.TREE)} aria-label="View tree">Decorations</button>
      </div>
      {view === VIEWS.CALENDAR ? (
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
