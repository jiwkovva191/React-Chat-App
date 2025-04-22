import { useEffect, useState } from "react";
import { useAuth } from "../utils/AuthContext";
import { useNavigate, Link } from "react-router-dom";


export default function Login() {
  const { user, handleUserLogin } = useAuth();
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });
  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, []);

  const handleInputChange = (e) => {
    let name = e.target.name;
    let value = e.target.value;
    setCredentials({...credentials, [name]:value});
    console.log(credentials);
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#2e2e2ed6]">
      <div className="flex flex-col gap-[20px] bg-[#2E2E2E] p-[30px] my-[20px] rounded-2xl">
        <form className="flex flex-col gap-[10px] text-white font-semibold text-[18px]" onSubmit={(e)=>{handleUserLogin(e,credentials)}}>
          <div className="flex flex-col gap-[10px]">
            <label htmlFor="">Email:</label>
            <input
              type="email"
              required
              name="email"
              placeholder="Enter your email"
              value={credentials.email}
              onChange={handleInputChange}
              autoComplete="off"
              readOnly
              onFocus={(e) => e.target.removeAttribute('readOnly')}
              className="bg-transparent border-b text-white"
            />
          </div>
          <div className="flex flex-col gap-[10px]">
            <label htmlFor="">Password:</label>
            <input
              type="password"
              required
              name="password"
              placeholder="Enter your password"
              value={credentials.password}
              onChange={handleInputChange}
              className="bg-transparent border-b text-white"
            />
          </div>
          <div>
            <input className="bg-[#10B981] px-[10px] py-[5px] rounded-md font-bold text-white cursor-pointer" type="submit" value="Login" />
          </div>
        </form>
        <p className="text-white font-semibold">Don't have an account? Register <Link className="text-[#10B981]" to ="/register">here</Link>.</p>
      </div>
    </div>
  );
}
