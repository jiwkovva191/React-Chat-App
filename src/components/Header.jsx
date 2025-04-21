import { LogOut } from "react-feather";
import { useAuth } from "../utils/AuthContext";
export default function Header() {
    const {user} = useAuth();
  return (
    <div>
      {user ? (
        <>
          Welcome {user.name}
          <LogOut />
        </>
      ) : (
        <button>Login</button>
      )}
    </div>
  );
}
