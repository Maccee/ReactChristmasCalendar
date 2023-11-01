import React, { createContext, useContext, useState } from 'react';

export const DecorationsContext = createContext({ decorations: [], setDecorations: () => {} });


export const useDecorations = () => {
  return useContext(DecorationsContext);
}

export const DecorationsProvider = ({ children }) => {
  const [decorations, setDecorations] = useState([]);

  return (
    <DecorationsContext.Provider value={{ decorations, setDecorations }}>
      {children}
    </DecorationsContext.Provider>
  )
}
