"use client";
import { linkProps, userProps } from "@/dataTypes";
import React, { createContext, useContext, useState, ReactNode } from "react";

interface ContextProps {
  currentUserIdData: userProps[];
  setCurrentUserIdData: React.Dispatch<React.SetStateAction<userProps[]>>;
  activePage: string;
  setActivePage: React.Dispatch<React.SetStateAction<string>>;
  userDetails: userProps[];
  setUserDetails: React.Dispatch<React.SetStateAction<userProps[]>>;
  links: linkProps[];
  setLinks: React.Dispatch<React.SetStateAction<linkProps[]>>;
}

const Context = createContext<ContextProps | undefined>(undefined);

interface StateContextProps {
  children: ReactNode;
}

export const StateContext: React.FC<StateContextProps> = ({ children }) => {
  const [userDetails, setUserDetails] = useState<userProps[]>([]);
  const [currentUserIdData, setCurrentUserIdData] = useState<userProps[]>([]);
  const [activePage, setActivePage] = useState("");
  const [links, setLinks] = useState<linkProps[]>([]);

  return (
    <Context.Provider
      value={{
        userDetails,
        setUserDetails,
        currentUserIdData,
        setCurrentUserIdData,
        activePage,
        setActivePage,
        setLinks,
        links,
      }}
    >
      {children}
    </Context.Provider>
  );
};

export const useStateContext = () => {
  const context = useContext(Context);
  if (context === undefined) {
    throw new Error(
      "useStateContext must be used within a StateContext provider"
    );
  }
  return context;
};
