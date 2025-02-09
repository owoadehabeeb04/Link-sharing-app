"use client";
import { getShowUser } from "@/app/api/user";
import { linkProps, userProps } from "@/dataTypes";
import { auth } from "@/utils/firebaseconfig";
import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { useRouter, usePathname } from 'next/navigation';
import { onAuthStateChanged } from 'firebase/auth';
import Loader from '../loader';
import { useQuery } from "@tanstack/react-query";

interface addLinkprops {
name: string;
link: string;
image?: string;
backgroundColor?: string;
}
interface ContextProps {
  currentUserIdData: any;
  setCurrentUserIdData: React.Dispatch<React.SetStateAction<userProps[]>>;
  activePage: string;
  setActivePage: React.Dispatch<React.SetStateAction<string>>;
  userDetails: userProps[];
  setUserDetails: React.Dispatch<React.SetStateAction<userProps[]>>;
  links: linkProps[];
  setLinks: React.Dispatch<React.SetStateAction<linkProps[]>>;
  linkAdd: addLinkprops[];
  setLinkAdd: React.Dispatch<React.SetStateAction<addLinkprops[]>>;
  isAuthenticated: boolean;
  usersLoading: boolean
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
  const [linkAdd, setLinkAdd] = useState<addLinkprops[]>([
    {
      name: "Github",
      link: "https://www.github.com/",
      image: "",
    },
  ]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  
  const { data: users, isLoading: usersLoading } = useQuery({
    queryKey: ['users'],
    queryFn: getShowUser,
  });

  useEffect(() => {
    if (users) {
      setUserDetails(users);
      const userId = auth.currentUser?.uid;
      const currentUser: any = users.find((user: userProps) => user.userId === userId);
      if (currentUser) {
        setCurrentUserIdData(currentUser);
      }
    }
  }, [users]);
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsAuthenticated(!!user);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);


  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const users = await getShowUser();
  //       setUserDetails(users);

  //       const userId = auth.currentUser?.uid;
  //       console.log(userId);
  //       const currentUserData: any = users.find(
  //         (user: userProps) => user.userId === userId
  //       );

  //       if (currentUserData) {
  //         setCurrentUserIdData(currentUserData);
  //       } else {
  //         console.log("User not found in userDetails array");
  //       }
  //     } catch (error) {
  //       console.error("Error fetching user data:", error);
  //     }
  //   };

  //   fetchData();
  // }, []);

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
        setLinkAdd,
        linkAdd,
        isAuthenticated,
        usersLoading,
        
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
