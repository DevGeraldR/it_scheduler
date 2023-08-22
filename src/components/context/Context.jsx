import React, { createContext, useContext, useEffect } from "react";
import { useState } from "react";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { auth } from "../firebase/Firebase";
import { Dialog } from "@headlessui/react";
import { AiOutlineCloseCircle } from "react-icons/ai";

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
      if (
        error.code === "auth/invalid-email" ||
        error.code === "auth/user-not-found"
      ) {
        setError("Wrong password or email");
      } else {
        setError(error.message);
      }
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
    <AuthContext.Provider
      value={{
        logIn,
        logOut,
        currentUser,
        isAuthenticating,
        employee,
        setEmployee,
      }}
    >
      {children}
      
      <Dialog
  as="div"
  className="fixed inset-0 flex items-center justify-center z-10"
  open={!!error}
  onClose={() => setError(null)}
>

  <div className="fixed inset-0 bg-black bg-opacity-5 backdrop-blur-md z-0"></div>

  <Dialog.Panel
    className="w-full border border-slate-400 max-w-sm transform overflow-hidden rounded-2xl bg-white p-6 text-center align-middle shadow-xl transition-all flex flex-col items-center justify-center relative z-10"
    static
  >
    <Dialog.Title
      as="h3"
      className="text-lg font-bold leading-6 text-gray-900 mb-2"
    >
      <AiOutlineCloseCircle
        size={70}
        className="text-red-500"
      />
      Error!
    </Dialog.Title>
    <div className="mt-2">
      <p className="text-sm font-medium text-gray-500">
        Invalid email or password!
      </p>
    </div>

    <div className="mt-10 ">
      <button
        type="button"
        className="hover:text-white bg-yellow-300 w-[100px] rounded-md transition duration-300 ease-in-out transform hover:scale-100 bg-gray-100 px-4 py-2 text-sm font-medium text-black-900 hover:bg-yellow-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
        onClick={() => setError(null)}
      >
        Okay
      </button>
    </div>
  </Dialog.Panel>
</Dialog>

    </AuthContext.Provider>
  );
}
