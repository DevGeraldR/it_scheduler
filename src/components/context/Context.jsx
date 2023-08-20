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
      if (error.code === "auth/invalid-email" || error.code === "auth/user-not-found") {
        setError("Wrong password or email");
      } else {
        setError(error.message);
      }
    }
  }
  

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
             className="hover:text-white mt-4 px-2 py-1  bg-red-300 w-[50px]l-[110px] rounded-md transition duration-300 ease-in-out transform hover:scale-100  bg-gray-100 px-4 py-2 text-sm font-medium  text-black-900 hover:bg-red-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
            onClick={() => setError(null)}
          >
            Close
          </button>
        </div>
      </Dialog>
    </AuthContext.Provider>
  );
}
