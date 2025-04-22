import { useState } from "react";
import { useAuth } from "../utils/AuthContext";
import { Link } from "react-router-dom";

export default function Register() {
  const { handleUserRegister } = useAuth();
  const [credentials, setCredentials] = useState({
    name: "",
    email: "",
    password1: "",
    password2: "",
  });
  const handleInputChange = (e) => {
    let name = e.target.name;
    let value = e.target.value;
    setCredentials({ ...credentials, [name]: value });
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#2e2e2ed6]">
      <div className="flex flex-col gap-[20px] bg-[#2E2E2E]  p-[30px] my-[20px] rounded-2xl">
        <form
          onSubmit={(e) => {
            handleUserRegister(e, credentials);
          }}
          className="flex flex-col gap-[10px] text-white text-[18px] font-semibold"
        >
          <div className="flex flex-col gap-[10px]">
            <label htmlFor="">Name:</label>
            <input
              type="text"
              required
              name="name"
              placeholder="Enter your name"
              value={credentials.name}
              onChange={handleInputChange}
              className="border-b text-white"
            />
          </div>
          <div className="flex flex-col gap-[10px]">
            <label htmlFor="">Email:</label>
            <input
              type="email"
              required
              name="email"
              placeholder="Enter your email"
              value={credentials.email}
              readOnly
              onFocus={(e) => e.target.removeAttribute('readOnly')}
              onChange={handleInputChange}
               className="border-b text-white"
            />
          </div>
          <div className="flex flex-col gap-[10px]">
            <label htmlFor="">Password:</label>
            <input
              type="password"
              required
              name="password1"
              placeholder="Enter your password"
              value={credentials.password1}
              onChange={handleInputChange}
               className="border-b text-white"
            />
          </div>
          <div className="flex flex-col gap-[10px]">
            <label htmlFor="">Confirm Password:</label>
            <input
              type="password"
              required
              name="password2"
              placeholder="Confirm your password"
              value={credentials.password2}
              onChange={handleInputChange}
               className="border-b text-white"
            />
          </div>
          <div>
            <input className="bg-[#10B981] px-[10px] py-[5px] rounded-md font-bold text-white cursor-pointer" type="submit" value="Register" />
          </div>
        </form>
        <p className="text-white font-semibold">
          Already have an account? <Link className="text-[#10B981]" to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
}
