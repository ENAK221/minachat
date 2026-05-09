import { useUser } from "../context/UserContext.jsx";
import { Navigate } from "react-router-dom";

export default function PrivateRoute({ children }) {
  const { user, loading } = useUser();

  // ⏳ Pendant que UserContext charge l'utilisateur
  if (loading) {
    return <div>Chargement...</div>;
  }

  // ❌ Pas connecté
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // ✔ Connecté
  return children;
}

