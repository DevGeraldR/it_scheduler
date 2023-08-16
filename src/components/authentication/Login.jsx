import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGlobal } from "../context/Context";
import Taskus_logoname from '../Images/Taskus_logoname.png';
import Taskus_bg from '../Images/Taskus_bg.png';
function Login() {
  const { logIn } = useGlobal();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccessfulOpen, setIsSuccessfulOpen] = useState(false);
  const [isErrorOpen, setIsErrorOpen] = useState(false);

  //To sign in the user it uses firebase authentication 
  const handleClick = async () => {
    setIsLoading(true)
    await logIn(email, password);
    // To not navigate the user to admin page if password or email is wrong
    setIsLoading(false)
    setIsSuccessfulOpen(true);
    navigate("/homepage");
  };
  return (

    <div
      className="w-full h-screen flex justify-center items-center"
      style={{
        backgroundImage: `url(${Taskus_bg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat"
      }}
    >
      <form

        className="p-10  bg-white rounded-xl drop-shadow-lg space-y-5 border border-slate-400  flex flex-col items-center"

        onSubmit={(e) => {
          e.preventDefault();
          handleClick();
        }}

      >
        <div className="Taskus_logoname w-[600px] h-[90px] bg-slate-900 flex items-center rounded-xl shadow-lg border border-slate-400">
          <img src={Taskus_logoname} width="300" height="80px" alt="Taskus Logo" className="ml-4" />
        </div>
        <div className="flex flex-col space-y-2">
          <br />
          <input
            className="w-[450px] px-3 py-2 rounded-md border border-slate-400"
            type="email"
            placeholder="Email"
            id="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
        </div>
        <div className="flex flex-col space-y-2">
          <input
            className="w-[450px] px-3 py-2 rounded-md border border-slate-400 "
            type="password"
            placeholder="Password"
            id="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </div>
        <br />  <br />  <br /> <br />
        {isLoading ? (
          <button
            disabled
            className="bg-yellow-400 transition duration-300 ease-in-out transform hover:scale-110 text-black hover:bg-yellow-500 focus-visible:ring-white inline-flex justify-center rounded-md border border-transparent px-4 py-2 text-sm font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
          >
            <svg
              className="w-5 h-5 mr-3 -ml-1 text-white animate-spin"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            Loading...
          </button>
        ) : (
          <button
            type="submit"
            className="hover:text-white border border-slate-400 shadow-md border bg-yellow-300 w-[120px] rounded-md transition duration-300 ease-in-out transform hover:scale-110  bg-gray-100 px-4 py-2 text-sm font-bold  text-black-900 hover:bg-yellow-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
          >
            Add
          </button>
        )}
      </form>
    </div >
  );
}

export default Login;
