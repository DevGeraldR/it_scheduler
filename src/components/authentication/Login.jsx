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

  //To sign in the user it uses firebase authentication 
  const handleClick = async () => {
    await logIn(email, password);
    // To not navigate the user to admin page if password or email is wrong
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

        className="p-10 w-[650px] h-[500px] bg-white rounded-xl drop-shadow-lg space-y-5 border border-slate-400  flex flex-col items-center"

        onSubmit={(e) => {
          e.preventDefault();
          handleClick();
        }}

      >
        <div className="Taskus_logoname w-[600px] h-[90px] bg-yellow-300 flex items-center rounded-xl shadow-lg border border-slate-400">
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
        <button
          type="submit"

          className=" bg-yellow-300 w-[120px] rounded-md border border-transparent bg-gray-100 px-4 py-2 text-sm font-medium text-black-900 hover:bg-yellow-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
        >
          Login
        </button>
      </form>
    </div >
  );
}

export default Login;
