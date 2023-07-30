import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGlobal } from "../context/Context";

function Login() {
  const { logIn } = useGlobal();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  //To sign in the user it uses firebase authentication
  const handleClick = async () => {
    await logIn(email, password);
    // To not navigate the user to admin page if password or email is wrong
    navigate("/homepage");
  };
  return (
    <div className="w-full h-screen flex justify-center items-center bg-gray-100">
      <form
        className="p-10 bg-white rounded-xl drop-shadow-lg space-y-5"
        onSubmit={(e) => {
          e.preventDefault();
          handleClick();
        }}
      >
        <h1 className="text-center text-3xl">IT Scheduler</h1>
        <div className="flex flex-col space-y-2">
          <label className="text-sm font-light">Email</label>
          <input
            className="w-full px-3 py-2 rounded-md border border-slate-400"
            type="email"
            placeholder="Email"
            id="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
        </div>
        <div className="flex flex-col space-y-2">
          <label className="text-sm font-light">Password</label>
          <input
            className="w-full px-3 py-2 rounded-md border border-slate-400"
            type="password"
            placeholder="Password"
            id="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </div>
        <button
          type="submit"
          className="w-full rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
        >
          Login
        </button>
      </form>
    </div>
  );
}

export default Login;
