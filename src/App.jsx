import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useAuthContext, AuthProvider } from "@/context/AuthContext";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import Dashboard from "@/pages/Dashboard";
import ResetPassword from "./pages/ResetPassword";
//import { seedFirestore } from "./seedFirestore";
//import { useEffect } from "react";


const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuthContext();
  if (loading) return null;
  return user ? children : <Navigate to="/login" />;
};


function App() {

//   useEffect(() => {
//   seedFirestore(); // run once
// }, []);
  return (
    
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/resetpswd" element={<ResetPassword />} />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
