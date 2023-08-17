"use client";

import React, { useContext, createContext } from "react";

import { db } from "../firebase/firebase";

const FirestoreContext = createContext(null);

export const FirestoreProvider = ({ children }) => {
  const value = { db };

  return <FirestoreContext.Provider value={value}>{children}</FirestoreContext.Provider>;
};

export const useFirestore = () => {
  return useContext(FirestoreContext);
};
