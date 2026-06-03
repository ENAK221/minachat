import { Link, useNavigate } from "react-router-dom";
import { FaHome, FaUser, FaSignInAlt, FaComments, FaLock, FaSignOutAlt, FaUsers } from "react-icons/fa";
import { useUser } from "../context/UserContext.jsx";

export default function Navbar() {
  const { user, setUser } = useUser();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    navigate("/");
  };

  return (
    <nav className="bg-white shadow-md px-6 py-4 flex justify-between items-center animate-fade-in">
      <Link to="/" className="text-2xl font-bold text-blue-600">
        Minachat
      </Link>

      <div className="flex gap-6 text-lg items-center">
        <Link to="/" className="flex items-center gap-2 hover:text-blue-600 transition">
          <FaHome /> Accueil
        </Link>

        {user && (
          <Link to="/chat" className="flex items-center gap-2 hover:text-blue-600 transition">
            <FaComments /> Chat
          </Link>
        )}

        {user && (
          <Link to="/groups" className="flex items-center gap-2 hover:text-blue-600 transition">
            <FaUsers /> Groupes
          </Link>
        )}

        {user && (
          <Link to={`/profile/${user.id}`} className="flex items-center gap-2 hover:text-blue-600 transition">
            <FaUser /> Profil
          </Link>
        )}

        {user?.role === "admin" && (
          <Link to="/admin" className="flex items-center gap-2 hover:text-blue-600 transition">
            <FaLock /> Admin
          </Link>
        )}

        {!user ? (
          <Link to="/login" className="flex items-center gap-2 hover:text-blue-600 transition">
            <FaSignInAlt /> Connexion
          </Link>
        ) : (
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-slate-700 hover:text-blue-600 transition"
          >
            <FaSignOutAlt /> Déconnexion
          </button>
        )}
      </div>
    </nav>
  );
}
