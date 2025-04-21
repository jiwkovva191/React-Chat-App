import { createContext, useContext, useState, useEffect } from "react";
import { account } from "../appwriteConfig";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();
export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    getUserOnLoad();
  }, []);

  const getUserOnLoad = async ()=>{
    try{
      const accountDetails = await account.get();
      console.log("account details:",accountDetails);
      setUser(accountDetails);

    }catch(error){
console.error(error);
    }
    setLoading(false);
  }

  const handleUserLogin = async (e, credentials) => {
    e.preventDefault();

    try{
      //check if a session already exists
      const currentSession =  await account.get();
      console.log("Existing session:", currentSession);

      //clear the existing session if needed
      await account.deleteSession('current');//current - log out on this device
      console.log("Previous session cleared.");

     
    }catch(error){
      //if no session exists, proceed to create a new one
      if(error.code != 401){
        console.error("Error fetching session:",error);
        return;
      }
      
    }

    try{
      //create a new session
      const response = await account.createEmailPasswordSession(credentials.email, credentials.password);
      console.log('LOGGED IN:', response);
      
      const accountDetails = account.get();
      setUser(accountDetails);
      navigate('/');

    }catch(error){
      console.error("Login error:", error);
    }
  };

  
  const contextData = { user,handleUserLogin };
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
