import { LogOut } from "react-feather";
import { useAuth } from "../utils/AuthContext";
export default function Header() {
    const {user, handleUserLogout} = useAuth();
  return (
    <div className="flex flex-row gap-[50px] text-white text-[25px] font-semibold">
      {user ? (
        <>
          Welcome, {user.name}
          <LogOut onClick={handleUserLogout} className="cursor-pointer" />
        </>
      ) : (
        <button>Login</button>
      )}
    </div>
  );
}
