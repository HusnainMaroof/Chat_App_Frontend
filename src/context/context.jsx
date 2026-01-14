import { createContext, useState } from "react";

export const context = createContext();

export const ContextProvider = ({ children }) => {
  const [isAddContactOpen, setIsAddContactOpen] = useState(false);
  const [activeChat, setActiveChat] = useState(false);

  return (
    <context.Provider
      value={{
        isAddContactOpen,
        setIsAddContactOpen,
        activeChat,
        setActiveChat,
      }}
    >
      {children}
    </context.Provider>
  );
};
