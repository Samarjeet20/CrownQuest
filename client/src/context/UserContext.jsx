import React, { createContext, useEffect, useState } from "react";
import BASE from "../config";

export const UserContext = createContext();

export const UserProvider = (props) => {
  const [userState, setUserState] = useState({
    photo: `${BASE}/public/dp/default.png`,
    requests: [],
    friends: [],
    userId: null,
    invites: [],
    /**
     * {userId, username, photo}
     * to be reset if user accepts any invite
     * socketReinitialize is used to reinitialize the socket connection
     */
    socketReinitialize: false,
  });

  useEffect(() => {
    console.log("user provider loaded...");
  }, []);

  return (
    <UserContext.Provider value={[userState, setUserState]}>
      {props.children}
    </UserContext.Provider>
  );
};
