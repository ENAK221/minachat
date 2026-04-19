import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";

export default function AdminRoute({ children }) {
  const { user } = useContext(UserContext);
  return user?.role === "admin" ? children : <Navigate to="/" replace />;
}
