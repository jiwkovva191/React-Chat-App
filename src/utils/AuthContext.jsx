import { createContext, useContext, useState, useEffect } from "react";
import { account } from "../appwriteConfig";
import { useNavigate } from "react-router-dom";
import { ID } from "appwrite";

const AuthContext = createContext();
export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    getUserOnLoad();
  }, []);

  const getUserOnLoad = async () => {
    try {
      const accountDetails = await account.get();
      console.log("account details:", accountDetails);
      setUser(accountDetails);
    } catch (error) {
      console.info(error);
    }
    setLoading(false);
  };

  const handleUserLogin = async (e, credentials) => {
    e.preventDefault();

    try {
      //check if a session already exists
      const currentSession = await account.get();
      console.log("Existing session:", currentSession);

      //clear the existing session if needed
      await account.deleteSession("current"); //current - log out on this device
      console.log("Previous session cleared.");
    } catch (error) {
      //if no session exists, proceed to create a new one
      if (error.code != 401) {
        console.error("Error fetching session:", error);
        return;
      }
    }

    try {
      //create a new session
      const response = await account.createEmailPasswordSession(
        credentials.email,
        credentials.password
      );
      console.log("LOGGED IN:", response);

      const accountDetails = await account.get();
      setUser(accountDetails);
      navigate("/");
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  const handleUserLogout = async () => {
    account.deleteSession("current");
    setUser(null);
  };

  const handleUserRegister = async (e, credentials) => {
    e.preventDefault();

    if (credentials.password1 !== credentials.password2) {
      alert("Passwords do not match");
      return;
    }
    try {
      let response = await account.create(
        ID.unique(),
        credentials.email,
        credentials.password1,
        credentials.name
      );
      await account.createEmailPasswordSession(
        credentials.email,
        credentials.password1
      );

      const accountDetails = await account.get();
      console.log("account details:", accountDetails);
      setUser(accountDetails);
      navigate("/");
    } catch (err) {
      console.error(error);
    }
  };

  const contextData = {
    user,
    handleUserLogin,
    handleUserLogout,
    handleUserRegister,
  };
  return (
    <AuthContext.Provider value={contextData}>
      {loading ? <p>Loading...</p> : children}
    </AuthContext.Provider>
  );
};
export const useAuth = () => {
  return useContext(AuthContext);
};
export default AuthContext;
