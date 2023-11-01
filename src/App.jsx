import { v4 as uuidv4 } from "uuid";
import React, { useEffect, useReducer } from "react";
import { DecorationsProvider, useDecorations } from "./DecorationsContext";

import Calendar from "./components/Calendar";
import Tree from "./components/Tree";
import "./App.css";

const DECORATIONS = [
  "bauble1.svg",
  "bauble2.svg",
  "bauble3.svg",
  "bauble4.svg",
  "bauble5.svg",
  "bauble6.svg",
  "lights1.svg",
  "star.svg",
];
const SPECIAL_DOORS = {
  1: "lights1.svg",
  10: "garland.svg",
  24: "star.svg",
};
const RANDOM_DECORATIONS = DECORATIONS.filter(
  (deco) => !Object.values(SPECIAL_DOORS).includes(deco)
);

const doorStatusReducer = (state, action) => {
  let newState;
  switch (action.type) {
    case "initialize":
      newState = action.doors;
      break;
    case "toggle":
      newState = state.map((door) => {
        if (door.number !== action.number) return door;
        return { ...door, status: getNextStatus(door.status) };
      });
      break;
    default:
      newState = state;
  }
  localStorage.setItem("doors", JSON.stringify(newState));
  return newState;
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

const AppContent = () => {
  const [doors, dispatchDoorAction] = useReducer(doorStatusReducer, []);
  const { setDecorations } = useDecorations();
  console.log(setDecorations);

  useEffect(() => {
    const storedDecorations = JSON.parse(localStorage.getItem('decorations') || '[]');
  setDecorations(storedDecorations);
    initializeDoors();
  }, []);

  const initializeDoors = () => {
    let initializedDoors = JSON.parse(localStorage.getItem("doors") || "null");
    if (!initializedDoors) {
      const numbers = Array.from({ length: 24 })
        .map((_, index) => index + 1)
        .sort(() => Math.random() - 0.5);
      initializedDoors = numbers.map((num) => ({
        number: num,
        status: "closed",
        decoration:
          SPECIAL_DOORS[num] ||
          RANDOM_DECORATIONS[
            Math.floor(Math.random() * RANDOM_DECORATIONS.length)
          ],
      }));
    }
    dispatchDoorAction({ type: "initialize", doors: initializedDoors });
  };
  

  const updateLocalStorage = (decorationType) => {
    try {
      const storedDecorations = JSON.parse(
        localStorage.getItem("decorations") || "[]"
      );
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
    const updatedDecorations = [
      ...JSON.parse(localStorage.getItem("decorations") || "[]"),
    ];
    setDecorations(updatedDecorations);
  };

  return (
    <div className="app-container">
      <Calendar
        doors={doors}
        onDoorClick={handleDoorClick}
        onDecorationClick={handleDecorationClick}
      />
      <Tree />
    </div>
  );
};

const App = () => (
  <DecorationsProvider>
    <AppContent />
  </DecorationsProvider>
);

export default App;
