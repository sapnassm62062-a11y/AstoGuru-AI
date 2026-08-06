import { Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Home from "./pages/Home";
import ProtectedRoute from "./components/ProtectedRoute";
import BirthDetails from "./pages/BirthDetails";
import Chat from "./pages/Chat";
function App() {
  return (
    <Routes>

      <Route path="/" element={<Login />} />

      <Route path="/login" element={<Login />} />

      <Route path="/signup" element={<Signup />} />

      <Route
 path="/dashboard"
 element={
   <ProtectedRoute>
      <Dashboard />
   </ProtectedRoute>
 }
/>
<Route
 path="/birth-details"
 element={
   <ProtectedRoute>
      <BirthDetails />
   </ProtectedRoute>
 }
/>
<Route
 path="/chat"
 element={
   <ProtectedRoute>
      <Chat />
   </ProtectedRoute>
 }
/>
<Route 
 path="/birth-details" 
 element={<BirthDetails />}
/>
<Route path="/chat" element={<Chat />} />
      <Route path="/" element={<Home />} />
     

    </Routes>
  );
}

export default App;