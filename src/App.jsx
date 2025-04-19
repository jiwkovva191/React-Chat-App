import Room from "./pages/Room";
import Login from "./pages/LoginPage";
import PrivateRoutes from "./components/PrivateRoutes";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import { AuthProvider } from "./utils/AuthContext";

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route element={<PrivateRoutes />}>
            <Route path="/" element={<Room />} />{" "}
            {/*when the user is not authenticated, they are being redirected to login page */}
          </Route>
        </Routes>
      </AuthProvider>
    </Router>
  );
}
