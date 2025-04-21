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
    <div>
      <div>
        <form onSubmit={(e)=>{handleUserLogin(e,credentials)}}>
          <div>
            <label htmlFor="">Email:</label>
            <input
              type="email"
              required
              name="email"
              placeholder="Enter your email"
              value={credentials.email}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label htmlFor="">Password:</label>
            <input
              type="password"
              required
              name="password"
              placeholder="Enter your password"
              value={credentials.password}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <input type="submit" value="Login" />
          </div>
        </form>
        <p>Don't have an account? Register <Link to ="/register">here</Link></p>
      </div>
    </div>
  );
}
