import React, { createContext, useContext, useEffect } from "react";
import { useState } from "react";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { auth } from "../firebase/Firebase";

const AuthContext = createContext();

export function useGlobal() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState();
  const [isAuthenticating, setIsAuthenticating] = useState(true);

  const logIn = async (email, password) => {
    try {
      return await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      alert(error.message);
    }
  };

  const logOut = async () => {
    try {
      return await signOut(auth);
    } catch (error) {
      alert(error.message);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setIsAuthenticating(false);
    });
    return unsubscribe;
  }, []);

  // Local Storage: setting & getting data
  const employeeInitialState = () => {
    const employeeDetails = JSON.parse(localStorage.getItem("employeeDetails"));

    return employeeDetails ? employeeDetails : [];
  };

  const [employee, setEmployee] = useState(employeeInitialState);

  useEffect(() => {
    localStorage.setItem("employeeDetails", JSON.stringify(employee));
  }, [employee]);

  const value = {
    logIn,
    logOut,
    currentUser,
    isAuthenticating,
    employee,
    setEmployee,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
