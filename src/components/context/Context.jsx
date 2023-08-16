import React, { createContext, useContext, useEffect } from "react";
import { useState } from "react";
import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth } from "../firebase/Firebase";
import { Dialog } from "@headlessui/react";

const AuthContext = createContext();

export function useGlobal() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState();
  const [isAuthenticating, setIsAuthenticating] = useState(true);
  const [error, setError] = useState(null);
  
  const logIn = async (email, password) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setError(null);
    } catch (error) {
      setError(error.message);
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

  const employeeInitialState = () => {
    const employeeDetails = JSON.parse(localStorage.getItem("employeeDetails"));
    return employeeDetails ? employeeDetails : [];
  };

  const [employee, setEmployee] = useState(employeeInitialState);

  useEffect(() => {
    localStorage.setItem("employeeDetails", JSON.stringify(employee));
  }, [employee]);

  return (
    <AuthContext.Provider value={{ logIn, logOut, currentUser, isAuthenticating, employee, setEmployee }}>
      {children}
      <Dialog
        as="div"
        className="fixed inset-0 flex items-center justify-center z-10"
        open={!!error}
        onClose={() => setError(null)}
      >
        <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />
        <div className="bg-white p-4 rounded-md shadow-md z-20">
          <Dialog.Title className="text-lg font-semibold mb-2">Error</Dialog.Title>
          <p className="text-red-600">{error}</p>
          <button
            className="mt-4 px-2 py-1 bg-red-600 text-white rounded-md"
            onClick={() => setError(null)}
          >
            Close
          </button>
        </div>
      </Dialog>
    </AuthContext.Provider>
  );
}
