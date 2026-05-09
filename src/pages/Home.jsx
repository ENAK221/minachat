import { motion } from "framer-motion";
import { Navigate } from "react-router-dom";

export default function Home() {
  // Rediriger directement vers la page de connexion
  return <Navigate to="/login" replace />;
}
