import { LogOut } from "react-feather";
import { useAuth } from "../utils/AuthContext";
export default function Header() {
    const {user, handleUserLogout} = useAuth();
  return (
    <div>
      {user ? (
        <>
          Welcome, {user.name}
          <LogOut onClick={handleUserLogout} />
        </>
      ) : (
        <button>Login</button>
      )}
    </div>
  );
}
