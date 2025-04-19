import { Navigate, Outlet } from "react-router-dom";

export default function PrivateRoute(){
    const user = true;
    return(
        <>
        {user ? <Outlet/>:<Navigate to ='/login'/>}
        </>
    )
}